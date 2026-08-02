<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
    :class="classes"
  >
    <svg
      class="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5 21V4m0 0c4-3 8 3 14 0v9c-6 3-10-3-14 0"
      />
    </svg>

    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  priority: { type: String, required: true },
});

const labels = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const label = computed(() => labels[props.priority] || props.priority);

const classes = computed(() => {
  switch (props.priority) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-red-50 text-red-700";
    case "medium":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-emerald-50 text-emerald-700";
  }
});
</script>
