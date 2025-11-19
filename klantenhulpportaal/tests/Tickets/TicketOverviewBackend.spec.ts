/**
 * @file TicketOverviewBackend.spec.ts
 * @description Backend integration test for TicketOverview automatic backend connection
 * @module TicketOverviewBackendTest
 */

import {mount, flushPromises} from '@vue/test-utils';
import {ref, computed} from 'vue';
import TicketOverview from '../../resources/js/domains/Tickets/pages/TicketOverview.vue';
import {ticketStore} from '../../resources/js/domains/Tickets/store';
import {destroyMessage, destroyErrors} from '../../resources/js/services/error';

// Mock auth service as admin
vi.mock('../../resources/js/services/auth', () => ({
    isAdmin: {value: true},
}));

// Mock the store
vi.mock('../../resources/js/domains/Tickets/store', () => {
    const mockTickets = ref([]);
    return {
        ticketStore: {
            getters: {
                all: computed(() => mockTickets.value),
            },
            actions: {
                getAll: vi.fn(),
                delete: vi.fn(),
                create: vi.fn(),
                update: vi.fn(),
            },
            // Expose the ref so we can manipulate it in tests
            _mockTickets: mockTickets,
        },
    };
});

// Mock categories store
vi.mock('../../resources/js/domains/Categories/store', () => ({
    categoryStore: {
        actions: {
            getAll: vi.fn(),
        },
        getters: {
            all: computed(() => [
                {id: 1, name: 'Technical'},
                {id: 2, name: 'General'},
            ]),
        },
    },
}));

// Mock users store
vi.mock('../../resources/js/domains/Users/store', () => ({
    userStore: {
        actions: {
            getAll: vi.fn(),
        },
        getters: {
            all: computed(() => [
                {id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false},
                {id: 2, name: 'Jane Smith', email: 'jane@example.com', is_admin: true},
            ]),
        },
    },
}));

// Mock router
const mockRouter = {
    push: vi.fn(),
};

describe('TicketOverview Automatic Backend Connection', () => {
    beforeEach(() => {
        destroyMessage();
        destroyErrors();
        vi.clearAllMocks();
        (ticketStore as any)._mockTickets.value = [];
    });

    it('should automatically load tickets when component is created', async () => {
        // Arrange
        const mockTickets = [
            {
                id: 1,
                title: 'Login Issue',
                content: 'Cannot login',
                status: '1',
                user_id: 1,
                category_id: 1,
                created_at: '2025-11-18T10:00:00Z',
                updated_at: '2025-11-18T10:00:00Z',
                creator: {id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false},
                category: {id: 1, name: 'Technical'},
            },
        ];

        // Act - mount component which should trigger getAll
        mount(TicketOverview, {
            global: {
                mocks: {
                    $router: mockRouter,
                },
            },
        });
        await flushPromises();

        // Assert
        expect(ticketStore.actions.getAll).toHaveBeenCalledTimes(1);
    });

    it('should display fetched tickets from the store', async () => {
        // Arrange
        const mockTickets = [
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
                content: 'Need new feature',
                status: '2',
                user_id: 2,
                category_id: 2,
                created_at: '2025-11-18T11:00:00Z',
                updated_at: '2025-11-18T11:00:00Z',
                creator: {id: 2, name: 'Jane Smith', email: 'jane@example.com', is_admin: true},
                category: {id: 2, name: 'General'},
            },
        ];

        // Set tickets in mock store
        (ticketStore as any)._mockTickets.value = mockTickets;

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
        const ticketRows = wrapper.findAll('[data-test="ticket-row"]');
        expect(ticketRows).toHaveLength(2);
        expect(ticketRows[0].text()).toContain('Login Issue');
        expect(ticketRows[0].text()).toContain('John Doe');
        expect(ticketRows[1].text()).toContain('Feature Request');
        expect(ticketRows[1].text()).toContain('Jane Smith');
    });
});
