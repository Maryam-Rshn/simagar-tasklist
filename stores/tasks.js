import axios from "axios";
import { defineStore } from "pinia";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
  { value: "backlog", label: "Backlog" },
];

const PRIORITY_OPTIONS = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function emptyFilters() {
  return {
    search: "",
    status: "",
    priority: "",
    assignee: "",
  };
}

function parseTasksResponse(response) {
  const body = response.data;

  if (Array.isArray(body)) {
    const totalHeader = response.headers["x-total-count"];
    return {
      tasks: body,
      total: totalHeader ? Number(totalHeader) : body.length,
    };
  }

  if (body && Array.isArray(body.data)) {
    return {
      tasks: body.data,
      total: body.items ?? body.data.length,
    };
  }

  return { tasks: [], total: 0 };
}

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref([]);
  const total = ref(0);
  const page = ref(1);
  const loading = ref(false);
  const loadingMore = ref(false);
  const error = ref(null);
  const filters = reactive(emptyFilters());
  const isModalOpen = ref(false);
  const editingTask = ref(null);

  const hasMore = computed(() => tasks.value.length < total.value);

  function buildQuery(targetPage) {
    const query = {
      _page: targetPage,
      _per_page: PAGE_SIZE,
      _sort: "-id",
    };

    /// API note: The provided API documentation specifies `title_like` for task title searching. The frontend therefore sends the documented query parameter. However, the provided API currently returns an empty result for `title_like` even when a matching title exists (for example, "Setup API Routes"). The search implementation is therefore kept aligned with the documented API contract rather than introducing client-side filtering that would conflict with server-side pagination.

    if (filters.search.trim()) {
      query.title_like = filters.search.trim();
      // query.title = filters.search.trim()
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }
    // if (filters.assignee !== '') {
    //   query.members = filters.assignee
    // }

    return query;
  }

  async function fetchTasks({ reset = false } = {}) {
    if (reset) {
      page.value = 1;
      loading.value = true;
    } else {
      loadingMore.value = true;
    }

    error.value = null;

    try {
      const config = useRuntimeConfig();
      const targetPage = reset ? 1 : page.value;
      const response = await axios.get(`${config.public.apiBase}/tasks`, {
        params: buildQuery(targetPage),
      });

      const { tasks: data, total: count } = parseTasksResponse(response);
      /*

      Note:
      The API supports server-side pagination and basic json-server filtering,
      but it does not provide a documented way to filter specifically by
      members[0], which represents the assignee.


      Therefore, the assignee filter is applied to the data returned by the API
      for the current page. This means pagination is performed by the API before
      the assignee filter is applied, so the filtered result represents only the
      current page rather than the complete filtered dataset.


      This approach was chosen to work within the limitations of the provided API
      without fetching the entire task collection on every filter request.
      */

      let filteredData = data;
      if (filters.assignee !== "") {
        filteredData = data.filter(
          (task) => String(task.members?.[0]) === String(filters.assignee),
        );
      }
      total.value = filters.assignee !== "" ? filteredData.length : count;

      if (reset) {
        tasks.value = filteredData;
        page.value = 1;
      } else {
        const existingIds = new Set(tasks.value.map((task) => task.id));
        tasks.value.push(
          ...filteredData.filter((task) => !existingIds.has(task.id)),
        );
      }
    } catch (err) {
      error.value = err.message || "Failed to load tasks";
      throw err;
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value || loadingMore.value) {
      return;
    }

    page.value += 1;
    await fetchTasks({ reset: false });
  }

  async function applyFilters() {
    await fetchTasks({ reset: true });
  }

  function clearFilters() {
    Object.assign(filters, emptyFilters());
    return fetchTasks({ reset: true });
  }

  function setSearch(value) {
    filters.search = value;
  }

  function setStatus(value) {
    filters.status = value;
  }

  function setPriority(value) {
    filters.priority = value;
  }

  function setAssignee(value) {
    filters.assignee = value;
  }

  function openCreateModal() {
    editingTask.value = null;
    isModalOpen.value = true;
  }

  function openEditModal(task) {
    editingTask.value = task;
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    editingTask.value = null;
  }

  async function saveTask(payload) {
    const config = useRuntimeConfig();
    const now = new Date().toISOString();

    if (editingTask.value) {
      const { data: updated } = await axios.patch(
        `${config.public.apiBase}/tasks/${editingTask.value.id}`,
        {
          ...payload,
          updatedAt: now,
        },
      );

      const index = tasks.value.findIndex((task) => task.id === updated.id);
      if (index !== -1) {
        tasks.value[index] = updated;
      }
    } else {
      await axios.post(`${config.public.apiBase}/tasks`, {
        ...payload,
        startDate: payload.endDate || now.slice(0, 10),
        createdBy: payload.members[0] ?? 1,
        createdAt: now,
        updatedAt: now,
      });
      await fetchTasks({ reset: true });
    }

    closeModal();
  }

  async function deleteTask(id) {
    const config = useRuntimeConfig();
    await axios.delete(`${config.public.apiBase}/tasks/${id}`);
    tasks.value = tasks.value.filter((task) => task.id !== id);
    total.value = Math.max(0, total.value - 1);
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
  };
});
