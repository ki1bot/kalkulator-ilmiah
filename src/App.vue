<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  calculate,
  formatNumber,
  type AngleMode,
  type HistoryItem,
} from "./utils/calculator";

type ButtonKind =
  | "number"
  | "operator"
  | "function"
  | "constant"
  | "action"
  | "equals"
  | "memory";

type CalculatorButton = {
  label: string;
  value?: string;
  kind: ButtonKind;
  action?: string;
};

const expression = ref("0");
const angleMode = ref<AngleMode>("DEG");
const memory = ref(0);
const history = ref<HistoryItem[]>([]);
const errorMessage = ref("");
const lastAnswer = ref("0");
const justCalculated = ref(false);

const buttons: CalculatorButton[] = [
  { label: "DEG/RAD", kind: "action", action: "angle" },
  { label: "MC", kind: "memory", action: "memoryClear" },
  { label: "MR", kind: "memory", action: "memoryRecall" },
  { label: "M+", kind: "memory", action: "memoryAdd" },
  { label: "M-", kind: "memory", action: "memorySubtract" },
  { label: "⌫", kind: "action", action: "backspace" },

  { label: "sin", value: "sin(", kind: "function" },
  { label: "cos", value: "cos(", kind: "function" },
  { label: "tan", value: "tan(", kind: "function" },
  { label: "asin", value: "asin(", kind: "function" },
  { label: "acos", value: "acos(", kind: "function" },
  { label: "atan", value: "atan(", kind: "function" },

  { label: "sinh", value: "sinh(", kind: "function" },
  { label: "cosh", value: "cosh(", kind: "function" },
  { label: "tanh", value: "tanh(", kind: "function" },
  { label: "log", value: "log(", kind: "function" },
  { label: "ln", value: "ln(", kind: "function" },
  { label: "exp", value: "exp(", kind: "function" },

  { label: "√x", value: "sqrt(", kind: "function" },
  { label: "∛x", value: "cbrt(", kind: "function" },
  { label: "x²", kind: "action", action: "square" },
  { label: "x³", kind: "action", action: "cube" },
  { label: "xʸ", value: "^", kind: "operator" },
  { label: "x⁻¹", kind: "action", action: "inverse" },

  { label: "π", value: "π", kind: "constant" },
  { label: "e", value: "e", kind: "constant" },
  { label: "(", value: "(", kind: "operator" },
  { label: ")", value: ")", kind: "operator" },
  { label: "!", value: "!", kind: "operator" },
  { label: "%", value: "%", kind: "operator" },

  { label: "7", value: "7", kind: "number" },
  { label: "8", value: "8", kind: "number" },
  { label: "9", value: "9", kind: "number" },
  { label: "÷", value: "÷", kind: "operator" },
  { label: "mod", value: "mod", kind: "operator" },
  { label: "C", kind: "action", action: "clear" },

  { label: "4", value: "4", kind: "number" },
  { label: "5", value: "5", kind: "number" },
  { label: "6", value: "6", kind: "number" },
  { label: "×", value: "×", kind: "operator" },
  { label: "abs", value: "abs(", kind: "function" },
  { label: "±", kind: "action", action: "toggleSign" },

  { label: "1", value: "1", kind: "number" },
  { label: "2", value: "2", kind: "number" },
  { label: "3", value: "3", kind: "number" },
  { label: "-", value: "-", kind: "operator" },
  { label: "floor", value: "floor(", kind: "function" },
  { label: "ceil", value: "ceil(", kind: "function" },

  { label: "0", value: "0", kind: "number" },
  { label: ".", value: ".", kind: "number" },
  { label: "ANS", kind: "action", action: "answer" },
  { label: "+", value: "+", kind: "operator" },
  { label: "round", value: "round(", kind: "function" },
  { label: "=", kind: "equals", action: "calculate" },
];

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

const formattedMemory = computed(() => formatNumber(memory.value));

const isOperatorEnding = (value: string) => /(\+|-|×|÷|\^|mod)$/.test(value);

