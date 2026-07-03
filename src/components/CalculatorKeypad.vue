<script setup lang="ts">
import { calculatorButtons } from "../../data/calculatorButtons";
import type { ButtonKind, CalculatorButton } from "../../types/calculator";

const emit = defineEmits<{
  press: [button: CalculatorButton];
}>();

const buttonClass = (button: CalculatorButton) => {
  const base =
    "calculator-button rounded-2xl px-2 py-3 text-sm font-bold text-slate-100 shadow-lg shadow-slate-950/10 sm:text-base";

  const variants: Record<ButtonKind, string> = {
    number: "bg-slate-800/80 hover:bg-slate-700/90",
    operator: "bg-blue-600/85 hover:bg-blue-500",
    function: "bg-indigo-600/70 hover:bg-indigo-500",
    constant: "bg-cyan-600/75 hover:bg-cyan-500",
    action: "bg-slate-700/80 hover:bg-slate-600",
    memory: "bg-violet-600/70 hover:bg-violet-500",
    equals: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  };

  return `${base} ${variants[button.kind]}`;
};

const pressButton = (button: CalculatorButton) => {
  emit("press", button);
};
</script>

<template>
  <div class="mt-5 grid grid-cols-6 gap-2 sm:gap-3">
    <button
      v-for="button in calculatorButtons"
      :key="button.label"
      type="button"
      :class="buttonClass(button)"
      @click="pressButton(button)"
    >
      {{ button.label }}
    </button>
  </div>
</template>
