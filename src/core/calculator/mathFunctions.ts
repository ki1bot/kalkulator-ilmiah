import type { AngleMode } from "../../types/calculator";
import type { FunctionName } from "./types";

const toRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * Math.PI) / 180 : value;
};

const fromRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * 180) / Math.PI : value;
};

export const factorial = (value: number) => {
  if (!Number.isInteger(value)) {
    throw new Error("Faktorial hanya menerima bilangan bulat");
  }

  if (value < 0) {
    throw new Error("Faktorial tidak menerima bilangan negatif");
  }

  if (value > 170) {
    throw new Error("Faktorial terlalu besar");
  }

  let result = 1;

  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }

  return result;
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

      if (Math.abs(Math.cos(radians)) < 1e-12) {
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

    case "log2":
      if (value <= 0) {
        throw new Error("log2 hanya menerima nilai lebih dari 0");
      }

      return Math.log2(value);

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
