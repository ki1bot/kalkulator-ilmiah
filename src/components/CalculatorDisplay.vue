<script setup lang="ts">
defineProps<{
  expression: string;
  errorMessage: string;
  livePreview: string;
}>();
</script>

<template>
  <div class="display-panel rounded-[1.5rem] p-5">
    <div
      class="expression-scroll min-h-16 overflow-x-auto whitespace-nowrap text-right text-3xl font-black tracking-tight text-white sm:text-5xl"
    >
      {{ expression }}
    </div>

    <div
      class="mt-3 flex min-h-8 items-center justify-between gap-3 text-sm sm:text-base"
    >
      <p class="font-bold text-red-300">{{ errorMessage }}</p>
      <p class="ml-auto font-bold text-cyan-200">{{ livePreview }}</p>
    </div>
  </div>
</template>
