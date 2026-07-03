import type {
  FunctionToken,
  OperatorToken,
  PostfixToken,
  Token,
} from "../types";

export const isOperatorToken = (token: Token): token is OperatorToken => {
  return token.type === "operator";
};

export const isPostfixToken = (token: Token): token is PostfixToken => {
  return token.type === "postfix";
};

export const isFunctionToken = (token: Token): token is FunctionToken => {
  return token.type === "function";
};

export const isValueEndingToken = (token: Token) => {
  return (
    token.type === "number" ||
    token.type === "constant" ||
    token.type === "rightParen" ||
    token.type === "postfix"
  );
};

export const isValueStartingToken = (token: Token) => {
  return (
    token.type === "number" ||
    token.type === "constant" ||
    token.type === "function" ||
    token.type === "leftParen"
  );
};
