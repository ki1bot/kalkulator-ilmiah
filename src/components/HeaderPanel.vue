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
    class="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-950/45 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-7"
  >
    <div
      class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-24 left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
    ></div>

    <div
      class="relative grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-center"
    >
      <div>
        <div class="flex flex-wrap gap-2">
          <span
            class="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cyan-200"
          >
            Scientific Calculator
          </span>
          <span
            class="rounded-full border border-slate-600/70 bg-slate-900/70 px-3 py-1 text-xs font-bold text-slate-300"
          >
            Vue 3
          </span>
          <span
            class="rounded-full border border-slate-600/70 bg-slate-900/70 px-3 py-1 text-xs font-bold text-slate-300"
          >
            TypeScript
          </span>
          <span
            class="rounded-full border border-slate-600/70 bg-slate-900/70 px-3 py-1 text-xs font-bold text-slate-300"
          >
            Tailwind CSS
          </span>
        </div>

        <h1
          class="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl"
        >
          Kalkulator Ilmiah Lengkap
        </h1>

        <p class="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Website kalkulator ilmiah dengan tampilan dashboard, mode sudut
          DEG/RAD, fungsi trigonometri, logaritma, akar, pangkat, faktorial,
          persentase, modulo, memori, riwayat, contoh ekspresi, dan panduan
          penggunaan.
        </p>

        <div class="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div
            class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
          >
            <p class="font-black text-white">Akurat</p>
            <p class="mt-1 leading-6">
              Tidak memakai eval, input diproses dengan tokenizer dan parser.
            </p>
          </div>
          <div
            class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
          >
            <p class="font-black text-white">Spesifik</p>
            <p class="mt-1 leading-6">
              Fungsi dipisah berdasarkan kategori kalkulator ilmiah.
            </p>
          </div>
          <div
            class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
          >
            <p class="font-black text-white">Interaktif</p>
            <p class="mt-1 leading-6">
              Mendukung klik tombol, keyboard, memori, dan riwayat.
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <StatCard
          label="Mode Sudut"
          :value="mode"
          description="DEG untuk derajat, RAD untuk radian."
          tone="cyan"
        />
        <StatCard
          label="Memory"
          :value="memory"
          description="Nilai sementara dari tombol M+, M-, MR, MC."
          tone="violet"
        />
        <StatCard
          label="Last Answer"
          :value="answer"
          description="Hasil terakhir yang bisa dipanggil lewat ANS."
          tone="emerald"
        />
      </div>
    </div>
  </header>
</template>
