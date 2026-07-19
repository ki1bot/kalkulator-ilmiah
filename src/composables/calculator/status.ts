import type { CalculatorState } from "./types";

export const createStatusController = (state: CalculatorState) => {
  let statusTimer: number | undefined;

  const clearError = () => {
    state.errorMessage.value = "";
  };

  const showStatus = (message: string) => {
    state.statusMessage.value = message;

    if (statusTimer !== undefined) {
      window.clearTimeout(statusTimer);
    }

    statusTimer = window.setTimeout(() => {
      state.statusMessage.value = "";
    }, 1800);
  };

  const disposeStatus = () => {
    if (statusTimer !== undefined) {
      window.clearTimeout(statusTimer);
    }
  };

  return {
    clearError,
    showStatus,
    disposeStatus,
  };
};
