const functionInputs = [
  "asin(",
  "acos(",
  "atan(",
  "sinh(",
  "cosh(",
  "tanh(",
  "sqrt(",
  "cbrt(",
  "floor(",
  "round(",
  "log2(",
  "ceil(",
  "sin(",
  "cos(",
  "tan(",
  "log(",
  "ln(",
  "abs(",
  "exp(",
];

export const hasTrailingValue = (expression: string) => {
  return /(?:\d|π|e|\)|!|%)$/.test(expression);
};

export const hasTrailingBinaryOperator = (expression: string) => {
  return /(?:mod|[+\-×÷^])$/.test(expression);
};

export const getParenthesisBalance = (expression: string) => {
  let balance = 0;

  for (const character of expression) {
    if (character === "(") {
      balance += 1;
    } else if (character === ")") {
      balance -= 1;
    }

    if (balance < 0) {
      throw new Error("Kurung tutup berlebih");
    }
  }

  return balance;
};

export const closeOpenParentheses = (expression: string) => {
  const balance = getParenthesisBalance(expression);
  return `${expression}${")".repeat(balance)}`;
};

export const replaceTrailingOperator = (
  expression: string,
  operator: string,
) => {
  if (/(?:mod|[+×÷^])-$/.test(expression)) {
    return expression.replace(/(?:mod|[+×÷^])-$/, operator);
  }

  return expression.replace(/(?:mod|[+\-×÷^])$/, operator);
};

export const appendDecimalPoint = (expression: string) => {
  if (!expression || expression === "0") {
    return "0.";
  }

  if (/(?:π|e|\)|!|%)$/.test(expression)) {
    return `${expression}×0.`;
  }

  const segment = expression.split(/(?:mod|[+\-×÷^()])/).at(-1) ?? "";
  const mantissa = segment.split(/[eE]/)[0] ?? "";

  if (mantissa.includes(".") || /[eE]/.test(segment)) {
    return expression;
  }

  if (segment === "") {
    return `${expression}0.`;
  }

  return `${expression}.`;
};

export const smartBackspace = (expression: string) => {
  if (!expression || expression === "0") {
    return "0";
  }

  const functionInput = functionInputs.find((value) =>
    expression.endsWith(value),
  );

  if (functionInput) {
    const next = expression.slice(0, -functionInput.length);
    return next === "" || next === "-" ? "0" : next;
  }

  if (expression.endsWith("mod")) {
    const next = expression.slice(0, -3);
    return next === "" || next === "-" ? "0" : next;
  }

  const next = expression.slice(0, -1);
  return next === "" || next === "-" ? "0" : next;
};

const findMatchingOpeningParenthesis = (expression: string) => {
  let depth = 0;

  for (let index = expression.length - 1; index >= 0; index -= 1) {
    const character = expression[index];

    if (character === ")") {
      depth += 1;
    } else if (character === "(") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
};

export const clearLastEntry = (expression: string) => {
  if (!expression || expression === "0") {
    return "0";
  }

  if (expression.endsWith(")")) {
    const openingIndex = findMatchingOpeningParenthesis(expression);

    if (openingIndex >= 0) {
      let startIndex = openingIndex;

      while (
        startIndex > 0 &&
        /[a-zA-Z0-9]/.test(expression[startIndex - 1] ?? "")
      ) {
        startIndex -= 1;
      }

      const next = expression.slice(0, startIndex);
      return next === "" || next === "-" ? "0" : next;
    }
  }

  const numberMatch = expression.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+\-]?\d+)?$/,
  );

  if (numberMatch) {
    const next = expression.slice(0, -numberMatch[0].length);
    return next === "" || next === "-" ? "0" : next;
  }

  if (/(?:π|e)$/.test(expression)) {
    const next = expression.slice(0, -1);
    return next === "" || next === "-" ? "0" : next;
  }

  return smartBackspace(expression);
};
