export type AngleMode = "DEG" | "RAD";

export type ButtonKind =
  | "number"
  | "operator"
  | "function"
  | "constant"
  | "action"
  | "equals"
  | "memory";

export type CalculatorAction =
  | "toggle-angle"
  | "clear"
  | "clear-entry"
  | "backspace"
  | "calculate"
  | "toggle-sign"
  | "answer"
  | "square"
  | "cube"
  | "reciprocal"
  | "memory-clear"
  | "memory-recall"
  | "memory-add"
  | "memory-subtract";

export type CalculatorButton = {
  label: string;
  kind: ButtonKind;
  input?: string;
  action?: CalculatorAction;
  ariaLabel?: string;
};

export type CalculatorButtonGroup = {
  title: string;
  description: string;
  buttons: CalculatorButton[];
};

export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  mode: AngleMode;
  createdAt: number;
};

export type ExampleCalculation = {
  title: string;
  expression: string;
  result: string;
  description: string;
};