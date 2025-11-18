<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <ErrorMessage v-if="!activeModal" data-test="error-message" />
    
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
          @click="openModal('create')"
        >
          Add Category
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
                data-test="edit-category-btn" 
                class="text-blue-600 hover:text-blue-900 font-medium" 
                aria-label="Edit category" 
                @click="openModal('edit', category)"
              >
                Edit
              </button>
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

    <!-- Modal -->
    <div
      v-if="activeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white/20"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          aria-label="Close"
          @click="closeModal"
        >
          &times;
        </button>
        <h2 class="text-xl font-bold mb-6 text-gray-900" data-test="modal-title">
          {{ activeModal === 'create' ? 'Create Category' : 'Edit Category' }}
        </h2>
        <CategoryCreateForm v-if="activeModal === 'create'" @close="closeModal" />
        <CategoryEditForm v-else-if="activeModal === 'edit' && selectedCategory" :category="selectedCategory" @close="closeModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categoryStore } from '../store'
import { Category } from '../types'
import { destroyErrors, destroyMessage } from '../../../services/error'
import ErrorMessage from '../../../components/ErrorMessage.vue'
import CategoryCreateForm from './CategoryCreateForm.vue'
import CategoryEditForm from './CategoryEditForm.vue'

const categories = computed(() => categoryStore.getters.all)
const activeModal = ref<'create' | 'edit' | null>(null)
const selectedCategory = ref<Category | null>(null)


async function deleteCategory(id: number) {
  if (confirm('Are you sure you want to delete this category?')) {
    await categoryStore.actions.delete(id)
  }
}

function openModal(type: 'create' | 'edit', category?: Category) {
  activeModal.value = type
  selectedCategory.value = category || null
}

function closeModal() {
  activeModal.value = null
  selectedCategory.value = null
  destroyErrors()
  destroyMessage()
}

categoryStore.actions.getAll()
</script>

<style scoped>
/* Add Tailwind classes or custom styles as needed */
</style>