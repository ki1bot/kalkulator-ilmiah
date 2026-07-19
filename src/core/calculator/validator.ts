import { isValueEndingToken, isValueStartingToken } from "./tokenGuards";
import type { Token } from "./types";

export const validateTokens = (tokens: Token[]) => {
  let balance = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const previous = tokens[index - 1];
    const next = tokens[index + 1];

    if (!token) {
      continue;
    }

    if (token.type === "function") {
      if (!next || next.type !== "leftParen") {
        throw new Error(`Fungsi ${token.raw} harus diikuti tanda kurung`);
      }

      continue;
    }

    if (token.type === "leftParen") {
      balance += 1;

      if (!next || next.type === "rightParen" || next.type === "postfix") {
        throw new Error("Isi tanda kurung belum lengkap");
      }

      continue;
    }

    if (token.type === "rightParen") {
      balance -= 1;

      if (balance < 0) {
        throw new Error("Kurung tutup berlebih");
      }

      if (!previous || !isValueEndingToken(previous)) {
        throw new Error("Isi tanda kurung belum lengkap");
      }

      continue;
    }

    if (token.type === "postfix") {
      if (!previous || !isValueEndingToken(previous)) {
        throw new Error(`Operator ${token.raw} tidak memiliki nilai`);
      }

      continue;
    }

    if (token.type !== "operator") {
      continue;
    }

    if (token.value === "neg") {
      if (
        previous &&
        previous.type !== "operator" &&
        previous.type !== "leftParen"
      ) {
        throw new Error("Tanda negatif berada pada posisi yang salah");
      }

      if (!next || (!isValueStartingToken(next) && next.type !== "operator")) {
        throw new Error("Tanda negatif tidak memiliki nilai");
      }

      continue;
    }

    if (!previous || !isValueEndingToken(previous)) {
      throw new Error(`Operator ${token.raw} tidak memiliki nilai kiri`);
    }

    if (!next || (!isValueStartingToken(next) && next.type !== "operator")) {
      throw new Error(`Operator ${token.raw} tidak memiliki nilai kanan`);
    }
  }

  if (balance !== 0) {
    throw new Error("Kurung buka belum ditutup");
  }

  const lastToken = tokens.at(-1);

  if (!lastToken || !isValueEndingToken(lastToken)) {
    throw new Error("Ekspresi belum lengkap");
  }
};
