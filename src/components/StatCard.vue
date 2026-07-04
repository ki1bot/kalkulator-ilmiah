<script setup lang="ts">
type Tone = "cyan" | "violet" | "emerald" | "amber";

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    description?: string;
    tone?: Tone;
  }>(),
  {
    description: "",
    tone: "cyan",
  },
);

const toneClass = {
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
}[props.tone];
</script>

<template>
  <div :class="`rounded-2xl border px-4 py-3 ${toneClass}`">
    <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
      {{ label }}
    </p>
    <p class="mt-1 text-xl font-black">{{ value }}</p>
    <p v-if="description" class="mt-1 text-xs leading-5 text-slate-400">
      {{ description }}
    </p>
  </div>
</template>
