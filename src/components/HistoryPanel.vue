<script setup lang="ts">
import type { HistoryItem } from "../types/calculator";

defineProps<{
  history: HistoryItem[];
}>();

const emit = defineEmits<{
  select: [result: string];
  clear: [];
}>();

const selectResult = (result: string) => {
  emit("select", result);
};

const clearHistory = () => {
  emit("clear");
};
</script>

<template>
  <section class="glass-panel rounded-[2rem] p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p
          class="text-xs font-black uppercase tracking-[0.25em] text-amber-300"
        >
          Riwayat
        </p>
        <h2 class="mt-2 text-2xl font-black text-white">Hasil terakhir</h2>
      </div>

      <button
        type="button"
        class="rounded-xl border border-slate-700/70 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
        @click="clearHistory"
      >
        Hapus
      </button>
    </div>

    <div
      v-if="history.length > 0"
      class="mt-5 flex max-h-[30rem] flex-col gap-3 overflow-y-auto pr-1"
    >
      <button
        v-for="(item, index) in history"
        :key="`${item.expression}-${index}`"
        type="button"
        class="history-item rounded-2xl p-4 text-left transition hover:border-cyan-400/35 hover:bg-slate-800/80"
        @click="selectResult(item.result)"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-black text-cyan-300">{{ item.mode }}</p>
          <p class="text-xs text-slate-500">#{{ history.length - index }}</p>
        </div>
        <p class="mt-2 break-all font-mono text-sm text-slate-400">
          {{ item.expression }}
        </p>
        <p class="mt-1 break-all text-2xl font-black text-white">
          = {{ item.result }}
        </p>
      </button>
    </div>

    <div
      v-else
      class="mt-5 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm leading-6 text-slate-400"
    >
      Belum ada riwayat. Jalankan perhitungan pertama dengan tombol = atau
      Enter.
    </div>
  </section>
</template>
