<template>
    <CenteredContainer>
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
            <ErrorMessage />
            <div class="space-y-4">
                <FormInput
                    v-model="form.name"
                    type="text"
                    name="name"
                    label="Name"
                    autocomplete="name"
                    data-test="register-name"
                    aria-label="Name"
                    required
                />

                <FormInput
                    v-model="form.email"
                    type="email"
                    name="email"
                    label="E-mail"
                    autocomplete="email"
                    data-test="register-email"
                    aria-label="Email"
                    required
                />

                <FormInput
                    v-model="form.password"
                    type="password"
                    name="password"
                    label="Wachtwoord"
                    autocomplete="new-password"
                    data-test="register-password"
                    aria-label="Password"
                    required
                />

                <FormInput
                    v-model="form.password_confirmation"
                    type="password"
                    name="password_confirmation"
                    label="Bevestig wachtwoord"
                    autocomplete="new-password"
                    data-test="register-password-confirmation"
                    aria-label="Confirm Password"
                    required
                />
            </div>

            <BaseButton type="submit" full-width data-test="register-submit" aria-label="Register">Register</BaseButton>
        </form>

        <div class="mt-4 text-center">
            <router-link to="/login" class="text-blue-600 hover:underline" role="link" data-test="register-login-link">
                Al een account? Inloggen
            </router-link>
        </div>
    </CenteredContainer>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {register} from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {CenteredContainer, FormInput, BaseButton} from '../../../components/ui';
import router from '../../../router';
import type {RegistrationForm} from '../types';

const form = ref<RegistrationForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const onSubmit = async () => {
    await register(form.value);
    router.push('/login');
};
</script>
