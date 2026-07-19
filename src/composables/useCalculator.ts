import { onBeforeUnmount } from "vue";
import { createCalculatorActions } from "./calculator/actions";
import { createCalculatorEvaluation } from "./calculator/evaluation";
import { createCalculatorHistory } from "./calculator/history";
import { createCalculatorInput } from "./calculator/input";
import { useCalculatorKeyboard } from "./calculator/keyboard";
import { createCalculatorMemory } from "./calculator/memory";
import {
  createCalculatorComputed,
  createCalculatorState,
} from "./calculator/state";
import { createStatusController } from "./calculator/status";
import { useCalculatorStorage } from "./calculator/storage";

export const useCalculator = () => {
  const state = createCalculatorState();

  const computedState = createCalculatorComputed(state);

  const status = createStatusController(state);

  const input = createCalculatorInput(state, status.clearError);

  const evaluation = createCalculatorEvaluation(state);

  const historyActions = createCalculatorHistory(state, status.showStatus);

  const toggleAngleMode = () => {
    state.angleMode.value = state.angleMode.value === "DEG" ? "RAD" : "DEG";

    status.clearError();

    status.showStatus(`Mode sudut ${state.angleMode.value}`);
  };

  const memoryActions = createCalculatorMemory(
    state,
    evaluation.evaluateCurrentExpression,
    input.insertResolvedValue,
    status.showStatus,
  );

  const actions = createCalculatorActions({
    toggleAngleMode,
    clearAll: input.clearAll,
    clearEntry: input.clearEntry,
    backspace: input.backspace,
    calculateNow: evaluation.calculateNow,
    toggleSign: input.toggleSign,
    insertResolvedValue: input.insertResolvedValue,
    appendPower: input.appendPower,
    memoryClear: memoryActions.memoryClear,
    memoryRecall: memoryActions.memoryRecall,
    updateMemory: memoryActions.updateMemory,
    appendInput: input.appendInput,
    getLastAnswer: () => state.lastAnswer.value,
  });

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(state.expression.value || "0");

      status.showStatus("Hasil disalin");
    } catch {
      status.showStatus("Gagal menyalin hasil");
    }
  };

  useCalculatorStorage(state);

  useCalculatorKeyboard({
    appendNumber: input.appendNumber,
    appendInput: input.appendInput,
    calculateNow: evaluation.calculateNow,
    backspace: input.backspace,
    clearEntry: input.clearEntry,
    clearAll: input.clearAll,
  });

  onBeforeUnmount(() => {
    status.disposeStatus();
  });

  return {
    expression: state.expression,
    angleMode: state.angleMode,
    memoryActive: computedState.memoryActive,
    formattedMemory: computedState.formattedMemory,
    history: state.history,
    lastAnswer: state.lastAnswer,
    lastExpression: state.lastExpression,
    errorMessage: state.errorMessage,
    statusMessage: state.statusMessage,
    livePreview: computedState.livePreview,
    setExpression: input.setExpression,
    calculateNow: evaluation.calculateNow,
    clearAll: input.clearAll,
    handleButtonClick: actions.handleButtonClick,
    clearHistory: historyActions.clearHistory,
    selectHistoryResult: historyActions.selectHistoryResult,
    copyResult,
    toggleAngleMode,
  };
};
