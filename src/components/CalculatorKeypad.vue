<script setup lang="ts">
import { calculatorButtonGroups } from "../data/calculatorButtons";
import type { ButtonKind, CalculatorButton } from "../types/calculator";

const emit = defineEmits<{
  press: [button: CalculatorButton];
}>();

const buttonClass = (button: CalculatorButton) => {
  const base =
    "calculator-button rounded-2xl px-2 py-3 text-sm font-black text-slate-100 shadow-lg shadow-slate-950/10 sm:text-base";

  const variants: Record<ButtonKind, string> = {
    number: "bg-slate-800/90 hover:bg-slate-700/95",
    operator: "bg-blue-600/90 hover:bg-blue-500",
    function: "bg-indigo-600/75 hover:bg-indigo-500",
    constant: "bg-cyan-600/80 hover:bg-cyan-500",
    action: "bg-slate-700/90 hover:bg-slate-600",
    memory: "bg-violet-600/75 hover:bg-violet-500",
    equals: "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
  };

  return `${base} ${variants[button.kind]}`;
};

const pressButton = (button: CalculatorButton) => {
  emit("press", button);
};
</script>

<template>
  <div class="mt-5 grid gap-4">
    <section
      v-for="group in calculatorButtonGroups"
      :key="group.title"
      class="rounded-[1.5rem] border border-slate-700/60 bg-slate-950/35 p-4"
    >
      <div
        class="mb-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-end"
      >
        <div>
          <h3 class="text-sm font-black text-white">{{ group.title }}</h3>
          <p class="mt-1 text-xs leading-5 text-slate-400">
            {{ group.description }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <button
          v-for="button in group.buttons"
          :key="`${group.title}-${button.label}`"
          type="button"
          :class="buttonClass(button)"
          @click="pressButton(button)"
        >
          {{ button.label }}
        </button>
      </div>
    </section>
  </div>
</template>
