<template>
    <div data-test="ticket-detail-view" class="space-y-6">
        <ErrorMessage data-test="error-message" />

        <div class="border-b border-gray-200 pb-4">
            <h3 data-test="ticket-title" class="text-lg font-semibold text-gray-900 mb-2">
                {{ ticket.title }}
            </h3>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span data-test="ticket-id">ID: #{{ ticket.id }}</span>
                <span
                    data-test="ticket-status"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(ticket.status)"
                >
                    {{ getStatusText(ticket.status) }}
                </span>
                <span
                    data-test="ticket-category"
                    class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                    {{ getCategoryName(ticket.category_id) }}
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Created by</h4>
                <p data-test="ticket-creator" class="text-sm text-gray-600">
                    {{ getUserName(ticket.user_id) }}
                </p>
            </div>
            <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Created on</h4>
                <p data-test="ticket-created" class="text-sm text-gray-600">
                    {{ formatDate(ticket.created_at) }}
                </p>
            </div>
            <div v-if="ticket.assigned_to">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Assigned to</h4>
                <p data-test="ticket-assigned" class="text-sm text-gray-600">
                    {{ getUserName(ticket.assigned_to) }}
                </p>
            </div>
            <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Last updated</h4>
                <p data-test="ticket-updated" class="text-sm text-gray-600">
                    {{ formatDate(ticket.updated_at) }}
                </p>
            </div>
        </div>

        <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <div data-test="ticket-content" class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ ticket.content }}</p>
            </div>
        </div>

        <div v-if="ticketReplies.length > 0">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Replies ({{ ticketReplies.length }})</h4>
            <div class="space-y-4">
                <div
                    v-for="reply in ticketReplies"
                    :key="reply.id"
                    data-test="ticket-reply"
                    class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-900">{{ getUserName(reply.user_id) }}</span>
                        <span class="text-xs text-gray-500">{{ formatDate(reply.created_at) }}</span>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ reply.content }}</p>
                </div>
            </div>
        </div>

        <div v-if="isAdmin">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Internal Notes</h4>
            <div v-if="ticketNotes.length > 0" class="space-y-4">
                <div
                    v-for="note in ticketNotes"
                    :key="note.id"
                    data-test="ticket-note"
                    class="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400"
                >
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-900">{{ getUserName(note.admin_id) }}</span>
                        <span class="text-xs text-gray-500">{{ formatDate(note.created_at) }}</span>
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ note.content }}</p>
                </div>
            </div>
            <div v-else class="text-sm text-gray-500 italic">No internal notes for this ticket.</div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
                type="button"
                data-test="close-btn"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="emit('close')"
            >
                Close
            </button>
            <button
                type="button"
                data-test="edit-btn"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="emit('edit', ticket)"
            >
                Edit Ticket
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import type {Ticket} from '../types';
import type {StatusClassMap, StatusTextMap, DateFormatOptions} from '../types';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {userStore} from '../../Users/store';
import {categoryStore} from '../../Categories/store';
import {noteStore} from '../../Notes/store';
import {replyStore} from '../../Replies/store';
import {isAdmin} from '../../../services/auth';

const props = defineProps<{
    ticket: Ticket;
}>();

const users = userStore.getters.all;
const categories = categoryStore.getters.all;
const notes = noteStore.getters.all;
const replies = replyStore.getters.all;

const getCategoryName = (categoryId: number) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
};

const getUserName = (userId: number) => {
    const user = users.value.find(u => u.id === userId);
    return user?.name || 'Unknown';
};

const ticketReplies = computed(() =>
    replies.value.filter(reply => Number(reply.ticket_id) === Number(props.ticket.id)),
);

const ticketNotes = computed(() => notes.value.filter(note => Number(note.ticket_id) === Number(props.ticket.id)));

const emit = defineEmits<{
    close: [];
    edit: [ticket: Ticket];
}>();

const getStatusClass = (status: string): string => {
    const statusMap: StatusClassMap & Record<string, string> = {
        '0': 'bg-gray-100 text-gray-800',
        '1': 'bg-yellow-100 text-yellow-800',
        '2': 'bg-green-100 text-green-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string): string => {
    const statusMap: StatusTextMap & Record<string, string> = {
        '0': 'Closed',
        '1': 'Open',
        '2': 'In Progress',
    };
    return statusMap[status] || 'Unknown';
};

const formatDate = (dateString: string): string => {
    const options: DateFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>
