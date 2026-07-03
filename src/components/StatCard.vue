<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>

<template>
  <div class="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
    <p class="text-slate-400">{{ label }}</p>
    <p class="text-xl font-black text-cyan-200">{{ value }}</p>
  </div>
</template>
