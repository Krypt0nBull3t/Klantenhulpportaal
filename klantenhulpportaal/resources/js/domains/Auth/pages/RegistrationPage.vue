<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
        <ErrorMessage />
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="register-name"
              aria-label="Name"
              required
            />
            <FormError name="name" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="register-email"
              aria-label="Email"
              required
            />
            <FormError name="email" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="register-password"
              aria-label="Password"
              required
            />
            <FormError name="password" />
          </div>
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Bevestig wachtwoord</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              data-test="register-password-confirmation"
              aria-label="Confirm Password"
              required
            />
            <FormError name="password_confirmation" />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            data-test="register-submit"
            aria-label="Register"
          >
            Register
          </button>
        </div>
      </form>
      
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:underline" role="link" data-test="register-login-link">
          Al een account? Inloggen
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { register } from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import FormError from '../../../components/FormError.vue';
import router from '../../../router';

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const onSubmit = async () => {
  await register(form.value);
  router.push('/login');
};
</script>
