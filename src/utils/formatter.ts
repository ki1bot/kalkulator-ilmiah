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
