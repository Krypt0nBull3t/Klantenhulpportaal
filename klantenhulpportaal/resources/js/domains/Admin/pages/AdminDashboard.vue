<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Admin Page Header -->
        <div class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p class="mt-2 text-gray-600">Manage your customer support portal</p>
                </div>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Dashboard cards will go here -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <router-link
                                    to="/tickets"
                                    class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center"
                                    role="link"
                                    data-test="admin-dashboard-tickets-link"
                                >
                                    <span class="text-white text-sm font-medium">T</span>
                                </router-link>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ tickets.value.length }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <router-link
                                    to="/users"
                                    class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
                                    role="link"
                                    data-test="admin-dashboard-users-link"
                                >
                                    <span class="text-white text-sm font-medium">U</span>
                                </router-link>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ users.value.length }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <router-link
                                    to="/categories"
                                    class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
                                    role="link"
                                    data-test="admin-dashboard-categories-link"
                                >
                                    <span class="text-white text-sm font-medium">C</span>
                                </router-link>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
                                    <dd class="text-lg font-medium text-gray-900">{{ categories.value.length }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {categoryStore} from '../../Categories/store';
import {ticketStore} from '../../Tickets/store';
import {userStore} from '../../Users/store';
import {computed} from 'vue';

const categories = computed(() => categoryStore.getters.all);
const tickets = computed(() => ticketStore.getters.all);
const users = computed(() => userStore.getters.all);
categoryStore.actions.getAll();
ticketStore.actions.getAll();
userStore.actions.getAll();
</script>
