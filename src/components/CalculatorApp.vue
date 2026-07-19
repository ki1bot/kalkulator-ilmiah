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
  <main class="page-shell">
    <div class="page-container">
      <header class="simple-header">
        <div>
          <h1>Kalkulator Ilmiah</h1>
          <p>Perhitungan dasar dan ilmiah dalam satu kalkulator.</p>
        </div>
      </header>

      <section class="calculator-card">
        <div class="calculator-status">
          <button
            type="button"
            class="status-button"
            aria-label="Ubah mode sudut"
            @click="toggleAngleMode"
          >
            <span>Mode</span>
            <strong>{{ angleMode }}</strong>
          </button>

          <div class="status-item" :class="{ active: memoryActive }">
            <span>Memori</span>
            <strong>{{ formattedMemory }}</strong>
          </div>

          <div class="status-item">
            <span>ANS</span>
            <strong>{{ lastAnswer }}</strong>
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

      <footer class="page-footer">
        <p>Vue 3 · TypeScript · Vite</p>
      </footer>
    </div>
  </main>
</template>
