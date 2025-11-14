<template>
  <nav aria-label="Main navigation" class="bg-white shadow-sm border-b border-gray-200 w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link 
            to="/" 
            class="text-2xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
            data-test="navbar-logo"
          >
            Klantenhulpportaal
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-6">
          <!-- Show when NOT authenticated -->
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
          
          <!-- Show when authenticated -->
          <template v-else>
            <span class="text-gray-700" data-test="navbar-welcome">
              Welcome, {{ loggedInUser?.name }}!
            </span>
            
            <!-- Admin-specific navigation -->
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
                to="/admin/users" 
                class="text-purple-600 hover:underline transition-colors" 
                role="link"
                data-test="navbar-admin-users"
              >
                Manage Users
              </router-link>
              <router-link 
                to="/admin/categories" 
                class="text-purple-600 hover:underline transition-colors" 
                role="link"
                data-test="navbar-admin-categories"
              >
                Categories
              </router-link>
            </template>

            <!-- Tickets navigation - different behavior for admin vs regular users -->
            <router-link 
              to="/tickets" 
              class="text-blue-600 hover:underline transition-colors" 
              role="link"
              data-test="navbar-tickets"
            >
              {{ isAdmin ? 'Tickets' : 'My Tickets' }}
            </router-link>
            
            
            <!-- Common authenticated user links -->
            <router-link 
              to="/help" 
              class="text-blue-600 hover:underline transition-colors" 
              role="link"
              data-test="navbar-help"
            >
              Help
            </router-link>
            <LogoutButton />
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { isAuthenticated, loggedInUser, isAdmin } from '../services/auth';
import LogoutButton from './LogoutButton.vue';

/**
 * @component NavBar
 * @description Global navigation bar component that provides role-based navigation.
 * 
 * Features:
 * - Always visible on all pages including auth pages for better UX
 * - Shows different navigation options based on authentication state
 * - Provides admin-specific navigation items for administrators
 * - Includes proper accessibility attributes and test selectors
 * - Responsive design with consistent styling
 * 
 * Navigation Logic:
 * - Non-authenticated users: Login, Register
 * - Authenticated regular users: My Tickets, Logout, Welcome message
 * - Authenticated admin users: Tickets (all tickets), Logout, Welcome message + Admin Dashboard, Manage Users, Categories
 * 
 * Smart Tickets Link:
 * - Regular users see "My Tickets" - shows only their tickets
 * - Admin users see "Tickets" - shows all tickets in the system for management
 */
</script>