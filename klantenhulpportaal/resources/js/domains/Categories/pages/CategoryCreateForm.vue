<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <ErrorMessage class="mb-2" />
    <div>
      <label
        for="category-name"
        class="block text-sm font-medium text-gray-700 mb-1"
        >Category Name</label
      >
      <input
        id="category-name"
        v-model="name"
        data-test="category-name-input"
        aria-label="Category name"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <FormError name="name" class="mt-1 text-red-600 text-sm" />
    </div>
    <button
      type="submit"
      data-test="category-submit-btn"
      aria-label="Create category"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
    >
      Create
    </button>
  </form>
</template>

<script setup lang="ts">
/**
 * @file CategoryCreateForm.vue
 * @description Component only triggers store action; error handling is centralized
 */
import { ref, defineEmits } from 'vue'
import ErrorMessage from '../../../components/ErrorMessage.vue'
import FormError from '../../../components/FormError.vue'
import { categoryStore } from '../../Categories/store'
import { destroyErrors } from '../../../services/error'

const name = ref('')

const emit = defineEmits(['close'])

async function onSubmit() {
  destroyErrors()
  await categoryStore.actions.create({ name: name.value })
  emit('close')
}
</script>