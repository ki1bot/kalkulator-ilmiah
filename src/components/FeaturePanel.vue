<script setup lang="ts">
import { featureCards } from "../../data/features";
</script>

<template>
  <section class="glass-panel rounded-[2rem] p-5">
    <h2 class="text-xl font-black text-white">Fitur</h2>

    <div class="mt-4 grid gap-3 text-sm text-slate-300">
      <div
        v-for="feature in featureCards"
        :key="feature.title"
        class="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4"
      >
        <p class="font-bold text-white">{{ feature.title }}</p>
        <p class="mt-1 leading-6">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>
