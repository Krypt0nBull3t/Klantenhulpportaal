
<template>
  <div class="flex-1 flex flex-col items-center justify-center py-16">
    <h1 class="text-4xl font-bold mb-4" role="heading" aria-level="1">Klantenhulpportaal</h1>
    <p class="text-lg text-gray-700 mb-8 text-center max-w-2xl">
      Customer Support Portal for all your ticket needs. Submit tickets, track progress, and get help from our support team.
    </p>
    
    <!-- Call-to-action section for different user states -->
    <div class="mt-8 space-y-4" v-if="!isAuthenticated">
      <div class="flex space-x-4">
        <router-link 
          to="/register" 
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          data-test="landing-register-cta"
        >
          Get Started
        </router-link>
        <router-link 
          to="/login" 
          class="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors font-medium"
          data-test="landing-login-cta"
        >
          Sign In
        </router-link>
      </div>
    </div>
    
    <div class="mt-8" v-else-if="isAuthenticated && !isAdmin">
      <router-link 
        to="/tickets" 
        class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        data-test="landing-tickets-cta"
      >
        View My Tickets
      </router-link>
    </div>
    
    <div class="mt-8" v-else-if="isAdmin">
      <div class="flex space-x-4">
        <router-link 
          to="/admin" 
          class="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
          data-test="landing-admin-cta"
        >
          Admin Dashboard
        </router-link>
        <router-link 
          to="/tickets" 
          class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          data-test="landing-tickets-cta"
        >
          My Tickets
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isAuthenticated, isAdmin } from '../../../services/auth';

/**
 * @component LandingPage
 * @description Landing page for Klantenhulpportaal, showing portal name, description, and navigation.
 * Shows different navigation based on authentication state:
 * - Unauthenticated: Shows Login, Register, Help links
 * - Authenticated: Shows user name, Help link, and Logout button
 */
</script>

<!-- All styling is handled by Tailwind CSS utility classes -->
