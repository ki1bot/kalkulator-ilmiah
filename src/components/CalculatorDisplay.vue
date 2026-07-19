<script setup lang="ts">
defineProps<{
  expression: string;
  lastExpression: string;
  preview: string;
  errorMessage: string;
  statusMessage: string;
}>();

const emit = defineEmits<{
  "update:expression": [value: string];
  calculate: [];
  clear: [];
  copy: [];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit("update:expression", target.value);
};
</script>

<template>
  <section class="calculator-display" aria-label="Layar kalkulator">
    <div class="display-toolbar">
      <div>
        <p class="eyebrow">Ekspresi</p>

        <p class="previous-expression">
          {{ lastExpression ? `${lastExpression} =` : "Masukkan perhitungan" }}
        </p>
      </div>

      <div class="display-actions">
        <button type="button" class="small-button" @click="emit('copy')">
          Salin
        </button>

        <button type="button" class="small-button" @click="emit('clear')">
          Bersihkan
        </button>
      </div>
    </div>

    <input
      :value="expression"
      class="expression-input"
      type="text"
      inputmode="text"
      autocomplete="off"
      spellcheck="false"
      aria-label="Ekspresi matematika"
      @input="handleInput"
      @keydown.enter.prevent="emit('calculate')"
      @keydown.esc.prevent="emit('clear')"
    />

    <div class="display-feedback" aria-live="polite">
      <p :class="errorMessage ? 'feedback-error' : 'feedback-status'">
        {{ errorMessage || statusMessage || "Enter atau = untuk menghitung" }}
      </p>

      <p class="preview-result">
        {{ preview ? `= ${preview}` : "" }}
      </p>
    </div>
  </section>
</template>
