import type { AngleMode } from "../types/calculator";

export const toRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * Math.PI) / 180 : value;
};

export const fromRadians = (value: number, mode: AngleMode) => {
  return mode === "DEG" ? (value * 180) / Math.PI : value;
};
