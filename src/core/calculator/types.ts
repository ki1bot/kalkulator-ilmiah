export type FunctionName =
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

export type OperatorSymbol = "+" | "-" | "×" | "÷" | "^" | "mod" | "neg";

export type PostfixSymbol = "!" | "%";

export type NumberToken = {
  type: "number";
  value: number;
  raw: string;
};

export type ConstantToken = {
  type: "constant";
  value: number;
  raw: string;
};

export type FunctionToken = {
  type: "function";
  value: FunctionName;
  raw: string;
};

export type OperatorToken = {
  type: "operator";
  value: OperatorSymbol;
  raw: string;
};

export type PostfixToken = {
  type: "postfix";
  value: PostfixSymbol;
  raw: string;
};

export type ParenthesisToken = {
  type: "leftParen" | "rightParen";
  raw: string;
};

export type Token =
  | NumberToken
  | ConstantToken
  | FunctionToken
  | OperatorToken
  | PostfixToken
  | ParenthesisToken;

export type StackValue = {
  value: number;
  isPercent: boolean;
};
