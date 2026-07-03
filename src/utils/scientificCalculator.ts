import type { AngleMode } from "../types/calculator";
import { evaluateRpn } from "./evaluator";
import { formatNumber } from "./formatter";
import { toRpn } from "./parser";
import { tokenize } from "./tokenizer";

export const calculate = (expression: string, mode: AngleMode) => {
  const tokens = tokenize(expression);
  const rpn = toRpn(tokens);

  return evaluateRpn(rpn, mode);
};

export { formatNumber };

export type {
  AngleMode,
  ButtonKind,
  CalculatorButton,
  HistoryItem,
} from "../types/calculator";
