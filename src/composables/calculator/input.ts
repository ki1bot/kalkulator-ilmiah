import {
  appendDecimalPoint,
  clearLastEntry,
  closeOpenParentheses,
  getParenthesisBalance,
  hasTrailingBinaryOperator,
  hasTrailingValue,
  replaceTrailingOperator,
  smartBackspace,
} from "../../core/expressionInput";
import type { ButtonKind } from "../../types/calculator";
import type { CalculatorState } from "./types";

export const createCalculatorInput = (
  state: CalculatorState,
  clearError: () => void,
) => {
  const setExpression = (value: string) => {
    state.expression.value = value;
    state.justCalculated.value = false;
    state.lastExpression.value = "";
    clearError();
  };

  const prepareForInput = (kind: ButtonKind) => {
    const wasCalculated = state.justCalculated.value;

    const shouldStartNew =
      wasCalculated &&
      (kind === "number" || kind === "constant" || kind === "function");

    if (wasCalculated) {
      state.lastExpression.value = "";
    }

    if (shouldStartNew) {
      state.expression.value = "0";
    }

    state.justCalculated.value = false;

    clearError();
  };

  const appendNumber = (value: string) => {
    prepareForInput("number");

    if (value === ".") {
      state.expression.value = appendDecimalPoint(state.expression.value);

      return;
    }

    if (!state.expression.value || state.expression.value === "0") {
      state.expression.value = value;

      return;
    }

    state.expression.value += value;
  };

  const appendFunctionOrConstant = (value: string, kind: ButtonKind) => {
    prepareForInput(kind);

    if (!state.expression.value || state.expression.value === "0") {
      state.expression.value = value;

      return;
    }

    state.expression.value += value;
  };

  const appendOperator = (value: string) => {
    prepareForInput("operator");

    if (value === "(") {
      state.expression.value =
        !state.expression.value || state.expression.value === "0"
          ? "("
          : `${state.expression.value}(`;

      return;
    }

    if (value === ")") {
      try {
        const balance = getParenthesisBalance(state.expression.value);

        if (balance > 0 && hasTrailingValue(state.expression.value)) {
          state.expression.value += ")";
        }
      } catch (error) {
        state.errorMessage.value =
          error instanceof Error ? error.message : "Tanda kurung tidak valid";
      }

      return;
    }

    if (value === "!" || value === "%") {
      if (hasTrailingValue(state.expression.value)) {
        state.expression.value += value;
      }

      return;
    }

    if (!state.expression.value || state.expression.value === "0") {
      if (value === "-") {
        state.expression.value = "-";
      }

      return;
    }

    if (state.expression.value.endsWith("(")) {
      if (value === "-") {
        state.expression.value += "-";
      }

      return;
    }

    if (state.expression.value === "-") {
      if (value !== "-") {
        state.expression.value = "0";
      }

      return;
    }

    if (hasTrailingBinaryOperator(state.expression.value)) {
      const canAppendUnaryMinus =
        value === "-" && /(?:mod|[×÷^])$/.test(state.expression.value);

      state.expression.value = canAppendUnaryMinus
        ? `${state.expression.value}-`
        : replaceTrailingOperator(state.expression.value, value);

      return;
    }

    if (hasTrailingValue(state.expression.value)) {
      state.expression.value += value;
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

  const clearAll = () => {
    state.expression.value = "0";
    state.lastExpression.value = "";
    state.errorMessage.value = "";
    state.justCalculated.value = false;
  };

  const clearEntry = () => {
    clearError();

    state.expression.value = clearLastEntry(state.expression.value);

    state.justCalculated.value = false;

    state.lastExpression.value = "";
  };

  const backspace = () => {
    clearError();

    state.expression.value = smartBackspace(state.expression.value);

    state.justCalculated.value = false;

    state.lastExpression.value = "";
  };

  const appendPower = (power: string) => {
    prepareForInput("operator");

    if (hasTrailingValue(state.expression.value)) {
      state.expression.value += power;
    }
  };

  const toggleSign = () => {
    clearError();

    if (!state.expression.value || state.expression.value === "0") {
      state.expression.value = "-";
      state.justCalculated.value = false;

      return;
    }

    if (
      /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?$/.test(
        state.expression.value,
      )
    ) {
      state.expression.value = state.expression.value.startsWith("-")
        ? state.expression.value.slice(1)
        : `-${state.expression.value}`;

      state.justCalculated.value = false;

      return;
    }

    try {
      if (
        state.expression.value.startsWith("-(") &&
        state.expression.value.endsWith(")")
      ) {
        state.expression.value = state.expression.value.slice(2, -1);
      } else {
        state.expression.value = `-(${closeOpenParentheses(
          state.expression.value,
        )})`;
      }

      state.justCalculated.value = false;

      state.lastExpression.value = "";
    } catch (error) {
      state.errorMessage.value =
        error instanceof Error ? error.message : "Ekspresi tidak valid";
    }
  };

  const insertResolvedValue = (value: string) => {
    prepareForInput("number");

    const resolved = value.startsWith("-") ? `(${value})` : value;

    if (!state.expression.value || state.expression.value === "0") {
      state.expression.value = value;
    } else {
      state.expression.value += resolved;
    }
  };

  return {
    setExpression,
    appendNumber,
    appendInput,
    clearAll,
    clearEntry,
    backspace,
    appendPower,
    toggleSign,
    insertResolvedValue,
  };
};
