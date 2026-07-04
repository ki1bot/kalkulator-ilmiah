import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  calculate,
  formatNumber,
  type AngleMode,
  type ButtonKind,
  type CalculatorButton,
  type HistoryItem,
} from "../utils/scientificCalculator";

export const useScientificCalculator = () => {
  const expression = ref("0");
  const angleMode = ref<AngleMode>("DEG");
  const memory = ref(0);
  const history = ref<HistoryItem[]>([]);
  const errorMessage = ref("");
  const lastAnswer = ref("0");
  const justCalculated = ref(false);

  const livePreview = computed(() => {
    if (!expression.value || expression.value === "0" || errorMessage.value) {
      return "";
    }

    try {
      const value = calculate(expression.value, angleMode.value);
      return `= ${formatNumber(value)}`;
    } catch {
      return "";
    }
  });

  const formattedMemory = computed(() => {
    return formatNumber(memory.value);
  });

  const isOperatorEnding = (value: string) => {
    return /(?:\+|-|×|÷|\^|mod)$/.test(value);
  };

  const replaceEndingOperator = (
    currentExpression: string,
    operator: string,
  ) => {
    return currentExpression.replace(/(?:\+|-|×|÷|\^|mod)$/, operator);
  };

  const closeMissingParentheses = (value: string) => {
    let balance = 0;

    for (const character of value) {
      if (character === "(") {
        balance += 1;
      }

      if (character === ")") {
        balance -= 1;
      }
    }

    return balance > 0 ? `${value}${")".repeat(balance)}` : value;
  };

  const clearError = () => {
    errorMessage.value = "";
  };

  const appendValue = (value: string, kind: ButtonKind) => {
    clearError();

    const startsNewExpression =
      justCalculated.value &&
      (kind === "number" || kind === "constant" || kind === "function");

    if (startsNewExpression) {
      expression.value = value === "." ? "0." : value;
      justCalculated.value = false;
      return;
    }

    justCalculated.value = false;

    if (
      kind === "operator" &&
      isOperatorEnding(expression.value) &&
      !["(", ")", "!", "%"].includes(value)
    ) {
      expression.value = replaceEndingOperator(expression.value, value);
      return;
    }

    if (expression.value === "0") {
      if (kind === "number") {
        expression.value = value === "." ? "0." : value;
        return;
      }

      if (kind === "function" || kind === "constant") {
        expression.value = value;
        return;
      }

      if (value === "-") {
        expression.value = "-";
        return;
      }
    }

    expression.value += value;
  };

  const evaluateCurrentExpression = () => {
    const normalizedExpression = closeMissingParentheses(expression.value);
    const value = calculate(normalizedExpression, angleMode.value);

    return {
      normalizedExpression,
      value,
      result: formatNumber(value),
    };
  };

  const calculateNow = () => {
    try {
      const result = evaluateCurrentExpression();

      expression.value = result.result;
      lastAnswer.value = result.result;
      justCalculated.value = true;
      errorMessage.value = "";

      history.value.unshift({
        expression: result.normalizedExpression,
        result: result.result,
        mode: angleMode.value,
      });

      history.value = history.value.slice(0, 10);
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Perhitungan tidak valid";
    }
  };

  const clearAll = () => {
    expression.value = "0";
    errorMessage.value = "";
    justCalculated.value = false;
  };

  const backspace = () => {
    clearError();

    if (justCalculated.value) {
      clearAll();
      return;
    }

    expression.value =
      expression.value.length > 1 ? expression.value.slice(0, -1) : "0";
  };

  const toggleAngleMode = () => {
    angleMode.value = angleMode.value === "DEG" ? "RAD" : "DEG";
  };

  const toggleSign = () => {
    clearError();

    if (expression.value === "0") {
      expression.value = "-";
      return;
    }

    if (expression.value.startsWith("-(") && expression.value.endsWith(")")) {
      expression.value = expression.value.slice(2, -1);
      return;
    }

    expression.value = `-(${expression.value})`;
  };

  const useCurrentValue = () => {
    const result = evaluateCurrentExpression();

    return result.value;
  };

  const memoryClear = () => {
    memory.value = 0;
  };

  const memoryRecall = () => {
    appendValue(formatNumber(memory.value), "number");
  };

  const memoryAdd = () => {
    try {
      memory.value += useCurrentValue();
      errorMessage.value = "";
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Nilai memori tidak valid";
    }
  };

  const memorySubtract = () => {
    try {
      memory.value -= useCurrentValue();
      errorMessage.value = "";
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Nilai memori tidak valid";
    }
  };

  const runAction = (action?: string) => {
    switch (action) {
      case "angle":
        toggleAngleMode();
        break;
      case "clear":
        clearAll();
        break;
      case "backspace":
        backspace();
        break;
      case "calculate":
        calculateNow();
        break;
      case "toggleSign":
        toggleSign();
        break;
      case "answer":
        appendValue(lastAnswer.value, "number");
        break;
      case "square":
        appendValue("^2", "operator");
        break;
      case "cube":
        appendValue("^3", "operator");
        break;
      case "inverse":
        appendValue("^-1", "operator");
        break;
      case "memoryClear":
        memoryClear();
        break;
      case "memoryRecall":
        memoryRecall();
        break;
      case "memoryAdd":
        memoryAdd();
        break;
      case "memorySubtract":
        memorySubtract();
        break;
    }
  };

  const handleButtonClick = (button: CalculatorButton) => {
    if (
      button.kind === "action" ||
      button.kind === "equals" ||
      button.kind === "memory"
    ) {
      runAction(button.action);
      return;
    }

    if (button.value) {
      appendValue(button.value, button.kind);
    }
  };

  const clearHistory = () => {
    history.value = [];
  };

  const selectHistoryResult = (result: string) => {
    expression.value = result;
    errorMessage.value = "";
    justCalculated.value = true;
  };

  const loadExpression = (value: string) => {
    expression.value = value;
    errorMessage.value = "";
    justCalculated.value = false;
  };

  const handleKeyboard = (event: KeyboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const key = event.key;

    if (/^\d$/.test(key)) {
      event.preventDefault();
      appendValue(key, "number");
      return;
    }

    const keyboardMap: Record<string, string> = {
      ".": ".",
      ",": ".",
      "+": "+",
      "-": "-",
      "*": "×",
      x: "×",
      X: "×",
      "/": "÷",
      "^": "^",
      "(": "(",
      ")": ")",
      "%": "%",
      "!": "!",
    };

    const mappedKey = keyboardMap[key];

    if (mappedKey) {
      event.preventDefault();
      appendValue(
        mappedKey,
        key === "." || key === "," ? "number" : "operator",
      );
      return;
    }

    if (key === "Enter" || key === "=") {
      event.preventDefault();
      calculateNow();
      return;
    }

    if (key === "Backspace") {
      event.preventDefault();
      backspace();
      return;
    }

    if (key === "Escape") {
      event.preventDefault();
      clearAll();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyboard);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyboard);
  });

  return {
    expression,
    angleMode,
    history,
    errorMessage,
    lastAnswer,
    livePreview,
    formattedMemory,
    handleButtonClick,
    clearHistory,
    selectHistoryResult,
    loadExpression,
  };
};
