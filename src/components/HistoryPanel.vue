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
  <details class="history-panel">
    <summary class="history-summary">
      <span class="history-title">
        <strong>Riwayat</strong>
        <small>Perhitungan sebelumnya</small>
      </span>

      <span class="history-count">
        {{ history.length }}
      </span>
    </summary>

    <div class="history-content">
      <div class="history-toolbar">
        <p>Pilih hasil untuk menggunakannya kembali.</p>

        <button
          type="button"
          class="small-button"
          :disabled="history.length === 0"
          @click="emit('clear')"
        >
          Hapus semua
        </button>
      </div>

      <div v-if="history.length" class="history-list">
        <button
          v-for="item in history"
          :key="item.id"
          type="button"
          class="history-item"
          @click="emit('select', item)"
        >
          <span class="history-meta">
            <strong>{{ item.mode }}</strong>

            <span>
              {{ formatTime(item.createdAt) }}
            </span>
          </span>

          <span class="history-expression">
            {{ item.expression }}
          </span>

          <span class="history-result"> = {{ item.result }} </span>
        </button>
      </div>

      <div v-else class="empty-state">Belum ada riwayat perhitungan.</div>
    </div>
  </details>
</template>
