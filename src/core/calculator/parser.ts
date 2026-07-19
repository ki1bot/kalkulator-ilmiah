import { isFunctionToken, isOperatorToken } from "./tokenGuards";
import type { OperatorSymbol, OperatorToken, Token } from "./types";

const precedence = (operator: OperatorSymbol) => {
  switch (operator) {
    case "+":
    case "-":
      return 1;

    case "×":
    case "÷":
    case "mod":
      return 2;

    case "neg":
      return 3;

    case "^":
      return 4;
  }
};

const isRightAssociative = (operator: OperatorSymbol) => {
  return operator === "^" || operator === "neg";
};

export const toRpn = (tokens: Token[]) => {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      output.push(token);
      continue;
    }

    if (token.type === "function" || token.type === "leftParen") {
      stack.push(token);
      continue;
    }

    if (token.type === "postfix") {
      output.push(token);
      continue;
    }

    if (token.type === "rightParen") {
      while (stack.length > 0 && stack.at(-1)?.type !== "leftParen") {
        const popped = stack.pop();

        if (popped) {
          output.push(popped);
        }
      }

      stack.pop();

      const top = stack.at(-1);

      if (top && isFunctionToken(top)) {
        const functionToken = stack.pop();

        if (functionToken) {
          output.push(functionToken);
        }
      }

      continue;
    }

    if (!isOperatorToken(token)) {
      continue;
    }

    if (token.value === "neg") {
      stack.push(token);
      continue;
    }

    while (stack.length > 0) {
      const top = stack.at(-1);

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

  while (stack.length > 0) {
    const token = stack.pop();

    if (token) {
      output.push(token);
    }
  }

  return output;
};
