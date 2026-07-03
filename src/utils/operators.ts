import type { OperatorSymbol, PostfixSymbol } from "../types";

export const precedence = (operator: OperatorSymbol | PostfixSymbol) => {
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
    case "!":
    case "%":
      return 5;
  }
};

export const isRightAssociative = (operator: OperatorSymbol) => {
  return operator === "^" || operator === "neg";
};
