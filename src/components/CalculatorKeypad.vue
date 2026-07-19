<script setup lang="ts">
import { ref } from "vue";
import {
  memoryButtons,
  primaryButtons,
  scientificButtonGroups,
} from "../data/buttons";
import type { ButtonKind, CalculatorButton } from "../types/calculator";

type CalculatorPanel = "basic" | "scientific";

defineProps<{
  memoryActive: boolean;
}>();

const emit = defineEmits<{
  press: [button: CalculatorButton];
}>();

const activePanel = ref<CalculatorPanel>("basic");

const baseButtonClass =
  "touch-manipulation min-h-11 rounded-lg border px-1 py-2 text-sm font-bold transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:min-h-12";

const buttonClasses: Record<ButtonKind, string> = {
  number: "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100",
  operator: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  function: "border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
  constant: "border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
  action: "border-zinc-300 bg-zinc-200 text-zinc-700 hover:bg-zinc-300",
  equals: "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800",
  memory: "border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
};

const press = (button: CalculatorButton) => {
  emit("press", button);
};
</script>

<template>
  <section class="mt-2 sm:mt-3" aria-label="Tombol kalkulator">
    <nav
      class="mb-2 grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1"
      aria-label="Pilihan jenis tombol"
    >
      <button
        type="button"
        class="touch-manipulation rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="
          activePanel === 'basic'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'
        "
        :aria-pressed="activePanel === 'basic'"
        @click="activePanel = 'basic'"
      >
        Dasar
      </button>

      <button
        type="button"
        class="touch-manipulation rounded-md px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="
          activePanel === 'scientific'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800'
        "
        :aria-pressed="activePanel === 'scientific'"
        @click="activePanel = 'scientific'"
      >
        Ilmiah
      </button>
    </nav>

    <div v-show="activePanel === 'basic'">
      <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
        <span
          class="grid min-h-11 place-items-center rounded-lg border text-sm font-extrabold sm:min-h-12"
          :class="
            memoryActive
              ? 'border-violet-300 bg-violet-50 text-violet-700'
              : 'border-zinc-200 bg-zinc-50 text-zinc-400'
          "
          aria-label="Indikator memori"
        >
          M
        </span>

        <button
          v-for="button in memoryButtons"
          :key="button.label"
          type="button"
          :class="[baseButtonClass, buttonClasses[button.kind]]"
          :aria-label="button.ariaLabel || button.label"
          @click="press(button)"
        >
          {{ button.label }}
        </button>
      </div>

      <div class="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
        <button
          v-for="button in primaryButtons"
          :key="button.label"
          type="button"
          :class="[
            baseButtonClass,
            buttonClasses[button.kind],
            'min-h-14 text-base sm:min-h-16',
          ]"
          :aria-label="button.ariaLabel || button.label"
          @click="press(button)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>

    <div v-show="activePanel === 'scientific'" class="grid gap-2">
      <section
        v-for="group in scientificButtonGroups"
        :key="group.title"
        class="rounded-xl border border-zinc-200 bg-zinc-50 p-2 sm:p-3"
      >
        <div class="mb-2">
          <h2 class="text-sm font-bold text-zinc-800">
            {{ group.title }}
          </h2>

          <p class="mt-0.5 text-xs leading-5 text-zinc-500">
            {{ group.description }}
          </p>
        </div>

        <div
          class="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-6"
        >
          <button
            v-for="button in group.buttons"
            :key="`${group.title}-${button.label}`"
            type="button"
            :class="[baseButtonClass, buttonClasses[button.kind]]"
            :aria-label="button.ariaLabel || button.label"
            @click="press(button)"
          >
            {{ button.label }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>
