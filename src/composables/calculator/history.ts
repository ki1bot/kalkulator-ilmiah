import type { HistoryItem } from "../../types/calculator";
import type { CalculatorState, ShowStatus } from "./types";

export const createCalculatorHistory = (
  state: CalculatorState,
  showStatus: ShowStatus,
) => {
  const clearHistory = () => {
    state.history.value = [];

    showStatus("Riwayat dihapus");
  };

  const selectHistoryResult = (item: HistoryItem) => {
    state.expression.value = item.result;

    state.lastExpression.value = item.expression;

    state.angleMode.value = item.mode;

    state.errorMessage.value = "";

    state.justCalculated.value = true;
  };

  return {
    clearHistory,
    selectHistoryResult,
  };
};
