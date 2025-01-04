<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <v-navigation-drawer app permanent width="100">
      <v-list>
        <NuxtLink to="/" class="v-list-item">
          <v-icon>mdi-view-dashboard</v-icon>
        </NuxtLink>
        <NuxtLink to="/categories" class="v-list-item">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </NuxtLink>
        <NuxtLink to="/budgets" class="v-list-item">
          <v-icon>mdi-currency-usd</v-icon>
        </NuxtLink>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->

    <v-app-bar :title="pageTitle" />

    <!-- Main Content -->
    <v-main>
      <NuxtPage />
    </v-main>

    <!-- Footer -->
    <v-footer app>
      <p>© 2025 My Budget App</p>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

// Dynamically set the page title based on the route name
const route = useRoute();
const pageTitle = computed(() => {
  switch (route.name) {
    case "index":
      return "Dashboard";
    case "categories":
      return "Manage Categories";
    case "budgets":
      return "Budget";
    default:
      return "My Budget App";
  }
});
</script>

<style scoped>
.v-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  margin-top: 10px;
}
</style>
