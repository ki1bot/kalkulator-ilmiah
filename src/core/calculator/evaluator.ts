import type { AngleMode } from "../../types/calculator";
import { normalizeNumber } from "../numberFormatter";
import { applyFunction, factorial } from "./mathFunctions";
import {
  isFunctionToken,
  isOperatorToken,
  isPostfixToken,
} from "./tokenGuards";
import type { StackValue, Token } from "./types";

const popValue = (stack: StackValue[]) => {
  const value = stack.pop();

  if (!value) {
    throw new Error("Ekspresi belum lengkap");
  }

  return value;
};

export const evaluateRpn = (tokens: Token[], mode: AngleMode) => {
  const stack: StackValue[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      stack.push({
        value: token.value,
        isPercent: false,
      });

      continue;
    }

    if (isPostfixToken(token)) {
      const current = popValue(stack);

      if (token.value === "!") {
        stack.push({
          value: factorial(current.value),
          isPercent: false,
        });
      } else {
        stack.push({
          value: current.value / 100,
          isPercent: true,
        });
      }

      continue;
    }

    if (isFunctionToken(token)) {
      const current = popValue(stack);

      stack.push({
        value: normalizeNumber(applyFunction(token.value, current.value, mode)),
        isPercent: false,
      });

      continue;
    }

    if (!isOperatorToken(token)) {
      continue;
    }

    if (token.value === "neg") {
      const current = popValue(stack);

      stack.push({
        value: -current.value,
        isPercent: current.isPercent,
      });

      continue;
    }

    const right = popValue(stack);
    const left = popValue(stack);

    let result = 0;

    switch (token.value) {
      case "+":
        result = right.isPercent
          ? left.value + left.value * right.value
          : left.value + right.value;
        break;

      case "-":
        result = right.isPercent
          ? left.value - left.value * right.value
          : left.value - right.value;
        break;

      case "×":
        result = left.value * right.value;
        break;

      case "÷":
        if (right.value === 0) {
          throw new Error("Pembagian dengan nol tidak valid");
        }

        result = left.value / right.value;
        break;

      case "^":
        result = Math.pow(left.value, right.value);
        break;

      case "mod":
        if (right.value === 0) {
          throw new Error("Modulo dengan nol tidak valid");
        }

        result = left.value % right.value;
        break;
    }

    stack.push({
      value: normalizeNumber(result),
      isPercent: false,
    });
  }

  if (stack.length !== 1) {
    throw new Error("Ekspresi belum lengkap");
  }

  return normalizeNumber(stack[0]?.value ?? Number.NaN);
};
