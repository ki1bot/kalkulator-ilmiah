<script setup lang="ts">
import { featureCards } from "../data/features";
</script>

<template>
  <section class="glass-panel rounded-[2rem] p-5">
    <div>
      <p class="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
        Fitur Website
      </p>
      <h2 class="mt-2 text-2xl font-black text-white">
        Lebih lengkap dan jelas
      </h2>
      <p class="mt-2 text-sm leading-6 text-slate-400">
        Bagian ini menjelaskan kemampuan kalkulator supaya website tidak
        terlihat seperti sekadar kumpulan tombol.
      </p>
    </div>

    <div class="mt-5 grid gap-3">
      <article
        v-for="feature in featureCards"
        :key="feature.title"
        class="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
      >
        <h3 class="font-black text-white">{{ feature.title }}</h3>
        <p class="mt-1 text-sm leading-6 text-slate-400">
          {{ feature.description }}
        </p>

        <ul class="mt-3 grid gap-2">
          <li
            v-for="point in feature.points"
            :key="point"
            class="flex gap-2 text-sm leading-6 text-slate-300"
          >
            <span
              class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300"
            ></span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
