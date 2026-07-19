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
  <section class="side-panel">
    <div class="panel-heading-row">
      <div>
        <p class="eyebrow">Riwayat</p>
        <h2>Perhitungan terakhir</h2>
      </div>

      <button
        type="button"
        class="small-button"
        :disabled="history.length === 0"
        @click="emit('clear')"
      >
        Hapus
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

    <div v-else class="empty-state">
      Riwayat masih kosong. Hasil akan tersimpan otomatis di perangkat ini.
    </div>
  </section>
</template>
