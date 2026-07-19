import type { AngleMode } from "../../types/calculator";
import { evaluateRpn } from "./evaluator";
import { toRpn } from "./parser";
import { tokenize } from "./tokenizer";

export const calculateExpression = (expression: string, mode: AngleMode) => {
  const tokens = tokenize(expression);
  const rpn = toRpn(tokens);

  return evaluateRpn(rpn, mode);
};
