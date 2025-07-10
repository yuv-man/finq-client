<template>
  <nav class="navigation">
    <ul>
      <li><router-link to="/random-users">Random Users</router-link></li>
      <li><router-link to="/history">History</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navigation {
  background-color: #ffffff;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navigation li {
  margin: 0;
}

.navigation a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.navigation a:hover {
  background-color: #f5f5f5;
  color: #1e88e5;
}

.navigation a.router-link-exact-active {
  background-color: #e3f2fd;
  color: #1976d2;
}

</style> 