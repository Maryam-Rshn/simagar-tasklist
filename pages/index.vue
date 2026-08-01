<template>
  <div class="px-6 py-8 sm:px-8 lg:px-10">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">
        Task Center
      </h1>
      <button
        type="button"
        class="btn-primary"
        @click="tasksStore.openCreateModal()"
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
            d="M12 5v14M5 12h14"
          />
        </svg>
        New Task
      </button>
    </div>

    <div class="mb-5">
      <TasksTaskFilters
        :filters="tasksStore.filters"
        :users="usersStore.users"
        :status-options="tasksStore.STATUS_OPTIONS"
        :priority-options="tasksStore.PRIORITY_OPTIONS"
        @search="onSearch"
        @status="onStatus"
        @priority="onPriority"
        @assignee="onAssignee"
        @clear="onClear"
      />
    </div>

    <p
      v-if="tasksStore.error"
      class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ tasksStore.error }}
    </p>

    <TasksTaskTable
      :tasks="tasksStore.tasks"
      :users-by-id="usersStore.usersById"
      :loading="tasksStore.loading"
      :loading-more="tasksStore.loadingMore"
      :has-more="tasksStore.hasMore"
      @edit="tasksStore.openEditModal"
      @delete="onDelete"
      @load-more="tasksStore.loadMore"
    />

    <p class="mt-3 text-sm text-slate-500">
      Showing {{ tasksStore.tasks.length }} of {{ tasksStore.total }} tasks
    </p>

    <TasksTaskModal
      :open="tasksStore.isModalOpen"
      :users="usersStore.users"
      :task="tasksStore.editingTask"
      :status-options="tasksStore.STATUS_OPTIONS"
      :priority-options="tasksStore.PRIORITY_OPTIONS"
      @close="tasksStore.closeModal()"
    />
  </div>
</template>

<script setup>
useHead({
  title: 'Task Center',
})

const tasksStore = useTasksStore()
const usersStore = useUsersStore()

let searchTimer = null

await Promise.all([
  usersStore.fetchUsers(),
  tasksStore.fetchTasks({ reset: true }),
])

function onSearch(value) {
  tasksStore.setSearch(value)
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  searchTimer = setTimeout(() => {
    tasksStore.applyFilters()
  }, 300)
}

function onStatus(value) {
  tasksStore.setStatus(value)
  tasksStore.applyFilters()
}

function onPriority(value) {
  tasksStore.setPriority(value)
  tasksStore.applyFilters()
}

function onAssignee(value) {
  tasksStore.setAssignee(value)
  tasksStore.applyFilters()
}

function onClear() {
  tasksStore.clearFilters()
}

async function onDelete(task) {
  if (!window.confirm(`Delete "${task.title}"?`)) {
    return
  }
  await tasksStore.deleteTask(task.id)
}

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})
</script>
