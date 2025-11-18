<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <ErrorMessage data-test="error-message" />
    
    <div class="mb-6">
      <h1 data-test="ticket-overview-title" class="text-3xl font-bold text-gray-900 mb-2">
        Tickets
      </h1>
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

      <!-- Filters and Controls -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Title/Content Filter -->
          <div class="flex-1 min-w-64">
            <input
              v-model="filterConfig.title"
              type="text"
              placeholder="Search titles and content..."
              data-test="filter-title-input"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Status Filter -->
          <div class="min-w-32">
            <select
              v-model="filterConfig.status"
              data-test="filter-status-select"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="min-w-32">
            <select
              v-model="filterConfig.category"
              data-test="filter-category-select"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="option in categoryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Creator Filter (Admin only) -->
          <div v-if="isAdmin" class="min-w-32">
            <select
              v-model="filterConfig.creator"
              data-test="filter-creator-select"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="option in creatorOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Control Buttons -->
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
        <!-- Empty state -->
        <div v-if="!sortedAndFilteredTickets.length" data-test="ticket-empty-state" class="text-center py-8 px-6 text-gray-500">
          <span v-if="!tickets.length">No tickets found.</span>
          <span v-else>No tickets match your current filters.</span>
        </div>
        
        <!-- Tickets list -->
        <div v-else class="overflow-x-auto -mx-6">
          <div class="inline-block min-w-full py-2 align-middle">
            <table data-test="ticket-list" class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0 w-2/5">
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
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">
                    Actions
                  </th>
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
                    <div class="text-sm font-medium text-gray-900 truncate">{{ ticket.title }}</div>
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
                  <span class="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {{ ticket.category?.name || 'Unknown' }}
                  </span>
                </td>
                <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ ticket.creator?.name || 'Unknown' }}
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

    <!-- Modal -->
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
/**
 * @file TicketOverview.vue
 * @description Ticket overview page component displaying list of tickets
 * @module TicketOverview
 */

import { ref, computed } from 'vue'
import { ticketStore } from '../store'
import { categoryStore } from '../../Categories/store'
import { userStore } from '../../Users/store'
import type { Ticket, StatusClassMap, StatusTextMap, DateFormatOptions, SortField, SortConfig, FilterConfig } from '../types'
import { destroyErrors, destroyMessage } from '../../../services/error'
import { isAdmin, loggedInUser } from '../../../services/auth'
import ErrorMessage from '../../../components/ErrorMessage.vue'
import TicketCreateForm from './TicketCreateForm.vue'
import TicketEditForm from './TicketEditForm.vue'
import TicketDetailView from './TicketDetailView.vue'

// Reactive getters - store getters are already computed refs
const tickets = ticketStore.getters.all
const categories = categoryStore.getters.all
const users = userStore.getters.all

/**
 * @reactive activeModal
 * @description Current active modal type
 */
const activeModal = ref<'create' | 'edit' | 'view' | null>(null)

/**
 * @reactive selectedTicket
 * @description Currently selected ticket for viewing/editing
 */
const selectedTicket = ref<Ticket | null>(null)

/**
 * @reactive sortConfig
 * @description Current sorting configuration
 */
const sortConfig = ref<SortConfig>({
  field: null,
  direction: 'asc'
})

/**
 * @reactive filterConfig
 * @description Current filter configuration
 */
const filterConfig = ref<FilterConfig>({
  status: '',
  category: '',
  creator: '',
  title: ''
})

/**
 * @computed statusOptions
 * @description Available status options for filtering
 */
const statusOptions = computed(() => [
  { value: '', label: 'All Statuses' },
  { value: '0', label: 'Closed' },
  { value: '1', label: 'Open' },
  { value: '2', label: 'In Progress' }
])

/**
 * @computed enrichedTickets
 * @description Tickets with populated category and creator relationships (frontend-handled)
 */
const enrichedTickets = computed(() => {
  return tickets.value.map(ticket => {
    // Pure frontend relationship lookups
    const category = categories.value.find(cat => cat.id === ticket.category_id)
    
    let creator = undefined
    if (isAdmin.value) {
      // Admins can see all creators from the users store
      creator = users.value.find(user => user.id === ticket.user_id)
    } else if (loggedInUser.value && ticket.user_id === loggedInUser.value.id) {
      // Regular users can see their own name for their own tickets
      creator = loggedInUser.value
    }
    
    return {
      ...ticket,
      category: category || undefined,
      creator: creator || undefined
    } as Ticket
  })
})

/**
 * @computed categoryOptions
 * @description Available categories for filtering
 */
const categoryOptions = computed(() => {
  const uniqueCategories = [...new Set(enrichedTickets.value.map(ticket => ticket.category?.name).filter(Boolean))]
  return [
    { value: '', label: 'All Categories' },
    ...uniqueCategories.map(name => ({ value: name, label: name }))
  ]
})

/**
 * @computed creatorOptions
 * @description Available creators for filtering (admin only)
 */
const creatorOptions = computed(() => {
  const uniqueCreators = [...new Set(enrichedTickets.value.map(ticket => ticket.creator?.name).filter(Boolean))]
  return [
    { value: '', label: 'All Creators' },
    ...uniqueCreators.map(name => ({ value: name, label: name }))
  ]
})

/**
 * @computed filteredTickets
 * @description Tickets filtered according to current filter configuration
 */
