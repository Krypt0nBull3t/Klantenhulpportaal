<template>
    <PageContainer>
        <ErrorMessage data-test="error-message" />

        <div class="mb-6">
            <h1 data-test="ticket-overview-title" class="text-3xl font-bold text-gray-900 mb-2">Tickets</h1>
            <p class="text-gray-600">Manage support tickets</p>
        </div>

        <BaseCard variant="default" no-padding>
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <p class="text-sm text-gray-600">View and manage your tickets</p>
                <BaseButton data-test="create-ticket-btn" aria-label="Create new ticket" @click="openModal('create')">
                    Create Ticket
                </BaseButton>
            </div>

            <FilterBar>
                <FilterInput
                    v-model="filterConfig.title"
                    placeholder="Search titles and content..."
                    data-test="filter-title-input"
                    full-width
                />

                <FilterSelect v-model="filterConfig.status" data-test="filter-status-select">
                    <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </FilterSelect>

                <FilterSelect v-model="filterConfig.category" data-test="filter-category-select">
                    <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </FilterSelect>

                <FilterSelect v-if="isAdmin" v-model="filterConfig.creator" data-test="filter-creator-select">
                    <option v-for="option in creatorOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </FilterSelect>

                <ActionGroup align="right" spacing="sm">
                    <BaseButton
                        v-if="hasActiveFilters"
                        variant="secondary"
                        size="sm"
                        data-test="clear-filters-btn"
                        @click="clearFilters"
                    >
                        Clear Filters
                    </BaseButton>
                </ActionGroup>
            </FilterBar>

            <DataTable
                :data="sortedAndFilteredTickets"
                :sort-config="sortConfig"
                data-test="ticket-list"
                empty-title="No tickets found"
                :empty-message="!tickets.length ? 'No tickets found.' : 'No tickets match your current filters.'"
                :get-row-key="(ticket: Ticket) => ticket.id"
                @sort="handleSort"
            >
                <template #header="{handleSort: sortHandler, getSortIcon}">
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                        Ticket
                    </th>
                    <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none w-24"
                        @click="sortHandler('status')"
                        data-test="sort-status-header"
                    >
                        Status {{ getSortIcon('status') }}
                    </th>
                    <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none w-28"
                        @click="sortHandler('category')"
                        data-test="sort-category-header"
                    >
                        Category {{ getSortIcon('category') }}
                    </th>
                    <th
                        v-if="isAdmin"
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none w-24 hidden lg:table-cell"
                        @click="sortHandler('creator')"
                        data-test="sort-creator-header"
                    >
                        Creator {{ getSortIcon('creator') }}
                    </th>
                    <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none w-28 hidden md:table-cell"
                        @click="sortHandler('created_at')"
                        data-test="sort-created-header"
                    >
                        Created {{ getSortIcon('created_at') }}
                    </th>
                    <th class="px-3 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Actions
                    </th>
                </template>

                <template #row="{item: ticket}">
                    <td class="px-4 py-4">
                        <div class="max-w-xs">
                            <div class="text-sm font-medium text-gray-900 truncate">
                                {{ ticket.title }}
                            </div>
                            <div class="text-sm text-gray-500 truncate">{{ ticket.content }}</div>
                        </div>
                    </td>
                    <td class="px-3 py-4 whitespace-nowrap">
                        <StatusBadge :variant="getStatusVariant(ticket.status)" data-test="ticket-status" size="sm">
                            {{ getStatusText(ticket.status) }}
                        </StatusBadge>
                    </td>
                    <td class="px-3 py-4 whitespace-nowrap">
                        <StatusBadge variant="default" size="sm">
                            {{ getCategoryName(ticket.category_id) }}
                        </StatusBadge>
                    </td>
                    <td v-if="isAdmin" class="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        {{ getUserName(ticket.user_id) }}
                    </td>
                    <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {{ formatDate(ticket.created_at) }}
                    </td>
                    <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium w-32">
                        <div class="flex justify-end gap-1">
                            <BaseButton
                                variant="link"
                                size="sm"
                                data-test="view-ticket-btn"
                                aria-label="View ticket details"
                                @click="openModal('view', ticket)"
                            >
                                View
                            </BaseButton>
                            <BaseButton
                                variant="link"
                                size="sm"
                                data-test="edit-ticket-btn"
                                aria-label="Edit ticket"
                                @click="openModal('edit', ticket)"
                            >
                                Edit
                            </BaseButton>
                            <BaseButton
                                variant="link"
                                size="sm"
                                data-test="delete-ticket-btn"
                                aria-label="Delete ticket"
                                @click="handleDeleteTicket(ticket.id)"
                            >
                                Delete
                            </BaseButton>
                        </div>
                    </td>
                </template>
            </DataTable>
        </BaseCard>

        <BaseModal :show="!!activeModal" :title="getModalTitle()" @close="closeModal">
            <TicketCreateForm v-if="activeModal === 'create'" @close="closeModal" />
            <TicketEditForm
                v-else-if="activeModal === 'edit' && selectedTicket"
                :ticket="selectedTicket"
                @close="closeModal"
            />
            <TicketDetailView
                v-else-if="activeModal === 'view' && selectedTicket"
                :ticket="selectedTicket"
                @close="closeModal"
                @edit="handleEditFromDetail"
            />
        </BaseModal>
    </PageContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ticketStore } from '../store';
