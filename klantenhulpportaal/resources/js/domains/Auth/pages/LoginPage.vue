<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <form class="bg-white p-8 rounded shadow-md w-full max-w-sm" @submit.prevent="onSubmit">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-2">Email</label>
        <input id="email" v-model="email" type="email" class="w-full px-3 py-2 border rounded" />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 mb-2">Password</label>
        <input id="password" v-model="password" type="password" class="w-full px-3 py-2 border rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  name: 'LoginPage',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');

    function onSubmit() {
      if (!email.value || !password.value) {
        error.value = 'Please enter your email and password';
      } else {
        error.value = '';
        // Handle login logic here
      }
    }

    return { email, password, error, onSubmit };
  },
};
</script>

<!-- Styling handled by Tailwind CSS -->
