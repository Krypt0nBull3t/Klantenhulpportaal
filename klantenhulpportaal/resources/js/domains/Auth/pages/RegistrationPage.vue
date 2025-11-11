<template>
  <form @submit.prevent="onSubmit">
    <div>
      <input
        data-test="register-name"
        type="text"
        aria-label="Name"
        v-model="form.name"
        required
      />
  <FormError name="name" />
    </div>
    <div>
      <input
        data-test="register-email"
        type="email"
        aria-label="Email"
        v-model="form.email"
        required
      />
  <FormError name="email" />
    </div>
    <div>
      <input
        data-test="register-password"
        type="password"
        aria-label="Password"
        v-model="form.password"
        required
      />
  <FormError name="password" />
    </div>
    <div>
      <input
        data-test="register-password-confirmation"
        type="password"
        aria-label="Confirm Password"
        v-model="form.password_confirmation"
        required
      />
  <FormError name="password_confirmation" />
    </div>
    <button
      data-test="register-submit"
      type="submit"
      aria-label="Register"
    >
      Register
    </button>
    <ErrorMessage />
  </form>
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