import { categoryStore } from '../../Categories/store';
import { userStore } from '../../Users/store';
import { noteStore } from '../../Notes/store';
import { replyStore } from '../../Replies/store';
import type { Ticket, StatusTextMap, TicketStatus, DateFormatOptions, SortField, SortConfig, FilterConfig } from '../types';
import { destroyErrors, destroyMessage } from '../../../services/error';
import { isAdmin, loggedInUser } from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {
    PageContainer,
    BaseCard,
    BaseButton,
    BaseModal,
    StatusBadge,
    FilterBar,
    FilterInput,
    FilterSelect,
    ActionGroup,
    DataTable,
} from '../../../components/ui';
import type { BadgeVariant } from '../../../components/ui/StatusBadge.vue';
import TicketCreateForm from './TicketCreateForm.vue';
import TicketEditForm from './TicketEditForm.vue';
import TicketDetailView from './TicketDetailView.vue';

const tickets = ticketStore.getters.all;
const categories = categoryStore.getters.all;
const users = userStore.getters.all;

const initializeStores = () => {
    ticketStore.actions.getAll();
    categoryStore.actions.getAll();
    noteStore.actions.getAll();
    replyStore.actions.getAll();
    if (isAdmin.value) userStore.actions.getAll();
};
initializeStores();

const getCategoryName = (categoryId: number) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
};

const getUserName = (userId: number) => {
    if (isAdmin.value) {
        const user = users.value.find(u => u.id === userId);
        return user?.name || 'Unknown';
    } else if (loggedInUser.value && userId === loggedInUser.value.id) {
        return loggedInUser.value.name;
    }
    return 'Unknown';
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

const getStatusVariant = (status: string) => {
    const variantMap: Record<string, BadgeVariant> = {
        '0': 'default',
        '1': 'warning',
        '2': 'success',
    };
    return variantMap[status] ?? 'default';
};

const getStatusText = (status: string) => {
    const statusMap: StatusTextMap = {
        '0': 'Closed',
        '1': 'Open',
        '2': 'In Progress',
    };
    return statusMap[status as TicketStatus] ?? 'Unknown';
};

const makeOptions = (items: any[], getValue: (item: any) => string, label: string) => {
    const unique = [...new Set(items.map(getValue).filter(v => v !== 'Unknown'))];
    return [{ value: '', label }, ...unique.map(v => ({ value: v, label: v }))];
};

const statusOptions = computed(() => [
    { value: '', label: 'All Statuses' },
    { value: '0', label: 'Closed' },
    { value: '1', label: 'Open' },
    { value: '2', label: 'In Progress' },
]);

const categoryOptions = computed(() =>
    makeOptions(tickets.value, t => getCategoryName(t.category_id), 'All Categories')
);

const creatorOptions = computed(() =>
    makeOptions(tickets.value, t => getUserName(t.user_id), 'All Creators')
);

const filterConfig = ref<FilterConfig>({
    status: '',
    category: '',
    creator: '',
    title: '',
});

const applyFilters = (ticket: Ticket) => {
    const { title, status, category, creator } = filterConfig.value;
    if (title.trim() && ![ticket.title, ticket.content].some(text => text.toLowerCase().includes(title.toLowerCase())))
        return false;
    if (status && String(ticket.status) !== status) return false;
    if (category && getCategoryName(ticket.category_id) !== category) return false;
    if (creator && isAdmin.value && getUserName(ticket.user_id) !== creator) return false;
    return true;
};

const filteredTickets = computed(() => tickets.value.filter(applyFilters));

const sortConfig = ref<SortConfig>({
    field: null,
    direction: 'asc',
});

const getSortValue = (ticket: Ticket, field: string) => {
    switch (field) {
        case 'status': return parseInt(ticket.status);
        case 'category': return getCategoryName(ticket.category_id).toLowerCase();
        case 'creator': return getUserName(ticket.user_id).toLowerCase();
        case 'created_at': return new Date(ticket.created_at).getTime();
        default: return '';
    }
};

const sortedAndFilteredTickets = computed(() => {
    const { field, direction } = sortConfig.value;
    const list = [...filteredTickets.value];
    if (!field) return list;
    return list.sort((a, b) => {
        const aVal = getSortValue(a, field);
        const bVal = getSortValue(b, field);
        let cmp = 0;
        if (aVal < bVal) cmp = -1;
        if (aVal > bVal) cmp = 1;
        return direction === 'desc' ? -cmp : cmp;
    });
});

const activeModal = ref<'create' | 'edit' | 'view' | null>(null);
const selectedTicket = ref<Ticket | null>(null);

const openModal = (type: 'create' | 'edit' | 'view', ticket?: Ticket) => {
    if (type === 'view') {
        noteStore.actions.getAll();
        replyStore.actions.getAll();
    }
    activeModal.value = type;
    selectedTicket.value = ticket || null;
};

const closeModal = () => {
    activeModal.value = null;
    selectedTicket.value = null;
    destroyErrors();
    destroyMessage();
};

const getModalTitle = () => {
    switch (activeModal.value) {
        case 'create': return 'Create New Ticket';
        case 'edit': return 'Edit Ticket';
        case 'view': return 'Ticket Details';
        default: return '';
    }
};

const handleEditFromDetail = (ticket: Ticket) => {
    selectedTicket.value = ticket;
    activeModal.value = 'edit';
};

const handleDeleteTicket = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
        await ticketStore.actions.delete(ticketId);
    }
};

const handleSort = (field: string) => {
    if (sortConfig.value.field === field) {
        if (sortConfig.value.direction === 'asc') {
            sortConfig.value.direction = 'desc';
        } else if (sortConfig.value.direction === 'desc') {
            sortConfig.value.field = null;
            sortConfig.value.direction = 'asc';
        }
    } else {
        sortConfig.value.field = field as SortField;
        sortConfig.value.direction = 'asc';
    }
};

const hasActiveFilters = computed(() =>
    Object.values(filterConfig.value).some(val => val && val.trim && val.trim())
);

const clearFilters = () => {
    filterConfig.value = {
        status: '',
        category: '',
        creator: '',
        title: '',
    };
};
</script>