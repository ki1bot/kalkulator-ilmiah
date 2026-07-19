<script setup lang="ts">
import { ref } from "vue";
import {
  memoryButtons,
  primaryButtons,
  scientificButtonGroups,
} from "../data/buttons";
import type { ButtonKind, CalculatorButton } from "../types/calculator";

type MobilePanel = "basic" | "scientific";

defineProps<{
  memoryActive: boolean;
}>();

const emit = defineEmits<{
  press: [button: CalculatorButton];
}>();

const activePanel = ref<MobilePanel>("basic");

const buttonClasses: Record<ButtonKind, string> = {
  number: "key key-number",
  operator: "key key-operator",
  function: "key key-function",
  constant: "key key-constant",
  action: "key key-action",
  equals: "key key-equals",
  memory: "key key-memory",
};

const press = (button: CalculatorButton) => {
  emit("press", button);
};
</script>

<template>
  <section class="keypad" aria-label="Tombol kalkulator">
    <nav class="mobile-keypad-tabs" aria-label="Pilihan jenis tombol">
      <button
        type="button"
        :class="{
          active: activePanel === 'basic',
        }"
        @click="activePanel = 'basic'"
      >
        Dasar
      </button>

      <button
        type="button"
        :class="{
          active: activePanel === 'scientific',
        }"
        @click="activePanel = 'scientific'"
      >
        Ilmiah
      </button>
    </nav>

    <div
      class="keypad-section basic-keypad-section"
      :class="{
        'mobile-section-hidden': activePanel !== 'basic',
      }"
    >
      <div class="memory-row">
        <span
          class="memory-indicator"
          :class="{ active: memoryActive }"
          aria-label="Indikator memori"
        >
          M
        </span>

        <button
          v-for="button in memoryButtons"
          :key="button.label"
          type="button"
          :class="buttonClasses[button.kind]"
          :aria-label="button.ariaLabel || button.label"
          @click="press(button)"
        >
          {{ button.label }}
        </button>
      </div>

      <div class="primary-grid">
        <button
          v-for="button in primaryButtons"
          :key="button.label"
          type="button"
          :class="buttonClasses[button.kind]"
          :aria-label="button.ariaLabel || button.label"
          @click="press(button)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>

    <div
      class="keypad-section scientific-keypad-section"
      :class="{
        'mobile-section-hidden': activePanel !== 'scientific',
      }"
    >
      <section
        v-for="group in scientificButtonGroups"
        :key="group.title"
        class="scientific-group"
      >
        <div class="scientific-group-header">
          <h2>{{ group.title }}</h2>
          <p>{{ group.description }}</p>
        </div>

        <div class="scientific-grid">
          <button
            v-for="button in group.buttons"
            :key="`${group.title}-${button.label}`"
            type="button"
            :class="buttonClasses[button.kind]"
            :aria-label="button.ariaLabel || button.label"
            @click="press(button)"
          >
            {{ button.label }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>
