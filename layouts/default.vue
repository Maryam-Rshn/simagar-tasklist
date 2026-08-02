<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Mobile Header -->
    <header
      class="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-[var(--sidebar)] px-4 text-white md:hidden"
    >
      <div class="flex items-center gap-2.5">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-slate-900"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span class="text-base font-semibold tracking-tight">
          Task Center
        </span>
      </div>
      <button
        type="button"
        class="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Open menu"
        @click="mobileMenuOpen = true"
      >
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </header>
    <!-- Mobile backdrop -->
    <Transition name="fade">
      <button
        v-if="mobileMenuOpen"
        type="button"
        class="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
        aria-label="Close menu"
        @click="mobileMenuOpen = false"
      />
    </Transition>
    <!-- Sidebar -->
    <aside
      class="flex w-60 shrink-0 flex-col bg-[var(--sidebar)] text-white max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-60 max-md:-translate-x-full max-md:transition-transform max-md:duration-300"
      :class="{ 'max-md:translate-x-0': mobileMenuOpen }"
    >
      <div class="flex items-center gap-2.5 px-5 py-6">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-yellow)] text-slate-900"
        >
          <svg
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span class="text-base font-semibold tracking-tight">Task Center</span>
      </div>

      <nav class="mt-2 px-3 max-md:mt-0 max-md:px-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
          :class="
            isTasksRoute
              ? 'bg-white/5 text-white'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            class="h-4 w-4"
            :fill="isTasksRoute ? 'var(--brand-yellow)' : '#94a3b8'"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 512.004 512.004"
            xml:space="preserve"
          >
            <g>
              <g>
                <g>
                  <path
                    d="M512,74.669c0-11.797-9.536-21.333-21.333-21.333h-25.259c-8.832-24.768-32.299-42.667-60.075-42.667     s-51.221,17.899-60.075,42.667h-29.184C307.243,28.567,283.776,10.669,256,10.669s-51.221,17.899-60.075,42.667h-29.184     c-8.832-24.768-32.299-42.667-60.075-42.667S55.445,28.567,46.592,53.335H21.333C9.536,53.335,0,62.871,0,74.669v85.333h512     V74.669z"
                  />
                  <path
                    d="M0.004,202.669v277.333c0,11.797,9.536,21.333,21.333,21.333H490.65c11.797,0,21.333-9.536,21.333-21.333l0.021-277.333     H0.004z M128.004,416.002c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333     S139.78,416.002,128.004,416.002z M128.004,309.335c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333     s21.333,9.557,21.333,21.333S139.78,309.335,128.004,309.335z M256.004,416.002c-11.776,0-21.333-9.557-21.333-21.333     s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333S267.78,416.002,256.004,416.002z M256.004,309.335     c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333S267.78,309.335,256.004,309.335z      M384.004,416.002c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333     S395.78,416.002,384.004,416.002z M384.004,309.335c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333     s21.333,9.557,21.333,21.333S395.78,309.335,384.004,309.335z"
                  />
                </g>
              </g>
            </g>
          </svg>
          <span
            :class="
              isTasksRoute ? 'text-[var(--brand-yellow)]' : 'text-slate-400'
            "
            >Tasks</span
          >
        </NuxtLink>
      </nav>
    </aside>

    <main class="mt-5 pt-5 md:mt-0 md:pt-0 min-w-0 flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
const route = useRoute();
const isTasksRoute = computed(() => route.path === "/");
const mobileMenuOpen = ref(false);
</script>
