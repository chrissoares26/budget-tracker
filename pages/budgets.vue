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
    <h1 class="text-2xl font-bold mb-6">Budget Management</h1>

    <!-- Show loading spinner -->
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>

    <!-- Content when data is ready -->
    <div v-else>
      <!-- Add Budget Form -->
      <div class="add-budget mb-6">
        <h2 class="text-xl font-bold mb-4">Add Budget</h2>
        <form @submit.prevent="addNewBudget">
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="newBudget.category" required>
              <option
                v-for="cat in budgetStore.availableCategories"
                :key="cat.id"
                :value="cat.name"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="type">Type</label>
            <select id="type" v-model="newBudget.type" required>
              <option value="Variable">Variable</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="amount">Amount</label>
            <input
              id="amount"
              type="number"
              v-model.number="newBudget.amount"
              min="0"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Add Budget</button>
        </form>
      </div>

      <!-- Budget List -->
      <div class="budget-list">
        <h2 class="text-xl font-bold mb-4">Current Budgets</h2>
        <table class="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="budget in budgetStore.budgets" :key="budget.id">
              <td>{{ budget.category }}</td>
              <td>{{ budget.type }}</td>
              <td>{{ budget.amount }}</td>
              <td>
                <button class="btn btn-secondary" @click="editBudget(budget)">
                  Edit
                </button>
                <button class="btn btn-danger" @click="deleteBudget(budget.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-page {
  padding: 1rem;
}

.add-budget,
.budget-list {
  margin-bottom: 2rem;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.budget-table th,
.budget-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

.budget-table th {
  background-color: #f4f4f4;
}

.btn {
  padding: 0.5rem 1rem;
  margin: 0.2rem;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
  border: none;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
  border: none;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #333;
}
</style>
