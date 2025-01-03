<template>
  <div>
    <h2>Manage Categories</h2>

    <!-- Add Category Form -->
    <form @submit.prevent="addCategory">
      <input
        v-model="newCategory.name"
        type="text"
        placeholder="Category Name"
        required
      />
      <select v-model="newCategory.type" required>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
      <button type="submit">Add Category</button>
    </form>

    <!-- Categories List -->
    <ul>
      <li v-for="category in categoryStore.categories" :key="category.id">
        {{ category.name }} ({{ category.type }})
        <button @click="deleteCategory(category.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useCategoryStore } from "~/stores/categories";

const categoryStore = useCategoryStore();

// New category state
const newCategory = reactive({
  name: "",
  type: "Income" as "Income" | "Expense",
});

// Add a new category
const addCategory = async () => {
  if (newCategory.name.trim() === "") return;
  await categoryStore.addCategory({ ...newCategory });
  newCategory.name = ""; // Reset form
};

// Delete a category
const deleteCategory = async (categoryId: string) => {
  if (confirm("Are you sure you want to delete this category?")) {
    await categoryStore.deleteCategory(categoryId);
  }
};

// Fetch categories on component load
categoryStore.fetchCategories();
</script>

<style scoped>
form {
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
}
</style>
