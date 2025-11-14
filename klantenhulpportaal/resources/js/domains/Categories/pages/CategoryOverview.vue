<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <ErrorMessage data-test="error-message" />
    
    <div class="mb-6">
      <h1 data-test="category-overview-title" class="text-3xl font-bold text-gray-900 mb-2">
        Categories Management
      </h1>
      <p class="text-gray-600">Manage ticket categories for the support portal</p>
    </div>

    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <p class="text-sm text-gray-600">Manage your support categories</p>
        <button
          data-test="add-category-btn"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          aria-label="Add category"
        >
          Categorie toevoegen
        </button>
      </div>

      <div class="px-6 py-4">
        <!-- Empty state -->
        <div v-if="!categories.value.length" data-test="category-empty-state" class="text-center py-8 text-gray-500">
          No categories found.
        </div>
        
        <!-- Categories list -->
        <ul v-else data-test="category-list" class="divide-y divide-gray-200">
          <li 
            v-for="category in categories.value" 
            :key="category.id" 
            data-test="category-row" 
            class="py-4 flex items-center justify-between"
          >
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-500">ID: {{ category.id }}</p>
            </div>
            <div class="flex space-x-3">
              <button 
                data-test="delete-category-btn" 
                class="text-red-600 hover:text-red-900 font-medium" 
                aria-label="Delete category" 
                @click="deleteCategory(category.id)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categoryStore } from '../store';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import { computed } from 'vue';

/**
 * @component CategoryOverview
 * @description Admin page showing categories automatically loaded from backend via categoryStore
 */

const categories = computed(() => categoryStore.getters.all);

/**
 * Delete a category with confirmation using store action
 */
async function deleteCategory(id: number) {
  if (confirm('Are you sure you want to delete this category?')) {
    await categoryStore.actions.delete(id);
  }
}

// Automatically load categories when component is created
categoryStore.actions.getAll();
</script>

<style scoped>
/* Add Tailwind classes or custom styles as needed */
</style>