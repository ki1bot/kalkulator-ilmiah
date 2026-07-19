export const normalizeExpression = (expression: string) => {
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
