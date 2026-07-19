import type {
  CalculatorAction,
  CalculatorButton,
} from "../../types/calculator";

type ActionDependencies = {
  toggleAngleMode: () => void;
  clearAll: () => void;
  clearEntry: () => void;
  backspace: () => void;
  calculateNow: () => void;
  toggleSign: () => void;
  insertResolvedValue: (value: string) => void;
  appendPower: (power: string) => void;
  memoryClear: () => void;
  memoryRecall: () => void;
  updateMemory: (operation: "add" | "subtract") => void;
  appendInput: (value: string, kind: CalculatorButton["kind"]) => void;
  getLastAnswer: () => string;
};

export const createCalculatorActions = (dependencies: ActionDependencies) => {
  const runAction = (action: CalculatorAction) => {
    switch (action) {
      case "toggle-angle":
        dependencies.toggleAngleMode();
        break;

      case "clear":
        dependencies.clearAll();
        break;

      case "clear-entry":
        dependencies.clearEntry();
        break;

      case "backspace":
        dependencies.backspace();
        break;

      case "calculate":
        dependencies.calculateNow();
        break;

      case "toggle-sign":
        dependencies.toggleSign();
        break;

      case "answer":
        dependencies.insertResolvedValue(dependencies.getLastAnswer());
        break;

      case "square":
        dependencies.appendPower("^2");
        break;

      case "cube":
        dependencies.appendPower("^3");
        break;

      case "reciprocal":
        dependencies.appendPower("^-1");
        break;

      case "memory-clear":
        dependencies.memoryClear();
        break;

      case "memory-recall":
        dependencies.memoryRecall();
        break;

      case "memory-add":
        dependencies.updateMemory("add");
        break;

      case "memory-subtract":
        dependencies.updateMemory("subtract");
        break;
    }
  };

  const handleButtonClick = (button: CalculatorButton) => {
    if (button.action) {
      runAction(button.action);
      return;
    }

    if (button.input) {
      dependencies.appendInput(button.input, button.kind);
    }
  };

  return {
    handleButtonClick,
  };
};
