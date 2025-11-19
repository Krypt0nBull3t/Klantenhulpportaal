/**
 * @file TicketOverview.spec.ts
 * @description Vitest test for TicketOverview.vue using ticketStore
 * @module TicketOverviewTest
 */

import {mount, flushPromises} from '@vue/test-utils';
import TicketOverview from '../../resources/js/domains/Tickets/pages/TicketOverview.vue';
import {ref, computed} from 'vue';
import {Ticket} from '../../resources/js/domains/Tickets/types';
import {destroyMessage, destroyErrors, setMessage} from '../../resources/js/services/error';

// Mock router
const mockRouter = {
    push: vi.fn(),
};

// Mock auth service
vi.mock('../../resources/js/services/auth', () => ({
    isAdmin: {value: true}, // Set as admin to show creator column
}));

let ticketsRef: ReturnType<typeof ref<Ticket[]>>;
let mockActions: {
    getAll: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
};

vi.mock('../../resources/js/domains/Tickets/store', () => ({
    ticketStore: {
        get actions() {
            return mockActions;
        },
        get getters() {
            // Match the component: computed ref
            return {all: computed(() => ticketsRef.value)};
        },
    },
}));

const mockCategoriesRef = ref([
    {id: 1, name: 'Technical'},
    {id: 2, name: 'General'},
]);

const mockUsersRef = ref([
    {id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false},
    {id: 2, name: 'Jane Smith', email: 'jane@example.com', is_admin: true},
    {id: 3, name: 'Bob Johnson', email: 'bob@example.com', is_admin: false},
]);

vi.mock('../../resources/js/domains/Categories/store', () => ({
    categoryStore: {
        actions: {
            getAll: vi.fn(),
        },
        get getters() {
            return {all: computed(() => mockCategoriesRef.value)};
        },
    },
}));

vi.mock('../../resources/js/domains/Users/store', () => ({
    userStore: {
        actions: {
            getAll: vi.fn(),
        },
        get getters() {
            return {all: computed(() => mockUsersRef.value)};
        },
    },
}));

const mockTickets: Ticket[] = [
    {
        id: 1,
        title: 'Login Issue',
        content: 'Cannot login to the system',
        status: '1',
        user_id: 1,
        category_id: 1,
        created_at: '2025-11-18T10:00:00Z',
        updated_at: '2025-11-18T10:00:00Z',
        creator: {id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false},
        category: {id: 1, name: 'Technical'},
    },
    {
        id: 2,
        title: 'Feature Request',
        content: 'Need new dashboard feature',
        status: '2',
        user_id: 2,
        category_id: 2,
        created_at: '2025-11-18T11:00:00Z',
        updated_at: '2025-11-18T11:00:00Z',
        creator: {id: 2, name: 'Jane Smith', email: 'jane@example.com', is_admin: true},
        category: {id: 2, name: 'General'},
    },
    {
        id: 3,
        title: 'Password Reset',
        content: 'Completed password reset request',
        status: '0',
        user_id: 3,
        category_id: 1,
        created_at: '2025-11-18T09:00:00Z',
        updated_at: '2025-11-18T12:00:00Z',
        creator: {id: 3, name: 'Bob Johnson', email: 'bob@example.com', is_admin: false},
        category: {id: 1, name: 'Technical'},
    },
];

