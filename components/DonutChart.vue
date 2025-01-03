<template>
  <div>
    <canvas ref="donutChartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import Chart from "chart.js/auto";

// Define props
interface Props {
  data: Record<string, number>;
  title: string;
}

// Use `defineProps` and assign it to a `props` variable
const props = defineProps<Props>();

// Chart instance
let donutChartInstance: Chart | null = null;

// Reference to the canvas element
const donutChartRef = ref<HTMLCanvasElement | null>(null);

// Function to create or update the chart
const createChart = () => {
  if (donutChartInstance) {
    donutChartInstance.destroy(); // Destroy the previous chart
  }
  if (donutChartRef.value) {
    donutChartInstance = new Chart(donutChartRef.value, {
      type: "doughnut",
      data: {
        labels: Object.keys(props.data),
        datasets: [
          {
            label: props.title,
            data: Object.values(props.data),
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#cc65fe",
              "#ffce56",
              "#4bc0c0",
              "#9966ff",
            ],
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

watch(() => props.data, createChart, { deep: true });
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
