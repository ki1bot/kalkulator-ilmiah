export const normalizeNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    throw new Error("Hasil perhitungan tidak valid");
  }

  if (Object.is(value, -0) || Math.abs(value) < 1e-14) {
    return 0;
  }

  return value;
};

export const formatNumber = (value: number) => {
  const normalized = normalizeNumber(value);
  const rounded = Number(normalized.toPrecision(15));
  const absolute = Math.abs(rounded);

  if (absolute !== 0 && (absolute >= 1e15 || absolute < 1e-10)) {
    return rounded
      .toExponential(12)
      .replace(/\.0+e/, "e")
      .replace(/(\.\d*?[1-9])0+e/, "$1e")
      .replace("e+", "e");
  }

  return rounded.toString();
};