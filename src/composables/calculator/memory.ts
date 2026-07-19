import { formatNumber } from "../../core/numberFormatter";
import type {
  CalculatorState,
  EvaluateCurrentExpression,
  ShowStatus,
} from "./types";

export const createCalculatorMemory = (
  state: CalculatorState,
  evaluateCurrentExpression: EvaluateCurrentExpression,
  insertResolvedValue: (value: string) => void,
  showStatus: ShowStatus,
) => {
  const memoryClear = () => {
    state.memory.value = 0;

    showStatus("Memori dihapus");
  };

  const memoryRecall = () => {
    insertResolvedValue(formatNumber(state.memory.value));

    showStatus("Nilai memori dipanggil");
  };

  const updateMemory = (operation: "add" | "subtract") => {
    try {
      const currentValue = evaluateCurrentExpression().value;

      const nextMemory =
        operation === "add"
          ? state.memory.value + currentValue
          : state.memory.value - currentValue;

      state.memory.value = Number(formatNumber(nextMemory));

      state.errorMessage.value = "";

      showStatus(
        operation === "add"
          ? "Nilai ditambahkan ke memori"
          : "Nilai dikurangi dari memori",
      );
    } catch (error) {
      state.errorMessage.value =
        error instanceof Error ? error.message : "Nilai memori tidak valid";
    }
  };

  return {
    memoryClear,
    memoryRecall,
    updateMemory,
  };
};
