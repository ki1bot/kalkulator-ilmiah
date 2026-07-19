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
  <section
    class="rounded-xl bg-zinc-900 p-3 text-white sm:p-4"
    aria-label="Layar kalkulator"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="min-w-0 truncate font-mono text-xs text-zinc-400">
        {{ lastExpression ? `${lastExpression} =` : "Masukkan ekspresi" }}
      </p>

      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="touch-manipulation rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Salin hasil"
          @click="emit('copy')"
        >
          Salin
        </button>

        <button
          type="button"
          class="touch-manipulation rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Hapus semua"
          @click="emit('clear')"
        >
          Hapus
        </button>
      </div>
    </div>

    <input
      :value="expression"
      class="mt-4 w-full min-w-0 border-0 bg-transparent p-0 text-right font-mono text-3xl font-bold tracking-tight text-white outline-none sm:text-5xl"
      type="text"
      inputmode="text"
      autocomplete="off"
      spellcheck="false"
      aria-label="Ekspresi matematika"
      @input="handleInput"
      @keydown.enter.prevent="emit('calculate')"
      @keydown.esc.prevent="emit('clear')"
    />
  </section>
</template>
