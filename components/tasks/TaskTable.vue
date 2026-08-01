<template>
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3">
              Title
            </th>
            <th class="px-5 py-3">
              Status
            </th>
            <th class="px-5 py-3">
              Priority
            </th>
            <th class="px-5 py-3">
              Assignee
            </th>
            <th class="px-5 py-3">
              Due Date
            </th>
            <th class="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="loading && !tasks.length">
            <td
              colspan="6"
              class="px-5 py-10 text-center text-slate-500"
            >
              Loading tasks...
            </td>
          </tr>
          <tr v-else-if="!tasks.length">
            <td
              colspan="6"
              class="px-5 py-10 text-center text-slate-500"
            >
              No tasks match your filters.
            </td>
          </tr>
          <tr
            v-for="task in tasks"
            :key="task.id"
            class="hover:bg-slate-50/80"
          >
            <td class="max-w-xs px-5 py-4 font-medium text-slate-900">
              {{ task.title }}
            </td>
            <td class="px-5 py-4">
              <TasksStatusBadge :status="task.status" />
            </td>
            <td class="px-5 py-4">
              <TasksPriorityBadge :priority="task.priority" />
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2.5">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700"
                >
                  {{ userInitials(assignee(task)) }}
                </span>
                <span class="truncate text-slate-700">
                  {{ userDisplayName(assignee(task)) }}
                </span>
              </div>
            </td>
            <td class="px-5 py-4 text-slate-600">
              <span class="inline-flex items-center gap-1.5">
                <svg
                  class="h-4 w-4 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                  />
                  <path d="M3 9h18M8 3v4M16 3v4" />
                </svg>
                {{ formatDueDate(task.endDate) }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  title="Edit"
                  @click="emit('edit', task)"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4 11.5-11.5z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                  @click="emit('delete', task)"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  title="More"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="5"
                      r="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="1.5"
                    />
                    <circle
                      cx="12"
                      cy="19"
                      r="1.5"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="hasMore || loadingMore"
      ref="sentinel"
      class="border-t border-slate-100 px-5 py-4"
    >
      <div class="flex items-center justify-center gap-2 text-sm font-medium text-slate-600">
        <svg
          class="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            d="M12 3a9 9 0 109 9"
          />
        </svg>
        Loading more...
      </div>
    </div>
  </div>
</template>

<script setup>
import { userDisplayName, userInitials } from '~/stores/users.js'

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  usersById: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
  loadingMore: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete', 'load-more'])

const sentinel = ref(null)
let observer = null

function formatDueDate(value) {
  if (!value) {
    return '—'
  }

  const [year, month, day] = value.split('-')
  return year && month && day ? `${year}/${month}/${day}` : value
}

function assignee(task) {
  const id = task.members?.[0] ?? task.createdBy
  return props.usersById[id]
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries.some((entry) => entry.isIntersecting)
        && props.hasMore
        && !props.loadingMore
        && !props.loading
      ) {
        emit('load-more')
      }
    },
    { rootMargin: '120px' },
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>
