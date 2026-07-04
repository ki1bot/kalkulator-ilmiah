<script setup lang="ts">
import { exampleCalculations } from "../data/examples";

const emit = defineEmits<{
  use: [expression: string];
}>();

const useExample = (expression: string) => {
  emit("use", expression);
};
</script>

<template>
  <section class="glass-panel rounded-[2rem] p-5">
    <div>
      <p
        class="text-xs font-black uppercase tracking-[0.25em] text-emerald-300"
      >
        Contoh Ekspresi
      </p>
      <h2 class="mt-2 text-2xl font-black text-white">
        Coba perhitungan cepat
      </h2>
      <p class="mt-2 text-sm leading-6 text-slate-400">
        Klik salah satu contoh untuk mengisi layar kalkulator.
      </p>
    </div>

    <div class="mt-5 grid gap-3">
      <button
        v-for="example in exampleCalculations"
        :key="example.title"
        type="button"
        class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 text-left transition hover:border-emerald-300/50 hover:bg-slate-800/80"
        @click="useExample(example.expression)"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-black text-white">{{ example.title }}</h3>
            <p class="mt-1 font-mono text-sm text-emerald-200">
              {{ example.expression }}
            </p>
          </div>
          <span
            class="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-200"
          >
            = {{ example.result }}
          </span>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-400">
          {{ example.description }}
        </p>
      </button>
    </div>
  </section>
</template>
