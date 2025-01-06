<template>
  <v-form @submit.prevent="submit" class="transaction-form">
    <v-container>
      <v-row>
        <!-- Date -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formattedDate"
            label="Date"
            type="date"
            outlined
            required
          ></v-text-field>
        </v-col>

        <!-- Description -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="transaction.description"
            label="Description"
            placeholder="Description"
            outlined
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <!-- Amount -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="transaction.amount"
            label="Amount"
            type="number"
            placeholder="Amount"
            outlined
            required
          ></v-text-field>
        </v-col>

        <!-- Type -->
        <v-col cols="12" md="6">
          <v-select
            v-model="transaction.type"
            :items="['Income', 'Expense']"
            label="Type"
            outlined
            required
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <!-- Category -->
        <v-col cols="12">
          <v-select
            v-model="transaction.category"
            :items="filteredCategories"
            item-text="name"
            item-value="name"
            label="Category"
            outlined
            required
          ></v-select>
        </v-col>
      </v-row>

      <v-row justify="center">
        <!-- Submit Button -->
        <v-btn type="submit" color="primary" large>Add Transaction</v-btn>
      </v-row>
    </v-container>
  </v-form>
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
</style>
