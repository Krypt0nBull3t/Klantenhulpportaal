
<template>
  <div class="min-h-screen w-screen bg-gray-50 flex flex-col">
  <nav aria-label="Main navigation" class="w-full flex justify-center p-6 space-x-6">
      <router-link to="/login" class="text-blue-600 hover:underline" role="link">Login</router-link>
      <router-link to="/register" class="text-blue-600 hover:underline" role="link">Register</router-link>
      <router-link to="/help" class="text-blue-600 hover:underline" role="link">Help</router-link>
    </nav>
    <main class="flex-1 flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold mb-4" role="heading" aria-level="1">Klantenhulpportaal</h1>
      <p class="text-lg text-gray-700 mb-8">Customer Support Portal for all your ticket needs.</p>
    </main>
  </div>
</template>

<script lang="ts">
/**
 * @component LandingPage
 * @description Landing page for Klantenhulpportaal, showing portal name, description, and navigation.
 */
export default {
  name: 'LandingPage',
};
</script>

<!-- All styling is handled by Tailwind CSS utility classes -->
