import type { AngleMode } from "../types/calculator";
import { normalizeNumber } from "./numberFormatter";

type FunctionName =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh"
  | "log"
  | "ln"
  | "log2"
  | "sqrt"
  | "cbrt"
  | "abs"
  | "exp"
  | "floor"
  | "ceil"
  | "round";

type OperatorSymbol = "+" | "-" | "×" | "÷" | "^" | "mod" | "neg";
type PostfixSymbol = "!" | "%";

type Token =
  | {
      type: "number";
      value: number;
      raw: string;
    }
  | {
      type: "constant";
      value: number;
      raw: string;
    }
  | {
      type: "function";
      value: FunctionName;
      raw: string;
    }
  | {
      type: "operator";
      value: OperatorSymbol;
      raw: string;
    }
  | {
      type: "postfix";
      value: PostfixSymbol;
      raw: string;
    }
  | {
      type: "leftParen";
      raw: string;
    }
  | {
      type: "rightParen";
      raw: string;
    };

type StackValue = {
  value: number;
  isPercent: boolean;
};

const functionNames: FunctionName[] = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "log",
  "ln",
  "log2",
  "sqrt",
  "cbrt",
  "abs",
  "exp",
  "floor",
  "ceil",
  "round",
];

const normalizeExpression = (expression: string) => {
  return expression
    .replaceAll("**", "^")
    .replaceAll(",", ".")
    .replaceAll("−", "-")
    .replaceAll("*", "×")
    .replaceAll("/", "÷")
    .replaceAll("√", "sqrt")
    .replaceAll("∛", "cbrt")
    .replaceAll("²", "^2")
    .replaceAll("³", "^3")
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

  const exponentStart = index;
  const exponentCharacter = expression[index];

  if ((exponentCharacter === "e" || exponentCharacter === "E") && hasDigit) {
    let exponentIndex = index + 1;

    if (
      expression[exponentIndex] === "+" ||
      expression[exponentIndex] === "-"
    ) {
      exponentIndex += 1;
    }

    if (isDigit(expression[exponentIndex] ?? "")) {
      index = exponentIndex + 1;

      while (isDigit(expression[index] ?? "")) {
        index += 1;
      }
    } else {
      index = exponentStart;
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
    } as Token,
    nextIndex: index,
  };
};

const readIdentifier = (expression: string, startIndex: number) => {
  let index = startIndex;

  while (/[a-zA-Z0-9]/.test(expression[index] ?? "")) {
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
      } as Token,
      nextIndex: index,
    };
  }

  if (value === "e") {
    return {
      token: {
        type: "constant",
        value: Math.E,
        raw,
      } as Token,
      nextIndex: index,
    };
  }

  if (value === "mod") {
    return {
      token: {
        type: "operator",
        value: "mod",
        raw,
      } as Token,
      nextIndex: index,
    };
  }

  if (functionNames.includes(value as FunctionName)) {
    return {
      token: {
        type: "function",
        value: value as FunctionName,
        raw,
      } as Token,
      nextIndex: index,
    };
  }

  throw new Error(`Fungsi "${raw}" tidak dikenali`);
};

const isValueEndingToken = (token: Token) => {
  return (
    token.type === "number" ||
    token.type === "constant" ||
    token.type === "rightParen" ||
    token.type === "postfix"
  );
};

const isValueStartingToken = (token: Token) => {
  return (
    token.type === "number" ||
    token.type === "constant" ||
    token.type === "function" ||
    token.type === "leftParen"
  );
};

const shouldInsertMultiplication = (left: Token, right: Token) => {
  if (left.type === "number" && right.type === "number") {
    throw new Error("Format angka tidak valid");
  }

  return isValueEndingToken(left) && isValueStartingToken(right);
};

const validateTokens = (tokens: Token[]) => {
  let balance = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const previous = tokens[index - 1];
    const next = tokens[index + 1];

    if (!token) {
      continue;
    }

    if (token.type === "function") {
      if (!next || next.type !== "leftParen") {
        throw new Error(`Fungsi ${token.raw} harus diikuti tanda kurung`);
      }

      continue;
    }

    if (token.type === "leftParen") {
      balance += 1;

      if (!next || next.type === "rightParen" || next.type === "postfix") {
        throw new Error("Isi tanda kurung belum lengkap");
      }

      continue;
    }

    if (token.type === "rightParen") {
      balance -= 1;

      if (balance < 0) {
        throw new Error("Kurung tutup berlebih");
      }

      if (!previous || !isValueEndingToken(previous)) {
        throw new Error("Isi tanda kurung belum lengkap");
      }

      continue;
    }

    if (token.type === "postfix") {
      if (!previous || !isValueEndingToken(previous)) {
        throw new Error(`Operator ${token.raw} tidak memiliki nilai`);
      }

      continue;
    }

    if (token.type === "operator") {
      if (token.value === "neg") {
        if (
          previous &&
          previous.type !== "operator" &&
          previous.type !== "leftParen"
        ) {
          throw new Error("Tanda negatif berada pada posisi yang salah");
        }

        if (
          !next ||
          (!isValueStartingToken(next) && next.type !== "operator")
        ) {
          throw new Error("Tanda negatif tidak memiliki nilai");
        }

        continue;
      }

      if (!previous || !isValueEndingToken(previous)) {
        throw new Error(`Operator ${token.raw} tidak memiliki nilai kiri`);
      }

      if (!next || (!isValueStartingToken(next) && next.type !== "operator")) {
        throw new Error(`Operator ${token.raw} tidak memiliki nilai kanan`);
      }
    }
  }

  if (balance !== 0) {
    throw new Error("Kurung buka belum ditutup");
  }

  const lastToken = tokens.at(-1);

  if (!lastToken || !isValueEndingToken(lastToken)) {
    throw new Error("Ekspresi belum lengkap");
  }
};

