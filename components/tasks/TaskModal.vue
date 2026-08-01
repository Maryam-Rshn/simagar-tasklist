<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        class="absolute inset-0 bg-slate-900/40"
        aria-label="Close modal backdrop"
        @click="emit('close')"
      />

      <div
        class="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ task ? 'Edit Task' : 'Create New Task' }}
          </h2>
          <button
            type="button"
            class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
            @click="emit('close')"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        <form
          class="space-y-4"
          @submit.prevent="onSubmit"
        >
          <div>
            <label class="field-label">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              required
              type="text"
              class="field-input"
              placeholder="Enter task title"
            >
          </div>

          <div>
            <label class="field-label">
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="field-input resize-y"
              placeholder="Describe the task"
            />
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label class="field-label">
                Priority
              </label>
              <select
                v-model="form.priority"
                class="field-input"
              >
                <option
                  v-for="option in priorityOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="field-label">
                Due Date
              </label>
              <input
                v-model="form.endDate"
                type="date"
                class="field-input"
              >
            </div>

            <div>
              <label class="field-label">
                Assignee
              </label>
              <select
                v-model.number="form.assigneeId"
                class="field-input"
              >
                <option
                  v-for="user in users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ userDisplayName(user) }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="field-label">
              Status
            </label>
            <select
              v-model="form.status"
              class="field-input"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <p
            v-if="submitError"
            class="text-sm text-red-600"
          >
            {{ submitError }}
          </p>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="btn-secondary"
              :disabled="saving"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : 'Save Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { userDisplayName } from '~/stores/users.js'

const props = defineProps({
  open: { type: Boolean, default: false },
  users: { type: Array, default: () => [] },
  task: { type: Object, default: null },
  statusOptions: { type: Array, required: true },
  priorityOptions: { type: Array, required: true },
})

const emit = defineEmits(['close'])

const tasksStore = useTasksStore()
const saving = ref(false)
const submitError = ref(null)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  endDate: '',
  assigneeId: 1,
  status: 'todo',
})

function resetForm() {
  form.title = props.task?.title ?? ''
  form.description = props.task?.description ?? ''
  form.priority = props.task?.priority ?? 'medium'
  form.endDate = props.task?.endDate ?? ''
  form.assigneeId = props.task?.members?.[0] ?? props.users[0]?.id ?? 1
  form.status = props.task?.status ?? 'todo'
  submitError.value = null
}

watch(
  () => [props.open, props.task],
  ([open]) => {
    if (open) {
      resetForm()
    }
  },
)

async function onSubmit() {
  if (!form.title.trim()) {
    submitError.value = 'Title is required.'
    return
  }

  saving.value = true
  submitError.value = null

  const otherMembers = (props.task?.members ?? []).filter(
    (id) => id !== form.assigneeId,
  )

  try {
    await tasksStore.saveTask({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      endDate: form.endDate,
      status: form.status,
      members: [form.assigneeId, ...otherMembers],
    })
  } catch (err) {
    submitError.value = err.message || 'Failed to save task'
  } finally {
    saving.value = false
  }
}
</script>
