import type { AngleMode, FunctionName } from "../types/calculator";
import { fromRadians, toRadians } from "./angle";

export const ensureFinite = (value: number) => {
  if (!Number.isFinite(value)) {
    throw new Error("Hasil perhitungan tidak valid");
  }

  return value;
};

export const applyFunction = (
  name: FunctionName,
  value: number,
  mode: AngleMode,
) => {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(value, mode));
    case "cos":
      return Math.cos(toRadians(value, mode));
    case "tan": {
      const radians = toRadians(value, mode);
      const cosine = Math.cos(radians);

      if (Math.abs(cosine) < 1e-12) {
        throw new Error("Nilai tan tidak terdefinisi");
      }

      return Math.tan(radians);
    }
    case "asin":
      if (value < -1 || value > 1) {
        throw new Error("asin hanya menerima nilai -1 sampai 1");
      }

      return fromRadians(Math.asin(value), mode);
    case "acos":
      if (value < -1 || value > 1) {
        throw new Error("acos hanya menerima nilai -1 sampai 1");
      }

      return fromRadians(Math.acos(value), mode);
    case "atan":
      return fromRadians(Math.atan(value), mode);
    case "sinh":
      return Math.sinh(value);
    case "cosh":
      return Math.cosh(value);
    case "tanh":
      return Math.tanh(value);
    case "log":
      if (value <= 0) {
        throw new Error("log hanya menerima nilai lebih dari 0");
      }

      return Math.log10(value);
    case "ln":
      if (value <= 0) {
        throw new Error("ln hanya menerima nilai lebih dari 0");
      }

      return Math.log(value);
    case "sqrt":
      if (value < 0) {
        throw new Error("Akar kuadrat tidak menerima bilangan negatif");
      }

      return Math.sqrt(value);
    case "cbrt":
      return Math.cbrt(value);
    case "abs":
      return Math.abs(value);
    case "exp":
      return Math.exp(value);
    case "floor":
      return Math.floor(value);
    case "ceil":
      return Math.ceil(value);
    case "round":
      return Math.round(value);
  }
};
