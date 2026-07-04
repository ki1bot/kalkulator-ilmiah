<script setup lang="ts">
import { referenceItems } from "../data/references";
</script>

<template>
  <section class="glass-panel rounded-[2rem] p-5">
    <div>
      <p class="text-xs font-black uppercase tracking-[0.25em] text-violet-300">
        Panduan Fungsi
      </p>
      <h2 class="mt-2 text-2xl font-black text-white">Referensi rumus</h2>
      <p class="mt-2 text-sm leading-6 text-slate-400">
        Panduan singkat agar pengguna tahu fungsi apa yang tersedia dan cara
        menulis ekspresinya.
      </p>
    </div>

    <div class="mt-5 grid gap-3">
      <article
        v-for="item in referenceItems"
        :key="item.title"
        class="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
      >
        <div
          class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
        >
          <h3 class="font-black text-white">{{ item.title }}</h3>
          <code
            class="rounded-xl border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-black text-violet-200"
          >
            {{ item.syntax }}
          </code>
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-400">
          {{ item.description }}
        </p>
        <p class="mt-2 text-sm font-bold text-slate-300">{{ item.example }}</p>
      </article>
    </div>
  </section>
</template>
