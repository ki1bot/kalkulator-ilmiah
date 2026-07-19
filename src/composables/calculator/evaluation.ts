import { calculateExpression } from "../../core/calculatorEngine";
import { closeOpenParentheses } from "../../core/expressionInput";
import { formatNumber } from "../../core/numberFormatter";
import type { CalculatorState } from "./types";

const createHistoryId = () => {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createCalculatorEvaluation = (state: CalculatorState) => {
  const evaluateCurrentExpression = () => {
    const normalizedExpression = closeOpenParentheses(state.expression.value);

    const value = calculateExpression(
      normalizedExpression,
      state.angleMode.value,
    );

    return {
      normalizedExpression,
      value,
      result: formatNumber(value),
    };
  };

  const calculateNow = () => {
    try {
      const calculation = evaluateCurrentExpression();

      state.lastExpression.value = calculation.normalizedExpression;

      state.expression.value = calculation.result;

      state.lastAnswer.value = calculation.result;

      state.justCalculated.value = true;

      state.errorMessage.value = "";

      state.history.value = [
        {
          id: createHistoryId(),
          expression: calculation.normalizedExpression,
          result: calculation.result,
          mode: state.angleMode.value,
          createdAt: Date.now(),
        },
        ...state.history.value,
      ].slice(0, 20);
    } catch (error) {
      state.errorMessage.value =
        error instanceof Error ? error.message : "Perhitungan tidak valid";
    }
  };

  return {
    evaluateCurrentExpression,
    calculateNow,
  };
};
