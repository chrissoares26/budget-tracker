<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-4">Budget Tracker</h1>

    <!-- Filters -->
    <Filters @updateFilters="updateFilters" />

    <!-- Totals -->
    <div class="totals flex justify-around mt-6">
      <div class="total-card">
        <p>Total Income:</p>
        <p class="text-green-500 font-bold">
          {{ transactionStore.totalIncome }}
        </p>
      </div>
      <div class="total-card">
        <p>Total Expenses:</p>
        <p class="text-red-500 font-bold">
          {{ transactionStore.totalExpense }}
        </p>
      </div>
      <div class="total-card">
        <p>Balance:</p>
        <p
          :class="{
            'text-green-500': transactionStore.balance >= 0,
            'text-red-500': transactionStore.balance < 0,
          }"
          class="font-bold"
        >
          {{ transactionStore.balance }}
        </p>
      </div>
    </div>

    <!-- Transaction Form -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Add New Transaction</h2>
      <TransactionForm />
    </div>

    <!-- Charts -->
    <div class="charts mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <BarChart
        :income="transactionStore.totalIncome"
        :expense="transactionStore.totalExpense"
      />
      <DonutChart
        :data="transactionStore.categoryBreakdown"
        title="Expense Breakdown"
      />
    </div>

    <!-- Transactions Table -->
    <TransactionTable :transactions="transactionStore.transactions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Filters from "~/components/Filters.vue";
import BarChart from "~/components/BarChart.vue";
import DonutChart from "~/components/DonutChart.vue";
import TransactionTable from "~/components/TransactionTable.vue";
import TransactionForm from "~/components/TransactionForm.vue";
import { useTransactionStore } from "~/stores/transactions";

// Store instance
const transactionStore = useTransactionStore();

// Filters (Year and Month)
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);

// Fetch transactions on page load
onMounted(() => {
  transactionStore.fetchTransactions(selectedYear.value, selectedMonth.value);
});

// Update filters
const updateFilters = async ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  selectedYear.value = year;
  selectedMonth.value = month;
  await transactionStore.fetchTransactions(year, month);
};
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.total-card {
  text-align: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.charts {
  margin-top: 2rem;
}
</style>
