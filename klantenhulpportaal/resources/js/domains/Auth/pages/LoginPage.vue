<template>
    <CenteredContainer>
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
            <ErrorMessage />
            <div class="space-y-4">
                <FormInput
                    v-model="credentials.email"
                    type="email"
                    name="email"
                    label="E-mail"
                    autocomplete="username"
                    data-test="login-email"
                    aria-label="Email"
                />

                <FormInput
                    v-model="credentials.password"
                    type="password"
                    name="password"
                    label="Wachtwoord"
                    autocomplete="current-password"
                    data-test="login-password"
                    aria-label="Password"
                />
            </div>

            <BaseButton type="submit" full-width data-test="login-submit" aria-label="Login">Login</BaseButton>
        </form>
        <div class="mt-4 text-center">
            <router-link
                to="/register"
                class="text-blue-600 hover:underline"
                role="link"
                data-test="login-register-link"
            >
                Nog geen account? Registreer
            </router-link>
        </div>
        <div class="mt-4 text-center">
            <router-link
                to="/password/email"
                class="text-blue-600 hover:underline"
                role="link"
                data-test="login-password-recovery-link"
            >
                Wachtwoord vergeten?
            </router-link>
        </div>
    </CenteredContainer>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {login, isAdmin} from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {CenteredContainer, FormInput, BaseButton} from '../../../components/ui';
import router from '../../../router';
import type {LoginCredentials} from '../types';

const credentials = ref<LoginCredentials>({
    email: '',
    password: '',
});

async function onSubmit() {
    await login(credentials.value);

    if (isAdmin.value) {
        router.push('/admin');
    } else {
        router.push('/');
    }
}
</script>
