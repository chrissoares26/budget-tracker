<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBudgetStore } from "~/stores/budgets";

// Store instance
const budgetStore = useBudgetStore();
const loading = ref(true);

// Form for adding a new budget
const newBudget = ref({
  category: "",
  type: "Variable",
  amount: 0,
});

// Fetch data on mount
onMounted(async () => {
  loading.value = true; // Start loading
  await Promise.all([
    budgetStore.fetchBudgets(),
    budgetStore.fetchAllCategories(),
  ]);
  loading.value = false; // End loading
});

// Add a new budget
const addNewBudget = async () => {
  try {
    await budgetStore.addBudget({ ...newBudget.value });
    newBudget.value = { category: "", type: "Variable", amount: 0 };
  } catch (error) {
    alert(error.message);
  }
};

// Delete a budget
const deleteBudget = async (id: string) => {
  if (confirm("Are you sure you want to delete this budget?")) {
    await budgetStore.removeBudget(id);
  }
};

// Edit a budget
const editBudget = (budget: Budget) => {
  const newAmount = parseFloat(
    prompt("Enter the new budget amount", budget.amount.toString()) || ""
  );
  if (!isNaN(newAmount)) {
    budgetStore.adjustBudget(budget.id!, newAmount);
  }
};
</script>

<template>
  <div class="budget-page">
    <v-container>
      <h1 class="mb-6 text-2xl font-bold">Budget Management</h1>

      <!-- Show loading spinner -->
      <v-progress-circular v-if="loading" indeterminate color="primary" />

      <!-- Content when data is ready -->
      <div v-else>
        <!-- Add Budget Form -->
        <v-card class="mb-6">
          <v-card-title>Add Budget</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addNewBudget">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="newBudget.category"
                    :items="
                      budgetStore.availableCategories.map((cat) => cat.name)
                    "
                    label="Category"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="newBudget.type"
                    :items="['Variable', 'Fixed']"
                    label="Type"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model.number="newBudget.amount"
                    label="Amount"
                    type="number"
                    min="0"
                    outlined
                    required
                  />
                </v-col>
              </v-row>
              <v-btn type="submit" color="primary">Add Budget</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Budget List -->
        <v-card>
          <v-card-title>Current Budgets</v-card-title>
          <v-data-table
            :items="budgetStore.budgets"
            :headers="[
              { text: 'Category', value: 'category' },
              { text: 'Type', value: 'type' },
              { text: 'Amount', value: 'amount' },
              { text: 'Actions', value: 'actions', sortable: false },
            ]"
            item-value="id"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn small color="secondary" @click="editBudget(item)"
                >Edit</v-btn
              >
              <v-btn small color="error" @click="deleteBudget(item.id)"
                >Delete</v-btn
              >
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.budget-page {
  padding: 1rem;
}
</style>
