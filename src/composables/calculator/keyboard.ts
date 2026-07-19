import { onBeforeUnmount, onMounted } from "vue";
import type { ButtonKind } from "../../types/calculator";

type KeyboardDependencies = {
  appendNumber: (value: string) => void;
  appendInput: (value: string, kind: ButtonKind) => void;
  calculateNow: () => void;
  backspace: () => void;
  clearEntry: () => void;
  clearAll: () => void;
};

const keyboardMap: Record<
  string,
  {
    value: string;
    kind: ButtonKind;
  }
> = {
  ".": {
    value: ".",
    kind: "number",
  },
  ",": {
    value: ".",
    kind: "number",
  },
  "+": {
    value: "+",
    kind: "operator",
  },
  "-": {
    value: "-",
    kind: "operator",
  },
  "*": {
    value: "×",
    kind: "operator",
  },
  x: {
    value: "×",
    kind: "operator",
  },
  X: {
    value: "×",
    kind: "operator",
  },
  "/": {
    value: "÷",
    kind: "operator",
  },
  "^": {
    value: "^",
    kind: "operator",
  },
  "(": {
    value: "(",
    kind: "operator",
  },
  ")": {
    value: ")",
    kind: "operator",
  },
  "%": {
    value: "%",
    kind: "operator",
  },
  "!": {
    value: "!",
    kind: "operator",
  },
};

export const useCalculatorKeyboard = (dependencies: KeyboardDependencies) => {
  const handleKeyboard = (event: KeyboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      event.preventDefault();

      dependencies.appendNumber(event.key);

      return;
    }

    const mapped = keyboardMap[event.key];

    if (mapped) {
      event.preventDefault();

      dependencies.appendInput(mapped.value, mapped.kind);

      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault();

      dependencies.calculateNow();

      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      dependencies.backspace();

      return;
    }

    if (event.key === "Delete") {
      event.preventDefault();

      dependencies.clearEntry();

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      dependencies.clearAll();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyboard);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyboard);
  });
};
