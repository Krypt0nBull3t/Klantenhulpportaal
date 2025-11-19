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
                        <NavLink to="/login" variant="primary" data-test="navbar-login">Login</NavLink>
                        <NavLink to="/register" variant="primary" data-test="navbar-register">Register</NavLink>
                    </template>

                    <template v-else>
                        <span class="text-gray-700" data-test="navbar-welcome">Welcome, {{ loggedInUser?.name }}!</span>

                        <template v-if="isAdmin">
                            <NavLink to="/admin" variant="admin" data-test="navbar-admin-dashboard">
                                Admin Dashboard
                            </NavLink>
                            <NavLink to="/categories" variant="admin" data-test="navbar-admin-categories">
                                Categories
                            </NavLink>
                        </template>

                        <NavLink to="/tickets" variant="primary" data-test="navbar-tickets">
                            {{ isAdmin ? 'Tickets' : 'My Tickets' }}
                        </NavLink>

                        <LogoutButton />
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {isAuthenticated, loggedInUser, isAdmin} from '../services/auth';
import {NavLink} from './ui';
import LogoutButton from './LogoutButton.vue';
</script>
