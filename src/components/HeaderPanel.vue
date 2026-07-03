<script setup lang="ts">
import StatCard from "./StatCard.vue";

defineProps<{
  mode: string;
  memory: string;
  answer: string;
}>();
</script>

<template>
  <header
    class="flex flex-col justify-between gap-4 rounded-[2rem] border border-slate-700/50 bg-slate-950/35 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl md:flex-row md:items-center"
  >
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
        Vue 3 + TypeScript
      </p>
      <h1
        class="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl"
      >
        Kalkulator Ilmiah
      </h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        Mendukung operasi dasar, trigonometri, logaritma, akar, pangkat,
        faktorial, persentase, modulo, konstanta, memori, riwayat, dan mode
        sudut.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
      <StatCard label="Mode" :value="mode" />
      <StatCard label="Memory" :value="memory" />
      <StatCard label="Last Ans" :value="answer" />
    </div>
  </header>
</template>
