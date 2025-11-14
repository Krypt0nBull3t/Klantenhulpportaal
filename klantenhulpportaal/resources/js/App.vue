<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Global Navigation - Always visible for better UX -->
    <NavBar />
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';

/**
 * @component App
 * @description Main application component with global navigation.
 * Navigation is always visible to ensure users can navigate between pages
 * even when they accidentally visit auth pages or other sections.
 */
</script>