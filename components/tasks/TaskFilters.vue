<template>
  <div class="space-y-3">
    <div class="relative">
      <svg
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path stroke-linecap="round" d="M20 20l-3-3" />
      </svg>
      <input
        :value="filters.search"
        type="search"
        placeholder="Search tasks..."
        class="field-input pl-10"
        @input="onSearch"
      />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <label class="relative inline-flex min-w-[140px] items-center">
        <svg
          class="pointer-events-none absolute left-3 h-4 w-4 text-slate-400"
          viewBox="0 0 24 24"
          fill="0000"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm3.536-12.95l1.414 1.414-4.95 4.95L10.586 12l4.95-4.95z"
            />
          </g>
        </svg>
        <select
          :value="filters.status"
          class="field-input appearance-none pl-9 pr-8"
          @change="onStatus"
        >
          <option value="">Status: All</option>
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="relative inline-flex min-w-[150px] items-center">
        <svg
          class="pointer-events-none absolute left-3 h-4 w-4 text-slate-800"
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
        <select
          :value="filters.priority"
          class="field-input appearance-none pl-9 pr-8"
          @change="onPriority"
        >
          <option value="">Priority: All</option>
          <option
            v-for="option in priorityOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="relative inline-flex min-w-[170px] items-center">
        <svg
          class="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-800"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 1116 0"
          />
        </svg>
        <select
          :value="filters.assignee === '' ? '' : String(filters.assignee)"
          class="field-input appearance-none pl-9 pr-8"
          @change="onAssignee"
        >
          <option value="">Assignee: All</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ userDisplayName(user) }}
          </option>
        </select>
      </label>

      <button type="button" class="btn-secondary" @click="emit('clear')">
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0119 5M19 19A9 9 0 005 5"
          />
        </svg>
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
import { userDisplayName } from "~/stores/users.js";

defineProps({
  filters: { type: Object, required: true },
  users: { type: Array, default: () => [] },
  statusOptions: { type: Array, required: true },
  priorityOptions: { type: Array, required: true },
});

const emit = defineEmits(["search", "status", "priority", "assignee", "clear"]);

function onSearch(event) {
  emit("search", event.target.value);
}

function onStatus(event) {
  emit("status", event.target.value);
}

function onPriority(event) {
  emit("priority", event.target.value);
}

function onAssignee(event) {
  const value = event.target.value;
  emit("assignee", value === "" ? "" : Number(value));
}
</script>
