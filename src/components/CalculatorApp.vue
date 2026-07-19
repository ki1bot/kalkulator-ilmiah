<script setup lang="ts">
import { useCalculator } from "../composables/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay.vue";
import CalculatorKeypad from "./CalculatorKeypad.vue";
import HistoryPanel from "./HistoryPanel.vue";

const {
  expression,
  angleMode,
  memoryActive,
  formattedMemory,
  history,
  lastAnswer,
  lastExpression,
  errorMessage,
  statusMessage,
  livePreview,
  setExpression,
  calculateNow,
  clearAll,
  handleButtonClick,
  clearHistory,
  selectHistoryResult,
  copyResult,
  toggleAngleMode,
} = useCalculator();
</script>

<template>
  <main
    class="min-h-screen bg-zinc-100 px-3 py-4 text-zinc-900 sm:px-4 sm:py-8"
  >
    <div class="mx-auto w-full max-w-3xl">
      <header class="mb-4 text-center sm:mb-6">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
          Kalkulator Ilmiah
        </h1>

        <p class="mt-1 text-sm text-zinc-500">
          Perhitungan dasar dan ilmiah dalam satu kalkulator.
        </p>
      </header>

      <section
        class="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm sm:p-4"
      >
        <div class="mb-2 grid grid-cols-3 gap-2 sm:mb-3">
          <button
            type="button"
            class="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ubah mode sudut"
            @click="toggleAngleMode"
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              Mode
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ angleMode }}
            </strong>
          </button>

          <div
            class="min-w-0 rounded-xl border px-2 py-2 text-center"
            :class="
              memoryActive
                ? 'border-violet-300 bg-violet-50'
                : 'border-zinc-200 bg-zinc-50'
            "
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              Memori
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ formattedMemory }}
            </strong>
          </div>

          <div
            class="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center"
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              ANS
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ lastAnswer }}
            </strong>
          </div>
        </div>

        <CalculatorDisplay
          :expression="expression"
          :last-expression="lastExpression"
          :preview="livePreview"
          :error-message="errorMessage"
          :status-message="statusMessage"
          @update:expression="setExpression"
          @calculate="calculateNow"
          @clear="clearAll"
          @copy="copyResult"
        />

        <CalculatorKeypad
          :memory-active="memoryActive"
          @press="handleButtonClick"
        />
      </section>

      <HistoryPanel
        :history="history"
        @select="selectHistoryResult"
        @clear="clearHistory"
      />

      <footer class="py-4 text-center text-xs text-zinc-400">
        Vue 3 · TypeScript · Vite · Tailwind CSS
      </footer>
    </div>
  </main>
</template>
