import type {
  ConstantToken,
  FunctionName,
  FunctionToken,
  NumberToken,
  OperatorSymbol,
  OperatorToken,
  Token,
} from "../types";
import { functionNames } from "./constants";
import { isValueEndingToken, isValueStartingToken } from "./tokenGuards";

const normalizeExpression = (expression: string) => {
  return expression
    .replaceAll(",", ".")
    .replaceAll("−", "-")
    .replaceAll("*", "×")
    .replaceAll("/", "÷")
    .replaceAll("√", "sqrt")
    .replaceAll("∛", "cbrt")
    .trim();
};

const isDigit = (value: string) => {
  return value >= "0" && value <= "9";
};

const readNumber = (expression: string, startIndex: number) => {
  let index = startIndex;
  let hasDigit = false;

  while (isDigit(expression[index] ?? "")) {
    index += 1;
    hasDigit = true;
  }

  if (expression[index] === ".") {
    index += 1;

    while (isDigit(expression[index] ?? "")) {
      index += 1;
      hasDigit = true;
    }
  }

  const exponent = expression[index];

  if ((exponent === "e" || exponent === "E") && hasDigit) {
    let nextIndex = index + 1;

    if (expression[nextIndex] === "+" || expression[nextIndex] === "-") {
      nextIndex += 1;
    }

    if (isDigit(expression[nextIndex] ?? "")) {
      index = nextIndex + 1;

      while (isDigit(expression[index] ?? "")) {
        index += 1;
      }
    }
  }

  const raw = expression.slice(startIndex, index);

  if (!hasDigit || raw === ".") {
    throw new Error("Format angka tidak valid");
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error("Angka terlalu besar");
  }

  return {
    token: {
      type: "number",
      value,
      raw,
    } satisfies NumberToken,
    nextIndex: index,
  };
};

const readWord = (expression: string, startIndex: number) => {
  let index = startIndex;

  while (/[a-zA-Z]/.test(expression[index] ?? "")) {
    index += 1;
  }

  const raw = expression.slice(startIndex, index);
  const value = raw.toLowerCase();

  if (value === "pi") {
    return {
      token: {
        type: "constant",
        value: Math.PI,
        raw,
      } satisfies ConstantToken,
      nextIndex: index,
    };
  }

  if (value === "e") {
    return {
      token: {
        type: "constant",
        value: Math.E,
        raw,
      } satisfies ConstantToken,
      nextIndex: index,
    };
  }

  if (value === "mod") {
    return {
      token: {
        type: "operator",
        value: "mod",
        raw,
      } satisfies OperatorToken,
      nextIndex: index,
    };
  }

  if (functionNames.includes(value as FunctionName)) {
    return {
      token: {
        type: "function",
        value: value as FunctionName,
        raw,
      } satisfies FunctionToken,
      nextIndex: index,
    };
  }

  throw new Error(`Fungsi "${raw}" tidak dikenali`);
};

const shouldInsertMultiplication = (left: Token, right: Token) => {
  return isValueEndingToken(left) && isValueStartingToken(right);
};

export const tokenize = (input: string) => {
  const expression = normalizeExpression(input);
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const current = expression[index] ?? "";
    const previousToken = tokens[tokens.length - 1];

    if (/\s/.test(current)) {
      index += 1;
      continue;
    }

    if (isDigit(current) || current === ".") {
      const result = readNumber(expression, index);
      tokens.push(result.token);
      index = result.nextIndex;
      continue;
    }

    if (/[a-zA-Z]/.test(current)) {
      const result = readWord(expression, index);
      tokens.push(result.token);
      index = result.nextIndex;
      continue;
    }

    if (current === "π") {
      tokens.push({
        type: "constant",
        value: Math.PI,
        raw: current,
      });
      index += 1;
      continue;
    }

    if (current === "(") {
      tokens.push({
        type: "leftParen",
        raw: current,
      });
      index += 1;
      continue;
    }

    if (current === ")") {
      tokens.push({
        type: "rightParen",
        raw: current,
      });
      index += 1;
      continue;
    }

    if (current === "!" || current === "%") {
      tokens.push({
        type: "postfix",
        value: current,
        raw: current,
      });
      index += 1;
      continue;
    }

    if (
      current === "+" ||
      current === "-" ||
      current === "×" ||
      current === "÷" ||
      current === "^"
    ) {
      const isUnary =
        current === "-" &&
        (!previousToken ||
          previousToken.type === "operator" ||
          previousToken.type === "leftParen" ||
          previousToken.type === "function");

      tokens.push({
        type: "operator",
        value: isUnary ? "neg" : (current as OperatorSymbol),
        raw: current,
      });
      index += 1;
      continue;
    }

    throw new Error(`Karakter "${current}" tidak valid`);
  }

  if (tokens.length === 0) {
    throw new Error("Ekspresi masih kosong");
  }

  const tokensWithMultiplication: Token[] = [];

  for (const token of tokens) {
    const previous =
      tokensWithMultiplication[tokensWithMultiplication.length - 1];

    if (previous && shouldInsertMultiplication(previous, token)) {
      tokensWithMultiplication.push({
        type: "operator",
        value: "×",
        raw: "×",
      });
    }

    tokensWithMultiplication.push(token);
  }

  return tokensWithMultiplication;
};
