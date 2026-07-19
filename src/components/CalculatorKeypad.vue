<script setup lang="ts">
import {
  memoryButtons,
  primaryButtons,
  scientificButtonGroups,
} from "../data/buttons";
import type {
  AngleMode,
  ButtonKind,
  CalculatorButton,
} from "../types/calculator";

const props = defineProps<{
  angleMode: AngleMode;
  memoryActive: boolean;
}>();

const emit = defineEmits<{
  press: [button: CalculatorButton];
  toggleAngle: [];
}>();

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
    <div class="keypad-topbar">
      <button
        type="button"
        class="mode-button"
        :aria-label="`Ubah mode sudut. Mode sekarang ${props.angleMode}`"
        @click="emit('toggleAngle')"
      >
        <span>Mode sudut</span>
        <strong>{{ props.angleMode }}</strong>
      </button>

      <div class="memory-row">
        <span
          class="memory-indicator"
          :class="{
            active: props.memoryActive,
          }"
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
    </div>

    <details class="scientific-panel" open>
      <summary>Fungsi ilmiah</summary>

      <div class="scientific-groups">
        <section
          v-for="group in scientificButtonGroups"
          :key="group.title"
          class="scientific-group"
        >
          <div class="group-heading">
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
    </details>

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
  </section>
</template>
