<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useCalculator } from "../composables/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay.vue";
import CalculatorKeypad from "./CalculatorKeypad.vue";
import HistoryPanel from "./HistoryPanel.vue";

const {
  expression,
  angleMode,
  memoryActive,
  formattedMemory,
  history,
  lastAnswer,
  lastExpression,
  errorMessage,
  statusMessage,
  livePreview,
  setExpression,
  calculateNow,
  clearAll,
  handleButtonClick,
  clearHistory,
  selectHistoryResult,
  copyResult,
  toggleAngleMode,
} = useCalculator();

const isProfileMenuOpen = ref(false);
const profileMenuRef = ref<HTMLElement | null>(null);

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target;

  if (!(target instanceof Node)) {
    return;
  }

  if (profileMenuRef.value && !profileMenuRef.value.contains(target)) {
    closeProfileMenu();
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeProfileMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);

  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);

  document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <main
    class="relative min-h-screen bg-zinc-100 px-3 py-4 text-zinc-900 sm:px-4 sm:py-8"
  >
    <div
      ref="profileMenuRef"
      class="fixed right-3 top-3 z-50 sm:right-5 sm:top-5"
    >
      <button
        type="button"
        class="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 shadow-lg shadow-zinc-900/15 transition hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Buka informasi pembuat"
        aria-controls="profile-menu"
        :aria-expanded="isProfileMenuOpen"
        @click="toggleProfileMenu"
      >
        <img
          src="/icons/profileWhite.png"
          alt=""
          class="h-8 w-8 object-contain"
        />
      </button>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="-translate-y-2 scale-95 opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="-translate-y-2 scale-95 opacity-0"
      >
        <div
          v-if="isProfileMenuOpen"
          id="profile-menu"
          class="absolute right-0 top-14 w-56 origin-top-right rounded-2xl border border-zinc-700 bg-zinc-900 p-3 text-white shadow-2xl shadow-zinc-900/25"
        >
          <div class="flex items-center gap-3 border-b border-zinc-700 pb-3">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800"
            >
              <img
                src="/icons/profileWhite.png"
                alt="Profile Kibot"
                class="h-8 w-8 object-contain"
              />
            </div>

            <div class="min-w-0">
              <span
                class="block text-[10px] font-medium uppercase tracking-wider text-zinc-400"
              >
                Created by
              </span>

              <strong
                class="mt-0.5 block truncate text-sm font-bold text-white"
              >
                Kibot
              </strong>
            </div>
          </div>

          <a
            href="https://github.com/ki1bot"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Buka akun GitHub Kibot"
            @click="closeProfileMenu"
          >
            <img
              src="/icons/githubWhite.png"
              alt=""
              class="h-5 w-5 object-contain"
            />

            <span>GitHub</span>
          </a>
        </div>
      </Transition>
    </div>

    <div class="mx-auto w-full max-w-3xl pt-12 sm:pt-8">
      <header class="mb-4 text-center sm:mb-6">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
          Kalkulator Ilmiah
        </h1>

        <p class="mt-1 text-sm text-zinc-500">
          Perhitungan dasar dan ilmiah dalam satu kalkulator.
        </p>
      </header>

      <section
        class="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm sm:p-4"
      >
        <div class="mb-2 grid grid-cols-3 gap-2 sm:mb-3">
          <button
            type="button"
            class="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ubah mode sudut"
            @click="toggleAngleMode"
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              Mode
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ angleMode }}
            </strong>
          </button>

          <div
            class="min-w-0 rounded-xl border px-2 py-2 text-center"
            :class="
              memoryActive
                ? 'border-violet-300 bg-violet-50'
                : 'border-zinc-200 bg-zinc-50'
            "
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              Memori
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ formattedMemory }}
            </strong>
          </div>

          <div
            class="min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-2 text-center"
          >
            <span
              class="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
            >
              ANS
            </span>

            <strong class="mt-0.5 block truncate text-sm">
              {{ lastAnswer }}
            </strong>
          </div>
        </div>

        <CalculatorDisplay
          :expression="expression"
          :last-expression="lastExpression"
          :preview="livePreview"
          :error-message="errorMessage"
          :status-message="statusMessage"
          @update:expression="setExpression"
          @calculate="calculateNow"
          @clear="clearAll"
          @copy="copyResult"
        />

        <CalculatorKeypad
          :memory-active="memoryActive"
          @press="handleButtonClick"
        />
      </section>

      <HistoryPanel
        :history="history"
        @select="selectHistoryResult"
        @clear="clearHistory"
      />

      <footer class="py-4 text-center text-xs text-zinc-400">
        Vue 3 · TypeScript · Vite · Tailwind CSS
      </footer>
    </div>
  </main>
</template>
