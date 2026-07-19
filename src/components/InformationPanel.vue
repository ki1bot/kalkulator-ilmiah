<script setup lang="ts">
import { examples } from "../data/examples";

const emit = defineEmits<{
  use: [expression: string];
}>();
</script>

<template>
  <section class="side-panel">
    <div>
      <p class="eyebrow">Contoh cepat</p>
      <h2>Uji fungsi kalkulator</h2>

      <p class="panel-description">
        Klik contoh untuk memindahkan ekspresinya ke layar kalkulator.
      </p>
    </div>

    <div class="example-list">
      <button
        v-for="example in examples"
        :key="example.title"
        type="button"
        class="example-item"
        @click="emit('use', example.expression)"
      >
        <span class="example-heading">
          <strong>{{ example.title }}</strong>
          <span>= {{ example.result }}</span>
        </span>

        <code>{{ example.expression }}</code>

        <small>
          {{ example.description }}
        </small>
      </button>
    </div>

    <details class="guide-panel">
      <summary>Panduan dan aturan perhitungan</summary>

      <div class="guide-content">
        <p>
          <strong>DEG</strong> memakai derajat, sedangkan
          <strong>RAD</strong> memakai radian.
        </p>

        <p>
          <strong>log</strong> adalah basis 10, <strong>ln</strong> adalah
          logaritma natural, dan <strong>log₂</strong>
          adalah basis 2.
        </p>

        <p>
          <strong>200 + 10%</strong> menghasilkan 220. Pada perkalian,
          <strong>20% × 150000</strong> dibaca sebagai 0.2 × 150000.
        </p>

        <p>
          Perkalian implisit didukung, misalnya
          <strong>2π</strong>, <strong>2(3+4)</strong>, dan
          <strong>(2)(3)</strong>.
        </p>

        <p>
          Keyboard mendukung angka, +, -, *, /, ^, kurung, %, !, Enter,
          Backspace, Delete, dan Escape.
        </p>
      </div>
    </details>
  </section>
</template>
