import type { AngleMode, Token } from "../types";
import { factorial } from "./factorial";
import { applyFunction, ensureFinite } from "./mathFunctions";
import {
  isFunctionToken,
  isOperatorToken,
  isPostfixToken,
} from "./tokenGuards";

const popValue = (stack: number[]) => {
  const value = stack.pop();

  if (value === undefined) {
    throw new Error("Ekspresi belum lengkap");
  }

  return value;
};

export const evaluateRpn = (tokens: Token[], mode: AngleMode) => {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      stack.push(token.value);
      continue;
    }

    if (isPostfixToken(token)) {
      const value = popValue(stack);

      if (token.value === "!") {
        stack.push(factorial(value));
      } else {
        stack.push(value / 100);
      }

      continue;
    }

    if (isFunctionToken(token)) {
      const value = popValue(stack);
      stack.push(ensureFinite(applyFunction(token.value, value, mode)));
      continue;
    }

    if (isOperatorToken(token)) {
      if (token.value === "neg") {
        stack.push(-popValue(stack));
        continue;
      }

      const right = popValue(stack);
      const left = popValue(stack);

      switch (token.value) {
        case "+":
          stack.push(left + right);
          break;
        case "-":
          stack.push(left - right);
          break;
        case "×":
          stack.push(left * right);
          break;
        case "÷":
          if (right === 0) {
            throw new Error("Pembagian dengan nol tidak valid");
          }

          stack.push(left / right);
          break;
        case "^":
          stack.push(Math.pow(left, right));
          break;
        case "mod":
          if (right === 0) {
            throw new Error("Modulo dengan nol tidak valid");
          }

          stack.push(left % right);
          break;
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error("Ekspresi belum lengkap");
  }

  return ensureFinite(stack[0] as number);
};
