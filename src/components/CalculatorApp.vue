<script setup lang="ts">
import { useCalculator } from "../composables/useCalculator";
import AppHeader from "./AppHeader.vue";
import CalculatorDisplay from "./CalculatorDisplay.vue";
import CalculatorKeypad from "./CalculatorKeypad.vue";
import HistoryPanel from "./HistoryPanel.vue";
import InformationPanel from "./InformationPanel.vue";

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
  loadExpression,
  copyResult,
  toggleAngleMode,
} = useCalculator();
</script>

<template>
  <main class="page-shell">
    <div class="page-container">
      <AppHeader />

      <section class="status-grid" aria-label="Status kalkulator">
        <article class="status-card">
          <span>Mode sudut</span>
          <strong>{{ angleMode }}</strong>
        </article>

        <article class="status-card">
          <span>Memori</span>
          <strong>{{ formattedMemory }}</strong>
        </article>

        <article class="status-card">
          <span>Jawaban terakhir</span>
          <strong>{{ lastAnswer }}</strong>
        </article>
      </section>

      <div class="workspace-grid">
        <section class="calculator-card">
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
            :angle-mode="angleMode"
            :memory-active="memoryActive"
            @press="handleButtonClick"
            @toggle-angle="toggleAngleMode"
          />
        </section>

        <aside class="sidebar">
          <HistoryPanel
            :history="history"
            @select="selectHistoryResult"
            @clear="clearHistory"
          />

          <InformationPanel @use="loadExpression" />
        </aside>
      </div>

      <footer class="page-footer">
        <p>
          Kalkulator memproses ekspresi dengan tokenizer, parser RPN, dan
          evaluator tanpa menggunakan eval.
        </p>
      </footer>
    </div>
  </main>
</template>
