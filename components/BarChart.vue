<template>
  <div>
    <canvas ref="barChartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import Chart from "chart.js/auto";

// Define props
interface Props {
  income: number;
  expense: number;
}

const props = defineProps<Props>();

// Chart instance
let barChartInstance: Chart | null = null;

// Reference to the canvas element
const barChartRef = ref<HTMLCanvasElement | null>(null);

// Function to create or update the chart
const createChart = () => {
  if (barChartInstance) {
    barChartInstance.destroy(); // Destroy the previous chart
  }
  if (barChartRef.value) {
    barChartInstance = new Chart(barChartRef.value, {
      type: "bar",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            label: "Cash Flow",
            data: [props.income, props.expense],
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
};

// Mount and watch lifecycle hooks
onMounted(() => {
  createChart();
});

watch([() => props.income, () => props.expense], createChart);
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