const filteredTickets = computed(() => {
  let filtered = enrichedTickets.value

  // Apply title filter
  if (filterConfig.value.title.trim()) {
    const titleSearch = filterConfig.value.title.toLowerCase()
    filtered = filtered.filter(ticket => 
      ticket.title.toLowerCase().includes(titleSearch) ||
      ticket.content.toLowerCase().includes(titleSearch)
    )
  }

  // Apply status filter
  if (filterConfig.value.status) {
    filtered = filtered.filter(ticket => String(ticket.status) === filterConfig.value.status)
  }

  // Apply category filter
  if (filterConfig.value.category) {
    filtered = filtered.filter(ticket => ticket.category?.name === filterConfig.value.category)
  }

  // Apply creator filter (admin only)
  if (filterConfig.value.creator && isAdmin.value) {
    filtered = filtered.filter(ticket => ticket.creator?.name === filterConfig.value.creator)
  }

  return filtered
})

/**
 * @computed sortedAndFilteredTickets
 * @description Tickets filtered and sorted according to current configurations
 */
const sortedAndFilteredTickets = computed(() => {
  const ticketList = [...filteredTickets.value]
  
  if (!sortConfig.value.field) {
    return ticketList
  }
  
  return ticketList.sort((a, b) => {
    let aValue: string | number
    let bValue: string | number
    
    switch (sortConfig.value.field) {
      case 'status':
        aValue = parseInt(a.status)
        bValue = parseInt(b.status)
        break
      case 'category':
        aValue = (a.category?.name || '').toLowerCase()
        bValue = (b.category?.name || '').toLowerCase()
        break
      case 'creator':
        aValue = (a.creator?.name || '').toLowerCase()
        bValue = (b.creator?.name || '').toLowerCase()
        break
      case 'created_at':
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
      default:
        return 0
    }
    
    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1
    
    return sortConfig.value.direction === 'desc' ? -comparison : comparison
  })
})

// Fetch all necessary data for frontend relationship handling
ticketStore.actions.getAll()
categoryStore.actions.getAll()
// Only fetch users if admin (for creator names and filter dropdown)
if (isAdmin.value) {
  userStore.actions.getAll()
}

/**
 * @function getStatusClass
 * @description Returns Tailwind CSS classes for ticket status badge
 * @param {string} status - The ticket status
 * @returns {string} CSS classes
 */
const getStatusClass = (status: string): string => {
  const statusMap: StatusClassMap & Record<string, string> = {
    '0': 'bg-gray-100 text-gray-800', // Closed
    '1': 'bg-yellow-100 text-yellow-800', // Open
    '2': 'bg-green-100 text-green-800', // In Progress
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}

/**
 * @function getStatusText
 * @description Returns human-readable text for ticket status
 * @param {string} status - The ticket status
 * @returns {string} Status text
 */
const getStatusText = (status: string): string => {
  const statusMap: StatusTextMap & Record<string, string> = {
    '0': 'Closed',
    '1': 'Open',
    '2': 'In Progress',
  }
  return statusMap[status] || 'Unknown'
}

/**
 * @function formatDate
 * @description Formats ISO date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString: string): string => {
  const options: DateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

/**
 * @function openModal
 * @description Opens modal for ticket actions
 * @param {string} type - Modal type (create, edit, view)
 * @param {Ticket} ticket - Optional ticket for edit/view modals
 */
const openModal = (type: 'create' | 'edit' | 'view', ticket?: Ticket): void => {
  activeModal.value = type
  selectedTicket.value = ticket || null
}

/**
 * @function closeModal
 * @description Closes active modal and resets state
 */
const closeModal = (): void => {
  activeModal.value = null
  selectedTicket.value = null
  destroyErrors()
  destroyMessage()
}

/**
 * @function getModalTitle
 * @description Returns appropriate title for active modal
 */
const getModalTitle = (): string => {
  switch (activeModal.value) {
    case 'create':
      return 'Create New Ticket'
    case 'edit':
      return 'Edit Ticket'
    case 'view':
      return 'Ticket Details'
    default:
      return ''
  }
}

/**
 * @function handleEditFromDetail
 * @description Switches from detail view to edit mode
 * @param {Ticket} ticket - The ticket to edit
 */
const handleEditFromDetail = (ticket: Ticket): void => {
  selectedTicket.value = ticket
  activeModal.value = 'edit'
}

/**
 * @function handleDeleteTicket
 * @description Delete a ticket after confirmation
 * @param {number} ticketId - The ticket ID to delete
 */
const handleDeleteTicket = async (ticketId: number): Promise<void> => {
  const confirmed: boolean = window.confirm('Are you sure you want to delete this ticket?')
  if (confirmed) {
    await ticketStore.actions.delete(ticketId)
  }
}

/**
 * @function handleSort
 * @description Handles sorting by field, toggling direction if same field
 * @param {SortField} field - The field to sort by
 */
const handleSort = (field: SortField): void => {
  if (sortConfig.value.field === field) {
    // Toggle direction if same field
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    // New field, start with ascending
    sortConfig.value.field = field
    sortConfig.value.direction = 'asc'
  }
}

/**
 * @function getSortIcon
 * @description Returns appropriate sort icon for header
 * @param {SortField} field - The field to check
 * @returns {string} Sort indicator
 */
const getSortIcon = (field: SortField): string => {
  if (sortConfig.value.field !== field) {
    return '↕️' // Both directions indicator
  }
  return sortConfig.value.direction === 'asc' ? '↑' : '↓'
}

/**
 * @computed hasActiveFilters
 * @description Checks if any filters are currently active
 */
const hasActiveFilters = computed(() => {
  return !!(
    filterConfig.value.title.trim() ||
    filterConfig.value.status ||
    filterConfig.value.category ||
    filterConfig.value.creator
  )
})

/**
 * @function clearSort
 * @description Clears the current sorting
 */
const clearSort = (): void => {
  sortConfig.value = {
    field: null,
    direction: 'asc'
  }
}

/**
 * @function clearFilters
 * @description Clears all active filters
 */
const clearFilters = (): void => {
  filterConfig.value = {
    status: '',
    category: '',
    creator: '',
    title: ''
  }
}
</script>