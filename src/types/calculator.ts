export type AngleMode = "DEG" | "RAD";

export type ButtonKind =
  | "number"
  | "operator"
  | "function"
  | "constant"
  | "action"
  | "equals"
  | "memory";

export type CalculatorButton = {
  label: string;
  value?: string;
  kind: ButtonKind;
  action?: string;
};

export type CalculatorButtonGroup = {
  title: string;
  description: string;
  buttons: CalculatorButton[];
};

export type HistoryItem = {
  expression: string;
  result: string;
  mode: AngleMode;
};

export type FeatureCard = {
  title: string;
  description: string;
  points: string[];
};

export type ExampleCalculation = {
  title: string;
  expression: string;
  result: string;
  description: string;
};

export type ReferenceItem = {
  title: string;
  syntax: string;
  description: string;
  example: string;
};

export type OperatorSymbol = "+" | "-" | "×" | "÷" | "^" | "mod" | "neg";

export type PostfixSymbol = "!" | "%";

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
  | "sqrt"
  | "cbrt"
  | "abs"
  | "exp"
  | "floor"
  | "ceil"
  | "round";

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

export type FunctionToken = {
  type: "function";
  value: FunctionName;
  raw: string;
};

export type ParenthesisToken = {
  type: "leftParen" | "rightParen";
  raw: string;
};

export type Token =
  | NumberToken
  | ConstantToken
  | OperatorToken
  | PostfixToken
  | FunctionToken
  | ParenthesisToken;
