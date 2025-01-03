<template>
  <div>
    <header>
      <nav>
        <ul>
          <li><NuxtLink to="/">Dashboard</NuxtLink></li>
          <li><NuxtLink to="/categories">Manage Categories</NuxtLink></li>
        </ul>
      </nav>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p>© 2025 My Budget App</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  padding: 0;
}

nav li {
  display: inline-block;
}
</style>
