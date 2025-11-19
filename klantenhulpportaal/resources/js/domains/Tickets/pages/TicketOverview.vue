<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage data-test="error-message" />

        <div class="mb-6">
            <h1 data-test="ticket-overview-title" class="text-3xl font-bold text-gray-900 mb-2">Tickets</h1>
            <p class="text-gray-600">Manage support tickets</p>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <p class="text-sm text-gray-600">View and manage your tickets</p>
                <button
                    data-test="create-ticket-btn"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    aria-label="Create new ticket"
                    @click="openModal('create')"
                >
                    Create Ticket
                </button>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex-1 min-w-64">
                        <input
                            v-model="filterConfig.title"
                            type="text"
                            placeholder="Search titles and content..."
                            data-test="filter-title-input"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div class="min-w-32">
                        <select
                            v-model="filterConfig.status"
                            data-test="filter-status-select"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div class="min-w-32">
                        <select
                            v-model="filterConfig.category"
                            data-test="filter-category-select"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div v-if="isAdmin" class="min-w-32">
                        <select
                            v-model="filterConfig.creator"
                            data-test="filter-creator-select"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option v-for="option in creatorOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div class="flex gap-2">
                        <button
                            v-if="sortConfig.field"
                            @click="clearSort"
                            data-test="clear-sort-btn"
                            class="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            Clear Sort
                        </button>
                        <button
                            v-if="hasActiveFilters"
                            @click="clearFilters"
                            data-test="clear-filters-btn"
                            class="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <div class="overflow-hidden">
                <div
                    v-if="!sortedAndFilteredTickets.length"
                    data-test="ticket-empty-state"
                    class="text-center py-8 px-6 text-gray-500"
                >
                    <span v-if="!tickets.length">No tickets found.</span>
                    <span v-else>No tickets match your current filters.</span>
                </div>

                <div v-else class="overflow-x-auto -mx-6">
                    <div class="inline-block min-w-full py-2 align-middle">
                        <table data-test="ticket-list" class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0 w-2/5"
                                    >
                                        Ticket
                                    </th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                                        @click="handleSort('status')"
                                        data-test="sort-status-header"
                                    >
                                        Status {{ getSortIcon('status') }}
                                    </th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                                        @click="handleSort('category')"
                                        data-test="sort-category-header"
                                    >
                                        Category {{ getSortIcon('category') }}
                                    </th>
                                    <th
                                        v-if="isAdmin"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                                        @click="handleSort('creator')"
                                        data-test="sort-creator-header"
                                    >
                                        Creator {{ getSortIcon('creator') }}
                                    </th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                                        @click="handleSort('created_at')"
                                        data-test="sort-created-header"
                                    >
                                        Created {{ getSortIcon('created_at') }}
                                    </th>
                                    <Wrapper>Actions</Wrapper>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr
                                    v-for="ticket in sortedAndFilteredTickets"
                                    :key="ticket.id"
                                    data-test="ticket-row"
                                    class="hover:bg-gray-50"
                                >
                                    <td class="px-6 py-4">
                                        <div class="max-w-sm">
                                            <div class="text-sm font-medium text-gray-900 truncate">
                                                {{ ticket.title }}
                                            </div>
                                            <div class="text-sm text-gray-500 truncate">{{ ticket.content }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            data-test="ticket-status"
                                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                            :class="getStatusClass(ticket.status)"
                                        >
                                            {{ getStatusText(ticket.status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                        >
                                            {{ getCategoryName(ticket.category_id) }}
                                        </span>
                                    </td>
                                    <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ getUserName(ticket.user_id) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ formatDate(ticket.created_at) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            data-test="view-ticket-btn"
                                            class="text-blue-600 hover:text-blue-900"
                                            aria-label="View ticket details"
                                            @click="openModal('view', ticket)"
                                        >
                                            View
                                        </button>
                                        <button
                                            data-test="edit-ticket-btn"
                                            class="text-indigo-600 hover:text-indigo-900"
                                            aria-label="Edit ticket"
                                            @click="openModal('edit', ticket)"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            data-test="delete-ticket-btn"
                                            class="text-red-600 hover:text-red-900"
                                            aria-label="Delete ticket"
                                            @click="handleDeleteTicket(ticket.id)"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="activeModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white/20"
            @click.self="closeModal"
        >
            <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button
                    class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
                    aria-label="Close"
                    @click="closeModal"
                >
                    &times;
                </button>
                <h2 class="text-xl font-bold mb-6 text-gray-900" data-test="modal-title">
                    {{ getModalTitle() }}
                </h2>

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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {ticketStore} from '../store';
import {categoryStore} from '../../Categories/store';
import {userStore} from '../../Users/store';
import {noteStore} from '../../Notes/store';
import {replyStore} from '../../Replies/store';
import type {
    Ticket,
    StatusClassMap,
    StatusTextMap,
    DateFormatOptions,
    SortField,
    SortConfig,
    FilterConfig,
} from '../types';
import {destroyErrors, destroyMessage} from '../../../services/error';
import {isAdmin, loggedInUser} from '../../../services/auth';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import TicketCreateForm from './TicketCreateForm.vue';
import TicketEditForm from './TicketEditForm.vue';
import TicketDetailView from './TicketDetailView.vue';
import Wrapper from '@/components/Wrapper.vue';

const tickets = ticketStore.getters.all;
const categories = categoryStore.getters.all;
const users = userStore.getters.all;

ticketStore.actions.getAll();
categoryStore.actions.getAll();
noteStore.actions.getAll();
replyStore.actions.getAll();
if (isAdmin.value) {
    userStore.actions.getAll();
}

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

const activeModal = ref<'create' | 'edit' | 'view' | null>(null);
const selectedTicket = ref<Ticket | null>(null);
const sortConfig = ref<SortConfig>({
    field: null,
    direction: 'asc',
});

const filterConfig = ref<FilterConfig>({
    status: '',
    category: '',
    creator: '',
    title: '',
});

const statusOptions = computed(() => [
    {value: '', label: 'All Statuses'},
    {value: '0', label: 'Closed'},
    {value: '1', label: 'Open'},
    {value: '2', label: 'In Progress'},
]);

const categoryOptions = computed(() => {
    const uniqueCategories = [
        ...new Set(tickets.value.map(ticket => getCategoryName(ticket.category_id)).filter(name => name !== 'Unknown')),
    ];
    return [{value: '', label: 'All Categories'}, ...uniqueCategories.map(name => ({value: name, label: name}))];
});

const creatorOptions = computed(() => {
    const uniqueCreators = [
        ...new Set(tickets.value.map(ticket => getUserName(ticket.user_id)).filter(name => name !== 'Unknown')),
    ];
    return [{value: '', label: 'All Creators'}, ...uniqueCreators.map(name => ({value: name, label: name}))];
});

const filteredTickets = computed(() => {
    let filtered = tickets.value;

    if (filterConfig.value.title.trim()) {
        const titleSearch = filterConfig.value.title.toLowerCase();
        filtered = filtered.filter(
            ticket =>
                ticket.title.toLowerCase().includes(titleSearch) || ticket.content.toLowerCase().includes(titleSearch),
        );
    }

    if (filterConfig.value.status) {
        filtered = filtered.filter(ticket => String(ticket.status) === filterConfig.value.status);
    }

    if (filterConfig.value.category) {
        filtered = filtered.filter(ticket => getCategoryName(ticket.category_id) === filterConfig.value.category);
    }

    if (filterConfig.value.creator && isAdmin.value) {
        filtered = filtered.filter(ticket => getUserName(ticket.user_id) === filterConfig.value.creator);
    }

    return filtered;
});

const sortedAndFilteredTickets = computed(() => {
    const ticketList = [...filteredTickets.value];

    if (!sortConfig.value.field) {
        return ticketList;
    }

    return ticketList.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortConfig.value.field) {
            case 'status':
                aValue = parseInt(a.status);
                bValue = parseInt(b.status);
                break;
            case 'category':
                aValue = getCategoryName(a.category_id).toLowerCase();
                bValue = getCategoryName(b.category_id).toLowerCase();
                break;
            case 'creator':
                aValue = getUserName(a.user_id).toLowerCase();
                bValue = getUserName(b.user_id).toLowerCase();
                break;
            case 'created_at':
                aValue = new Date(a.created_at).getTime();
                bValue = new Date(b.created_at).getTime();
                break;
            default:
                return 0;
        }

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return sortConfig.value.direction === 'desc' ? -comparison : comparison;
    });
});

ticketStore.actions.getAll();
categoryStore.actions.getAll();
if (isAdmin.value) {
    userStore.actions.getAll();
}

const getStatusClass = (status: string): string => {
    const statusMap: StatusClassMap & Record<string, string> = {
        '0': 'bg-gray-100 text-gray-800', // Closed
        '1': 'bg-yellow-100 text-yellow-800', // Open
        '2': 'bg-green-100 text-green-800', // In Progress
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

const openModal = (type: 'create' | 'edit' | 'view', ticket?: Ticket): void => {
    if (type === 'view') {
        noteStore.actions.getAll();
        replyStore.actions.getAll();
    }

    activeModal.value = type;
    selectedTicket.value = ticket || null;
};

const closeModal = (): void => {
    activeModal.value = null;
    selectedTicket.value = null;
    destroyErrors();
    destroyMessage();
};

const getModalTitle = (): string => {
    switch (activeModal.value) {
        case 'create':
            return 'Create New Ticket';
        case 'edit':
            return 'Edit Ticket';
        case 'view':
            return 'Ticket Details';
        default:
            return '';
    }
};

const handleEditFromDetail = (ticket: Ticket): void => {
    selectedTicket.value = ticket;
    activeModal.value = 'edit';
};

const handleDeleteTicket = async (ticketId: number): Promise<void> => {
    const confirmed: boolean = window.confirm('Are you sure you want to delete this ticket?');
    if (confirmed) {
        await ticketStore.actions.delete(ticketId);
    }
};

const handleSort = (field: SortField): void => {
    if (sortConfig.value.field === field) {
        sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortConfig.value.field = field;
        sortConfig.value.direction = 'asc';
    }
};

const getSortIcon = (field: SortField): string => {
    if (sortConfig.value.field !== field) {
        return '↕️';
    }
    return sortConfig.value.direction === 'asc' ? '↑' : '↓';
};

const hasActiveFilters = computed(() => {
    return !!(
        filterConfig.value.title.trim() ||
        filterConfig.value.status ||
        filterConfig.value.category ||
        filterConfig.value.creator
    );
});

const clearSort = (): void => {
    sortConfig.value = {
        field: null,
        direction: 'asc',
    };
};

const clearFilters = (): void => {
    filterConfig.value = {
        status: '',
        category: '',
        creator: '',
        title: '',
    };
};
</script>
