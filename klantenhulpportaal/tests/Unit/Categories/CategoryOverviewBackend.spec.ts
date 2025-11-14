/**
 * @file CategoryOverviewBackend.spec.ts
 * @description TDD test for CategoryOverview automatic backend connection
 */

import { mount, flushPromises } from '@vue/test-utils';
import { ref, computed } from 'vue';
import CategoryOverview from '../../../resources/js/domains/Categories/pages/CategoryOverview.vue';
import { categoryStore } from '../../../resources/js/domains/Categories/store';
import { destroyErrors } from '../../../resources/js/services/error';

// Mock the store
vi.mock('../../../resources/js/domains/Categories/store', () => {
  const mockCategories = ref([]);
  return {
    categoryStore: {
      getters: {
        all: computed(() => mockCategories.value)
      },
      actions: {
        getAll: vi.fn(),
        delete: vi.fn()
      },
      // Expose the ref so we can manipulate it in tests
      _mockCategories: mockCategories
    }
  };
});

// Mock ErrorMessage component
vi.mock('../../../resources/js/components/ErrorMessage.vue', () => ({
  default: {
    name: 'ErrorMessage',
    template: '<div data-test="category-error"></div>'
  }
}));

describe('CategoryOverview Automatic Backend Connection', () => {
  beforeEach(() => {
    destroyErrors();
    vi.clearAllMocks();
    (categoryStore as any)._mockCategories.value = [];
  });

  it('should automatically load categories when component is created', async () => {
    // Arrange
    const mockCategories = [
      { id: 1, name: 'Technical' },
      { id: 2, name: 'Billing' }
    ];
    
    vi.mocked(categoryStore.actions.getAll).mockResolvedValue(undefined);

    // Act
    mount(CategoryOverview);
    await flushPromises();

    // Update store to simulate successful load
    (categoryStore as any)._mockCategories.value = mockCategories;

    // Assert
    expect(categoryStore.actions.getAll).toHaveBeenCalledOnce();
  });

  it('should display categories after automatic loading', async () => {
    // Arrange
    const mockCategories = [
      { id: 1, name: 'Technical' },
      { id: 2, name: 'Billing' }
    ];
    
    // Set up data before mounting
    (categoryStore as any)._mockCategories.value = mockCategories;
    vi.mocked(categoryStore.actions.getAll).mockResolvedValue(undefined);

    // Act
    const wrapper = mount(CategoryOverview);
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.find('[data-test="category-list"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-test="category-row"]')).toHaveLength(2);
  });

  it('should show empty state when no categories exist after loading', async () => {
    // Arrange
    vi.mocked(categoryStore.actions.getAll).mockResolvedValue(undefined);
    (categoryStore as any)._mockCategories.value = [];

    // Act
    const wrapper = mount(CategoryOverview);
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.find('[data-test="category-empty-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="category-list"]').exists()).toBe(false);
  });

  it('should delete category when delete button is clicked', async () => {
    // Arrange
    const mockCategories = [{ id: 1, name: 'Technical' }];
    (categoryStore as any)._mockCategories.value = mockCategories;
    vi.mocked(categoryStore.actions.delete).mockResolvedValue(undefined);
    window.confirm = vi.fn().mockReturnValue(true);

    // Act
    const wrapper = mount(CategoryOverview);
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    const deleteBtn = wrapper.find('[data-test="delete-category-btn"]');
    expect(deleteBtn.exists()).toBe(true); // Verify button exists first
    await deleteBtn.trigger('click');

    // Assert
    expect(categoryStore.actions.delete).toHaveBeenCalledWith(1);
  });
});