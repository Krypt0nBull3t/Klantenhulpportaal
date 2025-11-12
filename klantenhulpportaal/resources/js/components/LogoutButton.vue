<template>
  <div>
    <ErrorMessage />
    <button 
      type="button"
      data-test="logout-button" 
      aria-label="Logout"
      @click="handleLogout"
      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { logout } from '../services/auth';
import ErrorMessage from './ErrorMessage.vue';
import router from '../router';

async function handleLogout() {
  await logout();
  router.push('/');
}
</script>