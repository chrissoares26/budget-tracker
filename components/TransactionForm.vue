<template>
  <form @submit.prevent="submit" class="transaction-form">
    <!-- Date -->
    <label for="date">Date:</label>
    <input id="date" type="date" v-model="formattedDate" required />

    <!-- Description -->
    <label for="description">Description:</label>
    <input
      id="description"
      type="text"
      v-model="transaction.description"
      placeholder="Description"
      required
    />

    <!-- Amount -->
    <label for="amount">Amount:</label>
    <input
      id="amount"
      type="number"
      v-model.number="transaction.amount"
      placeholder="Amount"
      required
    />

    <!-- Type -->
    <label for="type">Type:</label>
    <select id="type" v-model="transaction.type" required>
      <option value="Income">Income</option>
      <option value="Expense">Expense</option>
    </select>

    <!-- Category -->
    <label for="category">Category:</label>
    <select id="category" v-model="transaction.category" required>
      <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.name">
        {{ cat.name }}
      </option>
    </select>

    <!-- Submit Button -->
    <button type="submit">Add Transaction</button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useTransactionStore } from "~/stores/transactions";
import { useCategoryStore } from "~/stores/categories";

// Define the Transaction type
interface Transaction {
  date: string | Date;
  description: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
}

// Stores
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

// Reactive transaction object
const transaction = reactive<Transaction>({
  date: new Date(), // Default to today
  description: "",
  amount: 0,
  type: "Income",
  category: "",
});

// Format the date for the input field
const formattedDate = computed({
  get: () =>
    transaction.date instanceof Date
      ? transaction.date.toISOString().split("T")[0]
      : transaction.date,
  set: (value: string) => {
    transaction.date = value ? new Date(value) : new Date();
  },
});

// Fetch categories on mount
onMounted(() => {
  categoryStore.fetchCategories();
});

// Filter categories based on transaction type
const filteredCategories = computed(() =>
  categoryStore.categories.filter((cat) => cat.type === transaction.type)
);

// Submit the transaction
const submit = async () => {
  // Validate date
  if (!transaction.date || !(transaction.date instanceof Date)) {
    alert("Please select a valid date.");
    return;
  }

  await transactionStore.addTransaction(transaction);

  // Reset form
  transaction.date = new Date();
  transaction.description = "";
  transaction.amount = 0;
  transaction.category = "";
};
</script>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

input,
select,
button {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
