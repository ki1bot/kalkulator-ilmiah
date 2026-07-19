import type { Ref } from "vue";
import type { AngleMode, HistoryItem } from "../../types/calculator";

export type CalculatorState = {
  expression: Ref<string>;
  angleMode: Ref<AngleMode>;
  memory: Ref<number>;
  history: Ref<HistoryItem[]>;
  lastAnswer: Ref<string>;
  lastExpression: Ref<string>;
  errorMessage: Ref<string>;
  statusMessage: Ref<string>;
  justCalculated: Ref<boolean>;
};

export type EvaluationResult = {
  normalizedExpression: string;
  value: number;
  result: string;
};

export type EvaluateCurrentExpression = () => EvaluationResult;

export type ShowStatus = (message: string) => void;
