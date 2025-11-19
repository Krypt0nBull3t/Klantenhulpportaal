<template>
    <nav aria-label="Main navigation" class="bg-white shadow-sm border-b border-gray-200 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <router-link
                        to="/"
                        class="text-2xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
                        data-test="navbar-logo"
                    >
                        Klantenhulpportaal
                    </router-link>
                </div>

                <div class="flex items-center space-x-6">
                    <template v-if="!isAuthenticated">
                        <router-link
                            to="/login"
                            class="text-blue-600 hover:underline transition-colors"
                            role="link"
                            data-test="navbar-login"
                        >
                            Login
                        </router-link>
                        <router-link
                            to="/register"
                            class="text-blue-600 hover:underline transition-colors"
                            role="link"
                            data-test="navbar-register"
                        >
                            Register
                        </router-link>
                    </template>

                    <template v-else>
                        <span class="text-gray-700" data-test="navbar-welcome">Welcome, {{ loggedInUser?.name }}!</span>

                        <template v-if="isAdmin">
                            <router-link
                                to="/admin"
                                class="text-purple-600 hover:underline font-semibold transition-colors"
                                role="link"
                                data-test="navbar-admin-dashboard"
                            >
                                Admin Dashboard
                            </router-link>
                            <router-link
                                to="/categories"
                                class="text-purple-600 hover:underline transition-colors"
                                role="link"
                                data-test="navbar-admin-categories"
                            >
                                Categories
                            </router-link>
                        </template>

                        <router-link
                            to="/tickets"
                            class="text-blue-600 hover:underline transition-colors"
                            role="link"
                            data-test="navbar-tickets"
                        >
                            {{ isAdmin ? 'Tickets' : 'My Tickets' }}
                        </router-link>

                        <LogoutButton />
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {isAuthenticated, loggedInUser, isAdmin} from '../services/auth';
import LogoutButton from './LogoutButton.vue';
</script>
