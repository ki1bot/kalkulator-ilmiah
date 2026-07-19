import { onMounted, watch } from "vue";
import type { HistoryItem } from "../../types/calculator";
import type { CalculatorState } from "./types";

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

export const useCalculatorStorage = (state: CalculatorState) => {
  onMounted(() => {
    const savedMode = localStorage.getItem(storageKeys.angleMode);

    const savedMemory = localStorage.getItem(storageKeys.memory);

    const savedAnswer = localStorage.getItem(storageKeys.lastAnswer);

    const savedHistory = localStorage.getItem(storageKeys.history);

    if (savedMode === "DEG" || savedMode === "RAD") {
      state.angleMode.value = savedMode;
    }

    if (savedMemory !== null) {
      const memoryValue = Number(savedMemory);

      if (Number.isFinite(memoryValue)) {
        state.memory.value = memoryValue;
      }
    }

    if (savedAnswer) {
      state.lastAnswer.value = savedAnswer;
    }

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as unknown;

        if (Array.isArray(parsed)) {
          state.history.value = parsed.filter(isHistoryItem).slice(0, 20);
        }
      } catch {
        state.history.value = [];
      }
    }
  });

  watch(state.angleMode, (value) => {
    localStorage.setItem(storageKeys.angleMode, value);
  });

  watch(state.memory, (value) => {
    localStorage.setItem(storageKeys.memory, value.toString());
  });

  watch(state.lastAnswer, (value) => {
    localStorage.setItem(storageKeys.lastAnswer, value);
  });

  watch(
    state.history,
    (value) => {
      localStorage.setItem(storageKeys.history, JSON.stringify(value));
    },
    {
      deep: true,
    },
  );
};
