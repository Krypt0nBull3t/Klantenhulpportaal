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
                        v-if="sortConfig.field"
                        variant="secondary"
                        size="sm"
                        data-test="clear-sort-btn"
                        @click="clearSort"
                    >
                        Clear Sort
                    </BaseButton>
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
                    <th class="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
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
import {ref, computed} from 'vue';
import {ticketStore} from '../store';
import {categoryStore} from '../../Categories/store';
import {userStore} from '../../Users/store';
import {noteStore} from '../../Notes/store';
import {replyStore} from '../../Replies/store';
import type {Ticket, StatusTextMap, DateFormatOptions, SortField, SortConfig, FilterConfig} from '../types';
import {destroyErrors, destroyMessage} from '../../../services/error';
import {isAdmin, loggedInUser} from '../../../services/auth';
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
import TicketCreateForm from './TicketCreateForm.vue';
import TicketEditForm from './TicketEditForm.vue';
import TicketDetailView from './TicketDetailView.vue';

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

const getStatusVariant = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
    const variantMap: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
        '0': 'default', // Closed
        '1': 'warning', // Open
        '2': 'success', // In Progress
    };
    return variantMap[status] || 'default';
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
