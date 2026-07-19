import { computed, ref } from "vue";
import { calculateExpression } from "../../core/calculatorEngine";
import { closeOpenParentheses } from "../../core/expressionInput";
import { formatNumber } from "../../core/numberFormatter";
import type { AngleMode, HistoryItem } from "../../types/calculator";
import type { CalculatorState } from "./types";

export const createCalculatorState = (): CalculatorState => {
  return {
    expression: ref("0"),
    angleMode: ref<AngleMode>("DEG"),
    memory: ref(0),
    history: ref<HistoryItem[]>([]),
    lastAnswer: ref("0"),
    lastExpression: ref(""),
    errorMessage: ref(""),
    statusMessage: ref(""),
    justCalculated: ref(false),
  };
};

export const createCalculatorComputed = (state: CalculatorState) => {
  const formattedMemory = computed(() => {
    return formatNumber(state.memory.value);
  });

  const memoryActive = computed(() => {
    return state.memory.value !== 0;
  });

  const livePreview = computed(() => {
    if (
      state.justCalculated.value ||
      state.errorMessage.value ||
      !state.expression.value ||
      state.expression.value === "0"
    ) {
      return "";
    }

    try {
      const normalized = closeOpenParentheses(state.expression.value);

      const result = calculateExpression(normalized, state.angleMode.value);

      return formatNumber(result);
    } catch {
      return "";
    }
  });

  return {
    formattedMemory,
    memoryActive,
    livePreview,
  };
};
