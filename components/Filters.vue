<template>
  <div class="filters flex gap-4 items-center">
    <div>
      <label for="month" class="block text-sm font-medium text-gray-700"
        >Month</label
      >
      <select
        id="month"
        v-model="selectedMonth"
        @change="emitFilters"
        class="mt-1 block w-full"
      >
        <option
          v-for="(month, index) in months"
          :key="index"
          :value="index + 1"
        >
          {{ month }}
        </option>
      </select>
    </div>

    <div>
      <label for="year" class="block text-sm font-medium text-gray-700"
        >Year</label
      >
      <input
        id="year"
        type="number"
        v-model="selectedYear"
        @input="emitFilters"
        class="mt-1 block w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PropType, defineEmits } from "vue";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Selected values
const selectedMonth = ref(new Date().getMonth() + 1); // Default to current month
const selectedYear = ref(new Date().getFullYear()); // Default to current year

// Emit filters to parent
const emit = defineEmits<{
  (e: "updateFilters", payload: { year: number; month: number }): void;
}>();
const emitFilters = () => {
  emit("updateFilters", {
    year: selectedYear.value,
    month: selectedMonth.value,
  });
};
</script>

<style scoped>
.filters {
  padding: 1rem 0;
}
</style>
