
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
            <InfoBlock>
                <template #label>Created by</template>
                {{ getUserName(ticket.user_id) }}
            </InfoBlock>
            <InfoBlock>
                <template #label>Created on</template>
                {{ formatDate(ticket.created_at) }}
            </InfoBlock>
            <InfoBlock v-if="ticket.assigned_to">
                <template #label>Assigned to</template>
                {{ getUserName(ticket.assigned_to) }}
            </InfoBlock>
            <InfoBlock>
                <template #label>Last updated</template>
                {{ formatDate(ticket.updated_at) }}
            </InfoBlock>
        </div>

        <CardSection>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ ticket.content }}</p>
        </CardSection>

        <div v-if="ticketReplies.length > 0">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Replies ({{ ticketReplies.length }})</h4>
            <div class="space-y-4">
                <MessageBlock
                    v-for="reply in ticketReplies"
                    :key="reply.id"
                    type="reply"
                    data-test="ticket-reply"
                >
                    <template #author>{{ getUserName(reply.user_id) }}</template>
                    <template #date>{{ formatDate(reply.created_at) }}</template>
                    {{ reply.content }}
                </MessageBlock>
            </div>
        </div>

        <div v-if="isAdmin">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Internal Notes</h4>
            <div v-if="ticketNotes.length > 0" class="space-y-4">
                <MessageBlock
                    v-for="note in ticketNotes"
                    :key="note.id"
                    type="note"
                    data-test="ticket-note"
                >
                    <template #author>{{ getUserName(note.admin_id) }}</template>
                    <template #date>{{ formatDate(note.created_at) }}</template>
                    {{ note.content }}
                </MessageBlock>
            </div>
            <div v-else class="text-sm text-gray-500 italic">No internal notes for this ticket.</div>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <BaseButton
                type="button"
                variant="secondary"
                data-test="close-btn"
                @click="emit('close')"
            >
                Close
            </BaseButton>
            <BaseButton
                type="button"
                variant="primary"
                data-test="edit-btn"
                @click="emit('edit', ticket)"
            >
                Edit Ticket
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import type {Ticket} from '../types';
import type {StatusClassMap, StatusTextMap, DateFormatOptions} from '../types';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import { CardSection, InfoBlock, MessageBlock, BaseButton } from '../../../components/ui';
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
