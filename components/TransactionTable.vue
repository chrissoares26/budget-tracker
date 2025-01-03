<template>
  <div>
    <table class="min-w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Date</th>
          <th class="border border-gray-300 px-4 py-2">Description</th>
          <th class="border border-gray-300 px-4 py-2">Amount</th>
          <th class="border border-gray-300 px-4 py-2">Type</th>
          <th class="border border-gray-300 px-4 py-2">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in transactions"
          :key="transaction.id"
          class="even:bg-gray-100"
        >
          <td class="border border-gray-300 px-4 py-2">
            {{ new Date(transaction.date).toLocaleDateString() }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ transaction.description }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ transaction.amount.toFixed(2) }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ transaction.type }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ transaction.category }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

interface Transaction {
  id: string;
  date: string; // Firestore's date stored as ISO string
  description: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
}

defineProps({
  transactions: {
    type: Array as PropType<Transaction[]>,
    required: true,
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 8px;
}
</style>
