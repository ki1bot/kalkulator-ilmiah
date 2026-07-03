export type AngleMode = "DEG" | "RAD";

export type HistoryItem = {
  expression: string;
  result: string;
  mode: AngleMode;
};

type OperatorSymbol = "+" | "-" | "×" | "÷" | "^" | "mod" | "neg";
type PostfixSymbol = "!" | "%";
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
  | "sqrt"
  | "cbrt"
  | "abs"
  | "exp"
  | "floor"
  | "ceil"
  | "round";

type NumberToken = {
  type: "number";
  value: number;
  raw: string;
};

type ConstantToken = {
  type: "constant";
  value: number;
  raw: string;
};

type OperatorToken = {
  type: "operator";
  value: OperatorSymbol;
  raw: string;
};

type PostfixToken = {
  type: "postfix";
  value: PostfixSymbol;
  raw: string;
};

type FunctionToken = {
  type: "function";
  value: FunctionName;
  raw: string;
};

type ParenthesisToken = {
  type: "leftParen" | "rightParen";
  raw: string;
};

type Token =
  | NumberToken
  | ConstantToken
  | OperatorToken
  | PostfixToken
  | FunctionToken
  | ParenthesisToken;

const functionNames = new Set<FunctionName>([
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
  "sqrt",
  "cbrt",
  "abs",
  "exp",
  "floor",
  "ceil",
  "round",
]);

const isDigit = (value: string) => value >= "0" && value <= "9";

const isOperatorToken = (token: Token): token is OperatorToken =>
  token.type === "operator";

const isPostfixToken = (token: Token): token is PostfixToken =>
  token.type === "postfix";

const isFunctionToken = (token: Token): token is FunctionToken =>
  token.type === "function";

const isValueEndingToken = (token: Token) =>
  token.type === "number" ||
  token.type === "constant" ||
  token.type === "rightParen" ||
  token.type === "postfix";

const isValueStartingToken = (token: Token) =>
  token.type === "number" ||
  token.type === "constant" ||
  token.type === "function" ||
  token.type === "leftParen";

const toRadians = (value: number, mode: AngleMode) =>
  mode === "DEG" ? (value * Math.PI) / 180 : value;

const fromRadians = (value: number, mode: AngleMode) =>
  mode === "DEG" ? (value * 180) / Math.PI : value;

const normalizeExpression = (expression: string) =>
  expression
    .replaceAll(",", ".")
    .replaceAll("−", "-")
    .replaceAll("*", "×")
    .replaceAll("/", "÷")
    .replaceAll("√", "sqrt")
    .replaceAll("∛", "cbrt")
    .trim();

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

  const maybeExponent = expression[index];

  if ((maybeExponent === "e" || maybeExponent === "E") && hasDigit) {
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

  if (functionNames.has(value as FunctionName)) {
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

const shouldInsertMultiplication = (left: Token, right: Token) =>
  isValueEndingToken(left) && isValueStartingToken(right);

const tokenize = (input: string) => {
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

  const tokensWithImplicitMultiplication: Token[] = [];

  for (const token of tokens) {
    const previous =
      tokensWithImplicitMultiplication[
        tokensWithImplicitMultiplication.length - 1
      ];

    if (previous && shouldInsertMultiplication(previous, token)) {
      tokensWithImplicitMultiplication.push({
        type: "operator",
        value: "×",
        raw: "×",
      });
    }

    tokensWithImplicitMultiplication.push(token);
  }

  return tokensWithImplicitMultiplication;
};

const precedence = (operator: OperatorSymbol | PostfixSymbol) => {
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

const isRightAssociative = (operator: OperatorSymbol) =>
  operator === "^" || operator === "neg";

const toRpn = (tokens: Token[]) => {
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

    if (isPostfixToken(token)) {
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

const popValue = (stack: number[]) => {
  const value = stack.pop();

  if (value === undefined) {
    throw new Error("Ekspresi belum lengkap");
  }

  return value;
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

const ensureFinite = (value: number) => {
  if (!Number.isFinite(value)) {
    throw new Error("Hasil perhitungan tidak valid");
  }

  return value;
};

const applyFunction = (name: FunctionName, value: number, mode: AngleMode) => {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(value, mode));
    case "cos":
      return Math.cos(toRadians(value, mode));
    case "tan": {
      const radians = toRadians(value, mode);
      const cos = Math.cos(radians);

      if (Math.abs(cos) < 1e-12) {
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

const evaluateRpn = (tokens: Token[], mode: AngleMode) => {
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

export const calculate = (expression: string, mode: AngleMode) => {
  const tokens = tokenize(expression);
  const rpn = toRpn(tokens);
  return evaluateRpn(rpn, mode);
};

export const formatNumber = (value: number) => {
  let normalizedValue = Object.is(value, -0) ? 0 : value;

  if (Math.abs(normalizedValue) < 1e-12) {
    normalizedValue = 0;
  }

  const absoluteValue = Math.abs(normalizedValue);

  if (absoluteValue !== 0 && (absoluteValue >= 1e12 || absoluteValue < 1e-9)) {
    return normalizedValue
      .toExponential(10)
      .replace(/\.?0+e/, "e")
      .replace("e+", "e");
  }

  return Number(normalizedValue.toPrecision(12)).toString();
};
