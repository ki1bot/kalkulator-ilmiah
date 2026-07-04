<script setup lang="ts">
defineProps<{
  expression: string;
  errorMessage: string;
  livePreview: string;
  mode: string;
}>();
</script>

<template>
  <div class="display-panel rounded-[1.7rem] p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
          Layar Perhitungan
        </p>
        <p class="mt-1 text-xs text-slate-400">Mode aktif: {{ mode }}</p>
      </div>

      <div
        class="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-bold text-slate-300"
      >
        Enter untuk hasil
      </div>
    </div>

    <div
      class="expression-scroll mt-5 min-h-20 overflow-x-auto whitespace-nowrap text-right text-4xl font-black tracking-tight text-white sm:text-6xl"
    >
      {{ expression }}
    </div>

    <div
      class="mt-4 flex min-h-8 items-center justify-between gap-3 text-sm sm:text-base"
    >
      <p class="font-bold text-red-300">{{ errorMessage }}</p>
      <p class="ml-auto font-black text-cyan-200">{{ livePreview }}</p>
    </div>
  </div>
</template>