describe('TicketOverview.vue', () => {
    const mountComponent = () => {
        return mount(TicketOverview, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });
    };

    beforeEach(() => {
        ticketsRef = ref<Ticket[]>([]);
        mockActions = {
            getAll: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            create: vi.fn(),
        };
        // Reset error messages
        destroyMessage();
        destroyErrors();
        vi.clearAllMocks();
        // Mock window.confirm to return true for all tests
        Object.defineProperty(window, 'confirm', {
            writable: true,
            value: vi.fn().mockReturnValue(true),
        });
    });

    it('fetches and displays tickets from the backend API', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });
        await flushPromises();
        // Assert
        const rows = wrapper.findAll('[data-test="ticket-row"]');
        expect(rows.length).toBe(ticketsRef.value.length);
        expect(rows[0].text()).toContain('Login Issue');
        expect(rows[1].text()).toContain('Feature Request');
    });

    it('renders all tickets in the overview when present', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mountComponent();
        await flushPromises();
        // Assert
        const ticketList = wrapper.find('[data-test="ticket-list"]');
        expect(ticketList.exists()).toBe(true);

        const rows = wrapper.findAll('[data-test="ticket-row"]');
        expect(rows.length).toBe(3);

        // Check first ticket details
        expect(rows[0].text()).toContain('Login Issue');
        expect(rows[0].text()).toContain('John Doe');
        expect(rows[0].text()).toContain('Technical');

        // Check second ticket details
        expect(rows[1].text()).toContain('Feature Request');
        expect(rows[1].text()).toContain('Jane Smith');
        expect(rows[1].text()).toContain('General');
    });

    it('shows empty state when no tickets are present', async () => {
        // Arrange
        ticketsRef.value = [];
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const emptyState = wrapper.find('[data-test="ticket-empty-state"]');
        expect(emptyState.exists()).toBe(true);
        expect(emptyState.text()).toContain('No tickets found');

        const ticketList = wrapper.find('[data-test="ticket-list"]');
        expect(ticketList.exists()).toBe(false);
    });

    it('displays page title and description correctly', async () => {
        // Arrange
        ticketsRef.value = [];
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const title = wrapper.find('[data-test="ticket-overview-title"]');
        expect(title.exists()).toBe(true);
        expect(title.text()).toContain('Tickets');
    });

    it('shows create ticket button', async () => {
        // Arrange
        ticketsRef.value = [];
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const createButton = wrapper.find('[data-test="create-ticket-btn"]');
        expect(createButton.exists()).toBe(true);
        expect(createButton.text()).toContain('Create Ticket');
        expect(createButton.attributes('aria-label')).toBe('Create new ticket');
    });

    it('displays view buttons for each ticket', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const viewButtons = wrapper.findAll('[data-test="view-ticket-btn"]');
        expect(viewButtons.length).toBe(3);

        viewButtons.forEach(button => {
            expect(button.text()).toContain('View');
            expect(button.attributes('aria-label')).toBe('View ticket details');
        });
    });

    it('displays edit buttons for each ticket', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const editButtons = wrapper.findAll('[data-test="edit-ticket-btn"]');
        expect(editButtons.length).toBe(3);

        editButtons.forEach(button => {
            expect(button.text()).toContain('Edit');
            expect(button.attributes('aria-label')).toBe('Edit ticket');
        });
    });

    it('displays delete buttons for each ticket', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const deleteButtons = wrapper.findAll('[data-test="delete-ticket-btn"]');
        expect(deleteButtons.length).toBe(3);

        deleteButtons.forEach(button => {
            expect(button.text()).toContain('Delete');
            expect(button.attributes('aria-label')).toBe('Delete ticket');
        });
    });

    it('calls delete action when delete button is clicked and confirmed', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Act
        const deleteButton = wrapper.find('[data-test="delete-ticket-btn"]');
        await deleteButton.trigger('click');
        await flushPromises();

        // Assert
        expect(mockActions.delete).toHaveBeenCalledTimes(1);
        expect(mockActions.delete).toHaveBeenCalledWith(1); // First ticket ID
    });

    it('does not call delete action when delete is cancelled', async () => {
        // Arrange
        vi.mocked(window.confirm).mockReturnValue(false);
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Act
        const deleteButton = wrapper.find('[data-test="delete-ticket-btn"]');
        await deleteButton.trigger('click');
        await flushPromises();

        // Assert
        expect(mockActions.delete).not.toHaveBeenCalled();
    });

    it('displays error message when present', async () => {
        // Arrange
        setMessage('Failed to load tickets');
        ticketsRef.value = [];
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        const errorMessage = wrapper.find('[data-test="error-message"]');
        expect(errorMessage.exists()).toBe(true);
    });

    it('displays status badges correctly', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });
        await flushPromises();
        // Assert
        const statusBadges = wrapper.findAll('[data-test="ticket-status"]');
        expect(statusBadges.length).toBe(3);
        // Status text should be displayed (Open, In Progress, Closed)
        expect(statusBadges[0].text()).toContain('Open');
        expect(statusBadges[1].text()).toContain('In Progress');
        expect(statusBadges[2].text()).toContain('Closed');
    });

    it('calls getAll action on component mount', async () => {
        // Arrange
        ticketsRef.value = [];
        // Act
        mount(TicketOverview);
        await flushPromises();
        // Assert
        expect(mockActions.getAll).toHaveBeenCalledTimes(1);
    });

    it('shows filter controls', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        // Act
        const wrapper = mount(TicketOverview);
        await flushPromises();
        // Assert
        expect(wrapper.find('[data-test="filter-title-input"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="filter-status-select"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="filter-category-select"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="filter-creator-select"]').exists()).toBe(true); // Admin view
    });

    it('shows clear buttons when filters/sort are active', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Initially no clear buttons should be visible
        expect(wrapper.find('[data-test="clear-sort-btn"]').exists()).toBe(false);
        expect(wrapper.find('[data-test="clear-filters-btn"]').exists()).toBe(false);

        // After sorting, clear sort button should appear
        await wrapper.find('[data-test="sort-status-header"]').trigger('click');
        await flushPromises();
        expect(wrapper.find('[data-test="clear-sort-btn"]').exists()).toBe(true);

        // After filtering, clear filters button should appear
        const titleInput = wrapper.find('[data-test="filter-title-input"]');
        await titleInput.setValue('test');
        await flushPromises();
        expect(wrapper.find('[data-test="clear-filters-btn"]').exists()).toBe(true);
    });

    it('filters tickets by title search', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Act - filter by title
        const titleInput = wrapper.find('[data-test="filter-title-input"]');
        await titleInput.setValue('Login');
        await flushPromises();

        // Assert - should only show tickets with "Login" in title
        const ticketRows = wrapper.findAll('[data-test="ticket-row"]');
        expect(ticketRows.length).toBe(1);
        expect(ticketRows[0].text()).toContain('Login Issue');
    });

    it('shows filtered empty state message', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Act - filter with no matches
        const titleInput = wrapper.find('[data-test="filter-title-input"]');
        await titleInput.setValue('nonexistent');
        await flushPromises();

        // Assert
        const emptyState = wrapper.find('[data-test="ticket-empty-state"]');
        expect(emptyState.exists()).toBe(true);
        expect(emptyState.text()).toBe('No tickets match your current filters.');
    });

    it('filters tickets by status', async () => {
        // Arrange
        ticketsRef.value = mockTickets;
        const wrapper = mount(TicketOverview);
        await flushPromises();

        // Act - filter by closed status
        const statusSelect = wrapper.find('[data-test="filter-status-select"]');
        await statusSelect.setValue('0');
        await flushPromises();

        // Assert - should only show closed tickets
        const ticketRows = wrapper.findAll('[data-test="ticket-row"]');
        expect(ticketRows.length).toBe(1);
        expect(ticketRows[0].text()).toContain('Password Reset');

        // Act - filter by open status
        await statusSelect.setValue('1');
        await flushPromises();

        // Assert - should only show open tickets
        const openTicketRows = wrapper.findAll('[data-test="ticket-row"]');
        expect(openTicketRows.length).toBe(1);
        expect(openTicketRows[0].text()).toContain('Login Issue');
    });
});
