<template>
  <div>
    <h2 class="mb-4 text-2xl font-bold">Manage Categories</h2>

    <!-- Add Category Form -->
    <v-form @submit.prevent="addCategory" class="mb-6">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newCategory.name"
            label="Category Name"
            outlined
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="newCategory.type"
            :items="['Income', 'Expense']"
            label="Category Type"
            outlined
            required
          />
        </v-col>
      </v-row>
      <v-btn type="submit" color="primary">Add Category</v-btn>
    </v-form>

    <!-- Categories List -->
    <v-list>
      <v-list-item
        v-for="category in categoryStore.categories"
        :key="category.id"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ category.name }} -
            <span class="text-gray-500">{{ category.type }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon color="error" @click="deleteCategory(category.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useCategoryStore } from "~/stores/categories";

// Category store
const categoryStore = useCategoryStore();

// New category state
const newCategory = reactive({
  name: "",
  type: "Income" as "Income" | "Expense",
});

// Add a new category
const addCategory = async () => {
  if (newCategory.name.trim() === "") return;
  try {
    await categoryStore.addCategory({ ...newCategory });
    newCategory.name = ""; // Reset form
    newCategory.type = "Income"; // Reset type
  } catch (error) {
    console.error("Error adding category:", error);
  }
};

// Delete a category
const deleteCategory = async (categoryId: string) => {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      await categoryStore.deleteCategory(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};

// Fetch categories on component mount
onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<style scoped>
.v-form {
  margin-bottom: 2rem;
}

.text-gray-500 {
  color: #6b7280; /* Tailwind's gray-500 */
}

:deep(.v-list-item__content) {
  display: flex;
  justify-content: space-between;
}
</style>
