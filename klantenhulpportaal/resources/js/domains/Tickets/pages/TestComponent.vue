<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Tickets Test Page</h1>
      <p class="text-gray-600 mb-4">This is a test component to verify routing and global navigation.</p>
      <p class="text-sm text-gray-500">
        You should see the global navigation bar above this content. The navigation will show different options based on your authentication state and admin privileges.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * @component TestComponent  
 * @description Test component for tickets routing with global navigation integration.
 * Now uses the global NavBar component for consistent navigation across all pages.
 */
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
