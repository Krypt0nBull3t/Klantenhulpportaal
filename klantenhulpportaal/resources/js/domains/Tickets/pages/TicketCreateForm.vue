<template>
    <form @submit.prevent="handleSubmit" data-test="ticket-create-form">
        <ErrorMessage data-test="error-message" />

        <FormInput
            v-model="form.title"
            type="text"
            name="title"
            label="Title"
            placeholder="Enter ticket title"
            data-test="title-input"
            required
        />

        <FormInput
            v-model="form.category_id"
            type="select"
            name="category_id"
            label="Category"
            placeholder="Select a category"
            data-test="category-select"
            required
        >
            <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
            </option>
        </FormInput>

        <FormInput
            v-model="form.content"
            type="textarea"
            name="content"
            label="Description"
            placeholder="Describe your issue in detail"
            data-test="content-textarea"
            :rows="4"
            required
        />

        <div class="flex justify-end space-x-3">
            <BaseButton type="button" variant="secondary" data-test="cancel-btn" @click="$emit('close')">
                Cancel
            </BaseButton>
            <BaseButton type="submit" data-test="submit-btn">Create Ticket</BaseButton>
        </div>
    </form>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {ticketStore} from '../store';
import {categoryStore} from '../../Categories/store';
import type {Ticket} from '../types';
import type {New} from '../../../services/store/types';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {FormInput, BaseButton} from '../../../components/ui';
import {destroyErrors} from '../../../services/error';

const emit = defineEmits<{
    close: [];
}>();

const categories = computed(() => categoryStore.getters.all.value);

const form = ref<Partial<New<Ticket>>>({
    title: '',
    content: '',
    category_id: 0,
});

const handleSubmit = async (): Promise<void> => {
    destroyErrors();

    await ticketStore.actions.create(form.value as New<Ticket>);
    form.value = {
        title: '',
        content: '',
        category_id: 0,
    };
    emit('close');
};

categoryStore.actions.getAll();
</script>