const tokenize = (input: string) => {
  const expression = normalizeExpression(input);
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const current = expression[index] ?? "";
    const previousToken = tokens.at(-1);

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
      const result = readIdentifier(expression, index);
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

    if (["+", "-", "×", "÷", "^"].includes(current)) {
      const isUnary =
        current === "-" &&
        (!previousToken ||
          previousToken.type === "operator" ||
          previousToken.type === "leftParen");

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
    const previous = tokensWithMultiplication.at(-1);

    if (previous && shouldInsertMultiplication(previous, token)) {
      tokensWithMultiplication.push({
        type: "operator",
        value: "×",
        raw: "×",
      });
    }

    tokensWithMultiplication.push(token);
  }

  validateTokens(tokensWithMultiplication);

  return tokensWithMultiplication;
};

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

const toRpn = (tokens: Token[]) => {
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

      if (stack.at(-1)?.type === "function") {
        const functionToken = stack.pop();

        if (functionToken) {
          output.push(functionToken);
        }
      }

      continue;
    }

    if (token.type === "operator") {
      if (token.value === "neg") {
        stack.push(token);
        continue;
      }

      while (stack.length > 0) {
        const top = stack.at(-1);

        if (!top || top.type !== "operator") {
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

        const popped = stack.pop();

        if (popped) {
          output.push(popped);
        }
      }

      stack.push(token);
    }
  }

  while (stack.length > 0) {
    const token = stack.pop();

    if (token) {
      output.push(token);
    }
  }

  return output;
};

const toRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * Math.PI) / 180 : value;
};

const fromRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * 180) / Math.PI : value;
};

const factorial = (value: number) => {
  if (!Number.isInteger(value)) {
    throw new Error("Faktorial hanya menerima bilangan bulat");
  }

  if (value < 0) {
    throw new Error("Faktorial tidak menerima bilangan negatif");
  }

  if (value > 170) {
    throw new Error("Faktorial terlalu besar");
  }

  let result = 1;

  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }

  return result;
};

const applyFunction = (name: FunctionName, value: number, mode: AngleMode) => {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(value, mode));

    case "cos":
      return Math.cos(toRadians(value, mode));

    case "tan": {
      const radians = toRadians(value, mode);

      if (Math.abs(Math.cos(radians)) < 1e-12) {
        throw new Error("Nilai tan tidak terdefinisi");
      }

      return Math.tan(radians);
    }

    case "asin":
      if (value < -1 || value > 1) {
        throw new Error("asin hanya menerima nilai -1 sampai 1");
      }

      return fromRadians(Math.asin(value), mode);

    case "acos":
      if (value < -1 || value > 1) {
        throw new Error("acos hanya menerima nilai -1 sampai 1");
      }

      return fromRadians(Math.acos(value), mode);

    case "atan":
      return fromRadians(Math.atan(value), mode);

    case "sinh":
      return Math.sinh(value);

    case "cosh":
      return Math.cosh(value);

    case "tanh":
      return Math.tanh(value);

    case "log":
      if (value <= 0) {
        throw new Error("log hanya menerima nilai lebih dari 0");
      }

      return Math.log10(value);

    case "ln":
      if (value <= 0) {
        throw new Error("ln hanya menerima nilai lebih dari 0");
      }

      return Math.log(value);

    case "log2":
      if (value <= 0) {
        throw new Error("log2 hanya menerima nilai lebih dari 0");
      }

      return Math.log2(value);

    case "sqrt":
      if (value < 0) {
        throw new Error("Akar kuadrat tidak menerima bilangan negatif");
      }

      return Math.sqrt(value);

    case "cbrt":
      return Math.cbrt(value);

    case "abs":
      return Math.abs(value);

    case "exp":
      return Math.exp(value);

    case "floor":
      return Math.floor(value);

    case "ceil":
      return Math.ceil(value);

    case "round":
      return Math.round(value);
  }
};

const popValue = (stack: StackValue[]) => {
  const value = stack.pop();

  if (!value) {
    throw new Error("Ekspresi belum lengkap");
  }

  return value;
};

const evaluateRpn = (tokens: Token[], mode: AngleMode) => {
  const stack: StackValue[] = [];

  for (const token of tokens) {
    if (token.type === "number" || token.type === "constant") {
      stack.push({
        value: token.value,
        isPercent: false,
      });

      continue;
    }

    if (token.type === "postfix") {
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

    if (token.type === "function") {
      const current = popValue(stack);

      stack.push({
        value: normalizeNumber(applyFunction(token.value, current.value, mode)),
        isPercent: false,
      });

      continue;
    }

    if (token.type === "operator") {
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
  }

  if (stack.length !== 1) {
    throw new Error("Ekspresi belum lengkap");
  }

  return normalizeNumber(stack[0]?.value ?? Number.NaN);
};

export const calculateExpression = (expression: string, mode: AngleMode) => {
  const tokens = tokenize(expression);
  const rpn = toRpn(tokens);

  return evaluateRpn(rpn, mode);
};
