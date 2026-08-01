<template>
  <div class="flex min-h-screen bg-slate-50">
    <aside
      class="flex w-60 shrink-0 flex-col bg-[var(--sidebar)] text-white"
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

      <nav class="mt-2 px-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
          :class="
            isTasksRoute
              ? 'bg-white/5 text-white'
              : 'text-slate-300 hover:bg-white/5 hover:text-white'
          "
        >
          <span
            class="h-5 w-0.5 rounded-full"
            :class="isTasksRoute ? 'bg-[var(--brand-yellow)]' : 'bg-transparent'"
          />
          <svg
            class="h-4 w-4"
            :class="isTasksRoute ? 'text-[var(--brand-yellow)]' : 'text-slate-400'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
          Tasks
        </NuxtLink>
      </nav>
    </aside>

    <main class="min-w-0 flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const isTasksRoute = computed(() => route.path === '/')
</script>
