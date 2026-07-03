import type { FunctionToken, OperatorToken, Token } from "../types/calculator";
import { isRightAssociative, precedence } from "./operators";
import { isFunctionToken, isOperatorToken } from "./tokenGuards";

export const toRpn = (tokens: Token[]) => {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      output.push(token);
      continue;
    }

    if (isFunctionToken(token)) {
      stack.push(token);
      continue;
    }

    if (token.type === "postfix") {
      output.push(token);
      continue;
    }

    if (token.type === "leftParen") {
      stack.push(token);
      continue;
    }

    if (token.type === "rightParen") {
      let foundLeftParenthesis = false;

      while (stack.length > 0) {
        const top = stack.pop();

        if (!top) {
          break;
        }

        if (top.type === "leftParen") {
          foundLeftParenthesis = true;
          break;
        }

        output.push(top);
      }

      if (!foundLeftParenthesis) {
        throw new Error("Kurung tutup berlebih");
      }

      const top = stack[stack.length - 1];

      if (top && isFunctionToken(top)) {
        output.push(stack.pop() as FunctionToken);
      }

      continue;
    }

    if (isOperatorToken(token)) {
      if (token.value === "neg") {
        stack.push(token);
        continue;
      }

      while (stack.length > 0) {
        const top = stack[stack.length - 1];

        if (!top || !isOperatorToken(top)) {
          break;
        }

        const shouldPop =
          (!isRightAssociative(token.value) &&
            precedence(token.value) <= precedence(top.value)) ||
          (isRightAssociative(token.value) &&
            precedence(token.value) < precedence(top.value));

        if (!shouldPop) {
          break;
        }

        output.push(stack.pop() as OperatorToken);
      }

      stack.push(token);
    }
  }

  while (stack.length > 0) {
    const top = stack.pop();

    if (!top) {
      break;
    }

    if (top.type === "leftParen" || top.type === "rightParen") {
      throw new Error("Kurung buka belum ditutup");
    }

    output.push(top);
  }

  return output;
};
