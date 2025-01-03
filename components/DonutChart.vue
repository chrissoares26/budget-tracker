<template>
  <div class="donut-charts">
    <!-- Income Donut Chart -->
    <div class="chart-container">
      <canvas ref="incomeChartRef"></canvas>
    </div>

    <!-- Expense Donut Chart -->
    <div class="chart-container">
      <canvas ref="expenseChartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import Chart from "chart.js/auto";

// Define props
interface Props {
  incomeData: Record<string, number>;
  expenseData: Record<string, number>;
}

// Use `defineProps` and assign it to a `props` variable
const props = defineProps<Props>();

// Chart instances
let incomeChartInstance: Chart | null = null;
let expenseChartInstance: Chart | null = null;

// References to canvas elements
const incomeChartRef = ref<HTMLCanvasElement | null>(null);
const expenseChartRef = ref<HTMLCanvasElement | null>(null);

// Function to create or update the income chart
const createIncomeChart = () => {
  if (incomeChartInstance) {
    incomeChartInstance.destroy(); // Destroy the previous chart
  }
  if (incomeChartRef.value) {
    incomeChartInstance = new Chart(incomeChartRef.value, {
      type: "doughnut",
      data: {
        labels: Object.keys(props.incomeData),
        datasets: [
          {
            label: "Income Breakdown",
            data: Object.values(props.incomeData),
            backgroundColor: [
              "#4caf50",
              "#8bc34a",
              "#cddc39",
              "#ffeb3b",
              "#ffc107",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      },
    });
  }
};

// Function to create or update the expense chart
const createExpenseChart = () => {
  if (expenseChartInstance) {
    expenseChartInstance.destroy(); // Destroy the previous chart
  }
  if (expenseChartRef.value) {
    expenseChartInstance = new Chart(expenseChartRef.value, {
      type: "doughnut",
      data: {
        labels: Object.keys(props.expenseData),
        datasets: [
          {
            label: "Expense Breakdown",
            data: Object.values(props.expenseData),
            backgroundColor: [
              "#f44336",
              "#e57373",
              "#ef9a9a",
              "#ff5722",
              "#ff7043",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      },
    });
  }
};

// Mount and watch lifecycle hooks
onMounted(() => {
  createIncomeChart();
  createExpenseChart();
});

watch(() => props.incomeData, createIncomeChart, { deep: true });

watch(() => props.expenseData, createExpenseChart, { deep: true });
</script>

<style scoped>
.donut-charts {
  display: flex;
  gap: 2rem;
  justify-content: space-around;
  align-items: center;
}

.chart-container {
  width: 100%;
  max-width: 400px;
}
</style>
