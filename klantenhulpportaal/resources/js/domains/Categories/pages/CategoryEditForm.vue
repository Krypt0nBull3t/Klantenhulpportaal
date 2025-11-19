<template>
    <form class="space-y-6" @submit.prevent="onSubmit" data-test="category-edit-form">
        <ErrorMessage class="mb-2" />
        <div>
            <label
                for="category-name"
                class="block text-sm font-medium text-gray-700 mb-1"
                aria-label="Category name"
                data-test="category-name-label"
            >
                Category Name
            </label>
            <input
                id="category-name"
                v-model="name"
                data-test="category-name-input"
                aria-label="Category name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            <FormError name="name" class="mt-1 text-red-600 text-sm" />
        </div>
        <div class="flex space-x-2">
            <button
                type="submit"
                data-test="category-submit-btn"
                aria-label="Update category"
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold"
                :disabled="name === category.name"
            >
                Update
            </button>
            <button
                type="button"
                data-test="cancel-btn"
                aria-label="Cancel"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-semibold"
                @click="emit('close')"
            >
                Cancel
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {ref, defineProps, defineEmits} from 'vue';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import FormError from '../../../components/FormError.vue';
import {categoryStore} from '../../Categories/store';
import {Category} from '../../Categories/types';
import {destroyErrors} from '../../../services/error';

const props = defineProps<{category: Category}>();
const emit = defineEmits(['close']);
const name = ref(props.category.name);

async function onSubmit() {
    destroyErrors();
    if (name.value === props.category.name) return;
    await categoryStore.actions.update(props.category.id, {name: name.value});
    emit('close');
}
</script>
