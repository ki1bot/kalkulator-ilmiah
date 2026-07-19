import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { calculateExpression } from "../core/calculatorEngine";
import {
  appendDecimalPoint,
  clearLastEntry,
  closeOpenParentheses,
  getParenthesisBalance,
  hasTrailingBinaryOperator,
  hasTrailingValue,
  replaceTrailingOperator,
  smartBackspace,
} from "../core/expressionInput";
import { formatNumber } from "../core/numberFormatter";
import type {
  AngleMode,
  ButtonKind,
  CalculatorAction,
  CalculatorButton,
  HistoryItem,
} from "../types/calculator";

const storageKeys = {
  angleMode: "kalkulator-ilmiah-angle-mode",
  history: "kalkulator-ilmiah-history",
  lastAnswer: "kalkulator-ilmiah-last-answer",
  memory: "kalkulator-ilmiah-memory",
};

const isHistoryItem = (value: unknown): value is HistoryItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<HistoryItem>;

  return (
    typeof item.id === "string" &&
    typeof item.expression === "string" &&
    typeof item.result === "string" &&
    (item.mode === "DEG" || item.mode === "RAD") &&
    typeof item.createdAt === "number"
  );
};

export const useCalculator = () => {
  const expression = ref("0");
  const angleMode = ref<AngleMode>("DEG");
  const memory = ref(0);
  const history = ref<HistoryItem[]>([]);
  const lastAnswer = ref("0");
  const lastExpression = ref("");
  const errorMessage = ref("");
  const statusMessage = ref("");
  const justCalculated = ref(false);

  let statusTimer: number | undefined;

  const formattedMemory = computed(() => {
    return formatNumber(memory.value);
  });

  const memoryActive = computed(() => {
    return memory.value !== 0;
  });

  const livePreview = computed(() => {
    if (
      justCalculated.value ||
      errorMessage.value ||
      !expression.value ||
      expression.value === "0"
    ) {
      return "";
    }

    try {
      const normalized = closeOpenParentheses(expression.value);
      const result = calculateExpression(normalized, angleMode.value);

      return formatNumber(result);
    } catch {
      return "";
    }
  });

  const clearError = () => {
    errorMessage.value = "";
  };

  const showStatus = (message: string) => {
    statusMessage.value = message;

    if (statusTimer !== undefined) {
      window.clearTimeout(statusTimer);
    }

    statusTimer = window.setTimeout(() => {
      statusMessage.value = "";
    }, 1800);
  };

  const setExpression = (value: string) => {
    expression.value = value;
    justCalculated.value = false;
    lastExpression.value = "";
    clearError();
  };

  const prepareForInput = (kind: ButtonKind) => {
    const wasCalculated = justCalculated.value;

    const shouldStartNew =
      wasCalculated &&
      (kind === "number" || kind === "constant" || kind === "function");

    if (wasCalculated) {
      lastExpression.value = "";
    }

    if (shouldStartNew) {
      expression.value = "0";
    }

    justCalculated.value = false;
    clearError();
  };

  const appendNumber = (value: string) => {
    prepareForInput("number");

    if (value === ".") {
      expression.value = appendDecimalPoint(expression.value);

      return;
    }

    if (!expression.value || expression.value === "0") {
      expression.value = value;
      return;
    }

    expression.value += value;
  };

  const appendFunctionOrConstant = (value: string, kind: ButtonKind) => {
    prepareForInput(kind);

    if (!expression.value || expression.value === "0") {
      expression.value = value;
      return;
    }

    expression.value += value;
  };

  const appendOperator = (value: string) => {
    prepareForInput("operator");

    if (value === "(") {
      expression.value =
        !expression.value || expression.value === "0"
          ? "("
          : `${expression.value}(`;

      return;
    }

    if (value === ")") {
      try {
        const balance = getParenthesisBalance(expression.value);

        if (balance > 0 && hasTrailingValue(expression.value)) {
          expression.value += ")";
        }
      } catch (error) {
        errorMessage.value =
          error instanceof Error ? error.message : "Tanda kurung tidak valid";
      }

      return;
    }

    if (value === "!" || value === "%") {
      if (hasTrailingValue(expression.value)) {
        expression.value += value;
      }

      return;
    }

    if (!expression.value || expression.value === "0") {
      if (value === "-") {
        expression.value = "-";
      }

      return;
    }

    if (expression.value.endsWith("(")) {
      if (value === "-") {
        expression.value += "-";
      }

      return;
    }

    if (expression.value === "-") {
      if (value !== "-") {
        expression.value = "0";
      }

      return;
    }

    if (hasTrailingBinaryOperator(expression.value)) {
      const canAppendUnaryMinus =
        value === "-" && /(?:mod|[×÷^])$/.test(expression.value);

      expression.value = canAppendUnaryMinus
        ? `${expression.value}-`
        : replaceTrailingOperator(expression.value, value);

      return;
    }

    if (hasTrailingValue(expression.value)) {
      expression.value += value;
    }
  };

  const appendInput = (value: string, kind: ButtonKind) => {
    if (kind === "number") {
      appendNumber(value);
      return;
    }

    if (kind === "operator") {
      appendOperator(value);
      return;
    }

    if (kind === "function" || kind === "constant") {
      appendFunctionOrConstant(value, kind);
    }
  };

  const evaluateCurrentExpression = () => {
    const normalizedExpression = closeOpenParentheses(expression.value);

    const value = calculateExpression(normalizedExpression, angleMode.value);

    return {
      normalizedExpression,
      value,
      result: formatNumber(value),
    };
  };

  const calculateNow = () => {
    try {
      const calculation = evaluateCurrentExpression();

      const id =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      lastExpression.value = calculation.normalizedExpression;

      expression.value = calculation.result;
      lastAnswer.value = calculation.result;
      justCalculated.value = true;
      errorMessage.value = "";

      history.value = [
        {
          id,
          expression: calculation.normalizedExpression,
          result: calculation.result,
          mode: angleMode.value,
          createdAt: Date.now(),
        },
        ...history.value,
      ].slice(0, 20);
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Perhitungan tidak valid";
    }
  };

  const clearAll = () => {
    expression.value = "0";
    lastExpression.value = "";
    errorMessage.value = "";
    justCalculated.value = false;
  };

  const clearEntry = () => {
    clearError();

    expression.value = clearLastEntry(expression.value);

    justCalculated.value = false;
    lastExpression.value = "";
  };

  const backspace = () => {
    clearError();

    expression.value = smartBackspace(expression.value);

    justCalculated.value = false;
    lastExpression.value = "";
  };

  const appendPower = (power: string) => {
    prepareForInput("operator");

    if (hasTrailingValue(expression.value)) {
      expression.value += power;
    }
  };

  const toggleSign = () => {
    clearError();

    if (!expression.value || expression.value === "0") {
      expression.value = "-";
      justCalculated.value = false;
      return;
    }

    if (
      /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?$/.test(expression.value)
    ) {
      expression.value = expression.value.startsWith("-")
        ? expression.value.slice(1)
        : `-${expression.value}`;

      justCalculated.value = false;
      return;
    }

    try {
      if (expression.value.startsWith("-(") && expression.value.endsWith(")")) {
        expression.value = expression.value.slice(2, -1);
      } else {
        expression.value = `-(${closeOpenParentheses(expression.value)})`;
      }

      justCalculated.value = false;
      lastExpression.value = "";
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Ekspresi tidak valid";
    }
  };

  const insertResolvedValue = (value: string) => {
    prepareForInput("number");

    const resolved = value.startsWith("-") ? `(${value})` : value;

    if (!expression.value || expression.value === "0") {
      expression.value = value;
    } else {
      expression.value += resolved;
    }
  };

  const memoryClear = () => {
    memory.value = 0;
    showStatus("Memori dihapus");
  };

  const memoryRecall = () => {
    insertResolvedValue(formatNumber(memory.value));

    showStatus("Nilai memori dipanggil");
  };

  const updateMemory = (operation: "add" | "subtract") => {
    try {
      const currentValue = evaluateCurrentExpression().value;

      const nextMemory =
        operation === "add"
          ? memory.value + currentValue
          : memory.value - currentValue;

      const normalizedMemory = Number(formatNumber(nextMemory));

      memory.value = normalizedMemory;
      errorMessage.value = "";

      showStatus(
        operation === "add"
          ? "Nilai ditambahkan ke memori"
          : "Nilai dikurangi dari memori",
      );
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Nilai memori tidak valid";
    }
  };

  const toggleAngleMode = () => {
    angleMode.value = angleMode.value === "DEG" ? "RAD" : "DEG";

    clearError();
    showStatus(`Mode sudut ${angleMode.value}`);
  };

  const runAction = (action: CalculatorAction) => {
    switch (action) {
      case "toggle-angle":
        toggleAngleMode();
        break;

      case "clear":
        clearAll();
        break;

      case "clear-entry":
        clearEntry();
        break;

      case "backspace":
        backspace();
        break;

      case "calculate":
        calculateNow();
        break;

      case "toggle-sign":
        toggleSign();
        break;

      case "answer":
        insertResolvedValue(lastAnswer.value);
        break;

      case "square":
        appendPower("^2");
        break;

      case "cube":
        appendPower("^3");
        break;

      case "reciprocal":
        appendPower("^-1");
        break;

      case "memory-clear":
        memoryClear();
        break;

      case "memory-recall":
        memoryRecall();
        break;

      case "memory-add":
        updateMemory("add");
        break;

      case "memory-subtract":
        updateMemory("subtract");
        break;
    }
  };

  const handleButtonClick = (button: CalculatorButton) => {
    if (button.action) {
      runAction(button.action);
      return;
    }

    if (button.input) {
      appendInput(button.input, button.kind);
    }
  };

  const clearHistory = () => {
    history.value = [];
    showStatus("Riwayat dihapus");
  };

  const selectHistoryResult = (item: HistoryItem) => {
    expression.value = item.result;
    lastExpression.value = item.expression;
    angleMode.value = item.mode;
    errorMessage.value = "";
    justCalculated.value = true;
  };

  const loadExpression = (value: string) => {
    expression.value = value;
    lastExpression.value = "";
    errorMessage.value = "";
    justCalculated.value = false;
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(expression.value || "0");

      showStatus("Hasil disalin");
    } catch {
      showStatus("Gagal menyalin hasil");
    }
  };

  const handleKeyboard = (event: KeyboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const keyMap: Record<
      string,
      {
        value: string;
        kind: ButtonKind;
      }
    > = {
      ".": {
        value: ".",
        kind: "number",
      },
      ",": {
        value: ".",
        kind: "number",
      },
      "+": {
        value: "+",
        kind: "operator",
      },
      "-": {
        value: "-",
        kind: "operator",
      },
      "*": {
        value: "×",
        kind: "operator",
      },
      x: {
        value: "×",
        kind: "operator",
      },
      X: {
        value: "×",
        kind: "operator",
      },
      "/": {
        value: "÷",
        kind: "operator",
      },
      "^": {
        value: "^",
        kind: "operator",
      },
      "(": {
        value: "(",
        kind: "operator",
      },
      ")": {
        value: ")",
        kind: "operator",
      },
      "%": {
        value: "%",
        kind: "operator",
      },
      "!": {
        value: "!",
        kind: "operator",
      },
    };

    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      appendNumber(event.key);
      return;
    }

    const mapped = keyMap[event.key];

    if (mapped) {
      event.preventDefault();
      appendInput(mapped.value, mapped.kind);
      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();
      calculateNow();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      backspace();
      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();
      clearEntry();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      clearAll();
    }
  };

  onMounted(() => {
    const savedMode = localStorage.getItem(storageKeys.angleMode);

    const savedMemory = Number(localStorage.getItem(storageKeys.memory));

    const savedAnswer = localStorage.getItem(storageKeys.lastAnswer);

    const savedHistory = localStorage.getItem(storageKeys.history);

    if (savedMode === "DEG" || savedMode === "RAD") {
      angleMode.value = savedMode;
    }

    if (Number.isFinite(savedMemory)) {
      memory.value = savedMemory;
    }

    if (savedAnswer) {
      lastAnswer.value = savedAnswer;
    }

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as unknown;

        if (Array.isArray(parsed)) {
          history.value = parsed.filter(isHistoryItem).slice(0, 20);
        }
      } catch {
        history.value = [];
      }
    }

    window.addEventListener("keydown", handleKeyboard);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyboard);

    if (statusTimer !== undefined) {
      window.clearTimeout(statusTimer);
    }
  });

  watch(angleMode, (value) => {
    localStorage.setItem(storageKeys.angleMode, value);
  });

  watch(memory, (value) => {
    localStorage.setItem(storageKeys.memory, value.toString());
  });

  watch(lastAnswer, (value) => {
    localStorage.setItem(storageKeys.lastAnswer, value);
  });

  watch(
    history,
    (value) => {
      localStorage.setItem(storageKeys.history, JSON.stringify(value));
    },
    {
      deep: true,
    },
  );

  return {
    expression,
    angleMode,
    memoryActive,
    formattedMemory,
    history,
    lastAnswer,
    lastExpression,
    errorMessage,
    statusMessage,
    livePreview,
    setExpression,
    calculateNow,
    clearAll,
    handleButtonClick,
    clearHistory,
    selectHistoryResult,
    loadExpression,
    copyResult,
    toggleAngleMode,
  };
};
