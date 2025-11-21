<template>
    <form @submit.prevent="handleSubmit" data-test="ticket-edit-form">
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
            v-model="form.assigned_to"
            type="select"
            name="assigned_to"
            label="Assigned Admin"
            data-test="assigned-admin-select"
            v-if="isAdmin"
        >
            <option :value="undefined">Unassigned</option>
            <option v-for="admin in adminOptions" :key="admin.id" :value="admin.id">
                {{ admin.name }}
            </option>
        </FormInput>

        <FormInput v-model="form.status" type="select" name="status" label="Status" data-test="status-select">
            <option value="0">Closed</option>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
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

        <ActionGroup align="right">
            <BaseButton type="button" variant="secondary" data-test="cancel-btn" @click="emit('close')">
                Cancel
            </BaseButton>
            <BaseButton type="submit" data-test="submit-btn">Update Ticket</BaseButton>
        </ActionGroup>
    </form>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {ticketStore} from '../store';
import {categoryStore} from '../../Categories/store';
import type {Ticket} from '../types';
import type {Updatable} from '../../../services/store/types';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {FormInput, BaseButton, ActionGroup} from '../../../components/ui';
import {destroyErrors} from '../../../services/error';
import {isAdmin} from '../../../services/auth';
import {userStore} from '../../Users/store';

const users = userStore.getters.all;
const adminOptions = computed(() => users.value.filter(u => u.is_admin));

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
    assigned_to: undefined,
});

const initializeForm = (): void => {
    form.value = {
        title: props.ticket.title,
        content: props.ticket.content,
        status: props.ticket.status,
        category_id: props.ticket.category_id,
        assigned_to: props.ticket.assigned_to ?? undefined,
    };
};

const handleSubmit = async (): Promise<void> => {
    destroyErrors();

    await ticketStore.actions.update(props.ticket.id, form.value as Updatable<Ticket>);
    await ticketStore.actions.getAll();
    emit('close');
};

initializeForm();
categoryStore.actions.getAll();
</script>
