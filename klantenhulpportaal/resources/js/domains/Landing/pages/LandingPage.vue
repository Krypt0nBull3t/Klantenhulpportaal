
<template>
  <div class="min-h-screen w-screen bg-gray-50 flex flex-col">
  <nav aria-label="Main navigation" class="w-full flex justify-center p-6 space-x-6">
      <!-- Show when NOT authenticated -->
      <template v-if="!isAuthenticated">
        <router-link to="/login" class="text-blue-600 hover:underline" role="link">Login</router-link>
        <router-link to="/register" class="text-blue-600 hover:underline" role="link">Register</router-link>
        <router-link to="/help" class="text-blue-600 hover:underline" role="link">Help</router-link>
      </template>
      
      <!-- Show when authenticated -->
      <template v-else>
        <span class="text-gray-700">Welcome, {{ loggedInUser?.name }}!</span>
        <router-link to="/help" class="text-blue-600 hover:underline" role="link">Help</router-link>
        <LogoutButton />
      </template>
    </nav>
    <main class="flex-1 flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold mb-4" role="heading" aria-level="1">Klantenhulpportaal</h1>
      <p class="text-lg text-gray-700 mb-8">Customer Support Portal for all your ticket needs.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { isAuthenticated, loggedInUser } from '../../../services/auth';
import LogoutButton from '../../../components/LogoutButton.vue';

/**
 * @component LandingPage
 * @description Landing page for Klantenhulpportaal, showing portal name, description, and navigation.
 * Shows different navigation based on authentication state:
 * - Unauthenticated: Shows Login, Register, Help links
 * - Authenticated: Shows user name, Help link, and Logout button
 */
</script>

<!-- All styling is handled by Tailwind CSS utility classes -->
