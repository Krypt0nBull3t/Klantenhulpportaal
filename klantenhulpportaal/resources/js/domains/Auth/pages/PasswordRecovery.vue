<template>
    <div class="min-h-screen w-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Recover your password</h2>
            </div>
            <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
                <ErrorMessage />
                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            autocomplete="username"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            data-test="recovery-email"
                            aria-label="Email"
                            required
                        />
                        <FormError name="email" />
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-test="recovery-submit"
                        aria-label="Recover Password"
                    >
                        Send Recovery Email
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import FormError from '../../../components/FormError.vue';
import {sendPasswordResetLink} from '../../../services/auth/';
import router from '../../../router';
import type {PasswordResetForm} from '../types';

const form = ref<PasswordResetForm>({
    email: '',
});

async function onSubmit() {
    await sendPasswordResetLink(form.value.email);
    router.push('/login');
}
</script>
