<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    :class="classes"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass" />
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: { type: String, required: true },
})

const labels = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done',
  backlog: 'Backlog',
}

const label = computed(() => labels[props.status] || props.status)

const classes = computed(() => {
  switch (props.status) {
    case 'in-progress':
      return 'bg-blue-50 text-blue-700'
    case 'done':
      return 'bg-emerald-50 text-emerald-700'
    case 'review':
      return 'bg-violet-50 text-violet-700'
    case 'backlog':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
})

const dotClass = computed(() => {
  switch (props.status) {
    case 'in-progress':
      return 'bg-blue-500'
    case 'done':
      return 'bg-emerald-500'
    case 'review':
      return 'bg-violet-500'
    default:
      return 'bg-slate-400'
  }
})
</script>