const replaceEndingOperator = (currentExpression: string, operator: string) =>
  currentExpression.replace(/(\+|-|×|÷|\^|mod)$/, operator);

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
    expression.value = value;
    justCalculated.value = false;
    return;
  }

  justCalculated.value = false;

  if (
    kind === "operator" &&
    isOperatorEnding(expression.value) &&
    value !== "(" &&
    value !== ")" &&
    value !== "!" &&
    value !== "%"
  ) {
    expression.value = replaceEndingOperator(expression.value, value);
    return;
  }

  if (
    expression.value === "0" &&
    value !== "+" &&
    value !== "×" &&
    value !== "÷" &&
    value !== "^" &&
    value !== "mod" &&
    value !== "!" &&
    value !== "%"
  ) {
    expression.value = value;
    return;
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

    history.value = history.value.slice(0, 8);
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

const buttonClass = (button: CalculatorButton) => {
  const base =
    "calculator-button rounded-2xl px-2 py-3 text-sm font-bold text-slate-100 shadow-lg shadow-slate-950/10 sm:text-base";

  const variants: Record<ButtonKind, string> = {
    number: "bg-slate-800/80 hover:bg-slate-700/90",
    operator: "bg-blue-600/85 hover:bg-blue-500",
    function: "bg-indigo-600/70 hover:bg-indigo-500",
    constant: "bg-cyan-600/75 hover:bg-cyan-500",
    action: "bg-slate-700/80 hover:bg-slate-600",
    memory: "bg-violet-600/70 hover:bg-violet-500",
    equals: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  };

  return `${base} ${variants[button.kind]}`;
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

  if (keyboardMap[key]) {
    event.preventDefault();
    appendValue(
      keyboardMap[key],
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
</script>

<template>
  <main class="min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
    <section class="mx-auto flex max-w-7xl flex-col gap-6">
      <header
        class="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-700/50 bg-slate-950/35 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row md:items-center"
      >
        <div>
          <p class="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
            Vue 3 + TypeScript
          </p>
          <h1
            class="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl"
          >
            Kalkulator Ilmiah
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Mendukung operasi dasar, trigonometri, logaritma, akar, pangkat,
            faktorial, persentase, modulo, konstanta, memori, riwayat, dan mode
            sudut.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div
            class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3"
          >
            <p class="text-slate-400">Mode</p>
            <p class="text-xl font-black text-cyan-200">{{ angleMode }}</p>
          </div>
          <div
            class="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3"
          >
            <p class="text-slate-400">Memory</p>
            <p class="text-xl font-black text-violet-200">
              {{ formattedMemory }}
            </p>
          </div>
          <div
            class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3"
          >
            <p class="text-slate-400">Last Ans</p>
            <p class="text-xl font-black text-emerald-200">{{ lastAnswer }}</p>
          </div>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section class="glass-panel rounded-[2rem] p-4 sm:p-6">
          <div class="display-panel rounded-[1.5rem] p-5">
            <div
              class="expression-scroll min-h-16 overflow-x-auto whitespace-nowrap text-right text-3xl font-black tracking-tight text-white sm:text-5xl"
            >
              {{ expression }}
            </div>

            <div
              class="mt-3 flex min-h-8 items-center justify-between gap-3 text-sm sm:text-base"
            >
              <p class="font-bold text-red-300">{{ errorMessage }}</p>
              <p class="ml-auto font-bold text-cyan-200">{{ livePreview }}</p>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-6 gap-2 sm:gap-3">
            <button
              v-for="button in buttons"
              :key="button.label"
              type="button"
              :class="buttonClass(button)"
              @click="handleButtonClick(button)"
            >
              {{ button.label }}
            </button>
          </div>
        </section>

        <aside class="flex flex-col gap-6">
          <section class="glass-panel rounded-[2rem] p-5">
            <h2 class="text-xl font-black text-white">Fitur</h2>

            <div class="mt-4 grid gap-3 text-sm text-slate-300">
              <div
                class="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
              >
                <p class="font-bold text-white">Operasi matematika</p>
                <p class="mt-1 leading-6">
                  Tambah, kurang, kali, bagi, pangkat, modulo, persentase,
                  faktorial, dan kurung.
                </p>
              </div>

              <div
                class="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
              >
                <p class="font-bold text-white">Fungsi ilmiah</p>
                <p class="mt-1 leading-6">
                  sin, cos, tan, inverse trigonometri, log, ln, exp, akar,
                  mutlak, pembulatan, floor, dan ceil.
                </p>
              </div>

              <div
                class="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
              >
                <p class="font-bold text-white">Input keyboard</p>
                <p class="mt-1 leading-6">
                  Angka, operator, Enter, Backspace, dan Escape bisa langsung
                  dipakai dari keyboard.
                </p>
              </div>
            </div>
          </section>

          <section class="glass-panel rounded-[2rem] p-5">
            <div class="flex items-center justify-between gap-3">
              <h2 class="text-xl font-black text-white">Riwayat</h2>
              <button
                type="button"
                class="rounded-xl border border-slate-700/70 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                @click="history = []"
              >
                Hapus
              </button>
            </div>

            <div
              v-if="history.length > 0"
              class="mt-4 flex max-h-[29rem] flex-col gap-3 overflow-y-auto pr-1"
            >
              <button
                v-for="(item, index) in history"
                :key="`${item.expression}-${index}`"
                type="button"
                class="history-item rounded-2xl p-4 text-left transition hover:border-cyan-400/35 hover:bg-slate-800/80"
                @click="expression = item.result"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="text-xs font-bold text-cyan-300">{{ item.mode }}</p>
                  <p class="text-xs text-slate-500">
                    #{{ history.length - index }}
                  </p>
                </div>
                <p class="mt-2 break-all text-sm text-slate-400">
                  {{ item.expression }}
                </p>
                <p class="mt-1 break-all text-xl font-black text-white">
                  = {{ item.result }}
                </p>
              </button>
            </div>

            <div
              v-else
              class="mt-4 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400"
            >
              Belum ada riwayat perhitungan.
            </div>
          </section>
        </aside>
      </div>
    </section>
  </main>
</template>
