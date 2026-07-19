<script setup lang="ts">
import type { HistoryItem } from "../types/calculator";

defineProps<{
  history: HistoryItem[];
}>();

const emit = defineEmits<{
  select: [item: HistoryItem];
  clear: [];
}>();

const formatTime = (timestamp: number) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
};
</script>

<template>
  <details
    class="mt-3 rounded-2xl border border-zinc-200 bg-white shadow-sm sm:mt-4"
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between px-4 py-3 select-none focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-details-marker]:hidden"
    >
      <span class="flex flex-col">
        <strong class="text-sm text-zinc-900"> Riwayat </strong>

        <small class="text-xs text-zinc-500"> Perhitungan sebelumnya </small>
      </span>

      <span
        class="grid h-7 min-w-7 place-items-center rounded-full bg-zinc-100 px-2 text-xs font-bold text-zinc-600"
      >
        {{ history.length }}
      </span>
    </summary>

    <div class="border-t border-zinc-200 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
      <div
        class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
      >
        <p class="text-xs text-zinc-500">
          Pilih hasil untuk menggunakannya kembali.
        </p>

        <button
          type="button"
          class="self-start rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="history.length === 0"
          @click="emit('clear')"
        >
          Hapus semua
        </button>
      </div>

      <div
        v-if="history.length"
        class="mt-3 grid max-h-80 gap-2 overflow-y-auto overscroll-contain pr-1"
      >
        <button
          v-for="item in history"
          :key="item.id"
          type="button"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="emit('select', item)"
        >
          <span
            class="flex items-center justify-between gap-2 text-[10px] text-zinc-500"
          >
            <strong class="text-blue-600">
              {{ item.mode }}
            </strong>

            <span>
              {{ formatTime(item.createdAt) }}
            </span>
          </span>

          <span class="mt-1 block break-all font-mono text-xs text-zinc-500">
            {{ item.expression }}
          </span>

          <span class="mt-1 block break-all text-base font-bold text-zinc-900">
            = {{ item.result }}
          </span>
        </button>
      </div>

      <div
        v-else
        class="mt-3 rounded-lg border border-dashed border-zinc-300 px-3 py-6 text-center text-sm text-zinc-500"
      >
        Belum ada riwayat perhitungan.
      </div>
    </div>
  </details>
</template>
