<script setup lang="ts">
import { useScientificCalculator } from "../composables/useScientificCalculator";
import CalculatorDisplay from "./CalculatorDisplay.vue";
import CalculatorKeypad from "./CalculatorKeypad.vue";
import FeaturePanel from "./FeaturePanel.vue";
import HeaderPanel from "./HeaderPanel.vue";
import HistoryPanel from "./HistoryPanel.vue";
import QuickExamplesPanel from "./QuickExamplesPanel.vue";
import ReferencePanel from "./ReferencePanel.vue";

const {
  expression,
  angleMode,
  history,
  errorMessage,
  lastAnswer,
  livePreview,
  formattedMemory,
  handleButtonClick,
  clearHistory,
  selectHistoryResult,
  loadExpression,
} = useScientificCalculator();
</script>

<template>
  <main class="min-h-screen px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
    <section class="mx-auto flex max-w-[1500px] flex-col gap-6">
      <HeaderPanel
        :mode="angleMode"
        :memory="formattedMemory"
        :answer="lastAnswer"
      />

      <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section class="glass-panel rounded-[2rem] p-4 sm:p-6">
          <CalculatorDisplay
            :expression="expression"
            :error-message="errorMessage"
            :live-preview="livePreview"
            :mode="angleMode"
          />

          <CalculatorKeypad @press="handleButtonClick" />
        </section>

        <aside class="grid gap-6">
          <FeaturePanel />
          <QuickExamplesPanel @use="loadExpression" />
          <HistoryPanel
            :history="history"
            @clear="clearHistory"
            @select="selectHistoryResult"
          />
        </aside>
      </div>

      <ReferencePanel />
    </section>
  </main>
</template>
