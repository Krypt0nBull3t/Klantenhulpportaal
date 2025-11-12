<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
        <ErrorMessage />
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              autocomplete="username"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="login-email"
              aria-label="Email"
              required
            />
            <FormError name="email" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              autocomplete="current-password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="login-password"
              aria-label="Password"
              required
            />
            <FormError name="password" />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            data-test="login-submit"
            aria-label="Login"
          >
            Login
          </button>
        </div>
      </form>
      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-600 hover:underline" role="link" data-test="login-register-link">
          Nog geen account? Registreer
        </router-link>
      </div>
      <div class="mt-4 text-center">
        <router-link to="/password/email" class="text-blue-600 hover:underline" role="link" data-test="login-password-recovery-link">
          Wachtwoord vergeten?
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { login, isAdmin } from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import FormError from '../../../components/FormError.vue';
import router from '../../../router';

const credentials = ref({
  email: '',
  password: ''
});

async function onSubmit() {
  await login(credentials.value);
  
  // Check if user is admin and redirect accordingly
  if (isAdmin.value) {
    router.push('/admin');
  } else {
    router.push('/');
  }
}
</script>
