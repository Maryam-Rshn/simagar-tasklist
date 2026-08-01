import { defineStore } from 'pinia'

const PAGE_SIZE = 10

const STATUS_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'backlog', label: 'Backlog' },
]

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

function emptyFilters() {
  return {
    search: '',
    status: '',
    priority: '',
    assignee: '',
  }
}

function parseTasksResponse(response) {
  const body = response.data

  if (Array.isArray(body)) {
    const totalHeader = response.headers['x-total-count']
    return {
      tasks: body,
      total: totalHeader ? Number(totalHeader) : body.length,
    }
  }

  if (body && Array.isArray(body.data)) {
    return {
      tasks: body.data,
      total: body.items ?? body.data.length,
    }
  }

  return { tasks: [], total: 0 }
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref(null)
  const filters = reactive(emptyFilters())
  const isModalOpen = ref(false)
  const editingTask = ref(null)

  const hasMore = computed(() => tasks.value.length < total.value)

  function buildQuery(targetPage) {
    const query = {
      _page: targetPage,
      _per_page: PAGE_SIZE,
      _sort: '-id',
    }

    if (filters.search.trim()) {
      query.title_like = filters.search.trim()
    }
    if (filters.status) {
      query.status = filters.status
    }
    if (filters.priority) {
      query.priority = filters.priority
    }
    if (filters.assignee !== '') {
      query.members = filters.assignee
    }

    return query
  }

  async function fetchTasks({ reset = false } = {}) {
    if (reset) {
      page.value = 1
      loading.value = true
    } else {
      loadingMore.value = true
    }

    error.value = null

    try {
      const { $api } = useNuxtApp()
      const targetPage = reset ? 1 : page.value
      const response = await $api.get('/tasks', {
        params: buildQuery(targetPage),
      })

      const { tasks: data, total: count } = parseTasksResponse(response)
      total.value = count

      if (reset) {
        tasks.value = data
        page.value = 1
      } else {
        const existingIds = new Set(tasks.value.map((task) => task.id))
        tasks.value.push(...data.filter((task) => !existingIds.has(task.id)))
      }
    } catch (err) {
      error.value = err.message || 'Failed to load tasks'
      throw err
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value || loadingMore.value) {
      return
    }

    page.value += 1
    await fetchTasks({ reset: false })
  }

  async function applyFilters() {
    await fetchTasks({ reset: true })
  }

  function clearFilters() {
    Object.assign(filters, emptyFilters())
    return fetchTasks({ reset: true })
  }

  function setSearch(value) {
    filters.search = value
  }

  function setStatus(value) {
    filters.status = value
  }

  function setPriority(value) {
    filters.priority = value
  }

  function setAssignee(value) {
    filters.assignee = value
  }

  function openCreateModal() {
    editingTask.value = null
    isModalOpen.value = true
  }

  function openEditModal(task) {
    editingTask.value = task
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    editingTask.value = null
  }

  async function saveTask(payload) {
    const { $api } = useNuxtApp()
    const now = new Date().toISOString()

    if (editingTask.value) {
      const { data: updated } = await $api.patch(
        `/tasks/${editingTask.value.id}`,
        {
          ...payload,
          updatedAt: now,
        },
      )

      const index = tasks.value.findIndex((task) => task.id === updated.id)
      if (index !== -1) {
        tasks.value[index] = updated
      }
    } else {
      await $api.post('/tasks', {
        ...payload,
        startDate: payload.endDate || now.slice(0, 10),
        createdBy: payload.members[0] ?? 1,
        createdAt: now,
        updatedAt: now,
      })
      await fetchTasks({ reset: true })
    }

    closeModal()
  }

  async function deleteTask(id) {
    const { $api } = useNuxtApp()
    await $api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter((task) => task.id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  return {
    tasks,
    total,
    page,
    loading,
    loadingMore,
    error,
    filters,
    isModalOpen,
    editingTask,
    hasMore,
    STATUS_OPTIONS,
    PRIORITY_OPTIONS,
    fetchTasks,
    loadMore,
    applyFilters,
    clearFilters,
    setSearch,
    setStatus,
    setPriority,
    setAssignee,
    openCreateModal,
    openEditModal,
    closeModal,
    saveTask,
    deleteTask,
  }
})
