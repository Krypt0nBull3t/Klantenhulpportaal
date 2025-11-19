<template>
    <form @submit.prevent="handleSubmit" data-test="ticket-edit-form">
        <ErrorMessage data-test="error-message" />

        <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
                id="title"
                v-model="form.title"
                type="text"
                required
                data-test="title-input"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ticket title"
            />
            <FormError name="title" />
        </div>

        <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
                id="category"
                v-model="form.category_id"
                required
                data-test="category-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <FormError name="category_id" />
        </div>

        <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
                id="status"
                v-model="form.status"
                data-test="status-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="0">Closed</option>
                <option value="1">Open</option>
                <option value="2">In Progress</option>
            </select>
            <FormError name="status" />
        </div>

        <div class="mb-6">
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
                id="content"
                v-model="form.content"
                required
                rows="4"
                data-test="content-textarea"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your issue in detail"
            ></textarea>
            <FormError name="content" />
        </div>

        <div class="flex justify-end space-x-3">
            <button
                type="button"
                data-test="cancel-btn"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="emit('close')"
            >
                Cancel
            </button>
            <button
                type="submit"
                data-test="submit-btn"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Update Ticket
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {ticketStore} from '../store';
import {categoryStore} from '../../Categories/store';
import type {Ticket} from '../types';
import type {Updatable} from '../../../services/store/types';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import FormError from '../../../components/FormError.vue';
import {destroyErrors} from '../../../services/error';

const props = defineProps<{
    ticket: Ticket;
}>();

const emit = defineEmits<{
    close: [];
}>();

const categories = computed(() => categoryStore.getters.all.value);

const form = ref<Partial<Updatable<Ticket>>>({
    title: '',
    content: '',
    status: '1',
    category_id: 0,
});

const initializeForm = (): void => {
    form.value = {
        title: props.ticket.title,
        content: props.ticket.content,
        status: props.ticket.status,
        category_id: props.ticket.category_id,
    };
};

const handleSubmit = async (): Promise<void> => {
    destroyErrors();

    await ticketStore.actions.update(props.ticket.id, form.value as Updatable<Ticket>);
    emit('close');
};

initializeForm();
categoryStore.actions.getAll();
</script>
