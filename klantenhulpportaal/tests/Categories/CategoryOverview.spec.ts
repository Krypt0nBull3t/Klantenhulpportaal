/**
 * @file CategoryOverview.spec.ts
 * @description Vitest test for CategoryOverview.vue using categoryStore
 * @module CategoryOverviewTest
 */



import { mount, flushPromises } from '@vue/test-utils'
import CategoryOverview from '../../resources/js/domains/Categories/pages/CategoryOverview.vue'
import { ref, computed } from 'vue'
import { Category } from '../../resources/js/domains/Categories/types'
import { destroyMessage, destroyErrors, setMessage } from '../../resources/js/services/error'

let categoriesRef: ReturnType<typeof ref<Category[]>>
let mockActions: {
  getAll: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
  create: ReturnType<typeof vi.fn>
}

vi.mock('../../resources/js/domains/Categories/store', () => ({
  categoryStore: {
    get actions() {
      return mockActions
    },
    get getters() {
      // Match the component: computed ref
      return { all: computed(() => categoriesRef.value) }
    }
  }
}))


const mockCategories: Category[] = [
  { id: 1, name: 'Algemeen' },
  { id: 2, name: 'Technisch' }
]


describe('CategoryOverview.vue', () => {
  beforeEach(() => {
    categoriesRef = ref<Category[]>([])
    mockActions = {
      getAll: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    }
    // Reset error messages
    destroyMessage()
    destroyErrors()
    vi.clearAllMocks()
    // Mock window.confirm to return true for all tests
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: vi.fn().mockReturnValue(true)
    })
  })

  it('fetches and displays categories from the backend API', async () => {
    // Arrange
    categoriesRef.value = [
      { id: 1, name: 'Algemeen' },
      { id: 2, name: 'Technisch' }
    ];
    // Act
    const wrapper = mount(CategoryOverview);
    await flushPromises();
    // Assert
    const rows = wrapper.findAll('[data-test="category-row"]');
    expect(rows.length).toBe(categoriesRef.value.length);
    expect(rows[0].text()).toContain('Algemeen');
    expect(rows[1].text()).toContain('Technisch');
  });


  it('renders all categories in the overview when present', async () => {
    // Arrange
    categoriesRef.value = mockCategories
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Assert
    const rows = wrapper.findAll('[data-test="category-row"]')
    expect(rows.length).toBe(categoriesRef.value.length)
    expect(rows[0].text()).toContain('Algemeen')
    expect(rows[1].text()).toContain('Technisch')
  })


  it('shows empty state when no categories exist', async () => {
    // Arrange
    categoriesRef.value = []
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Assert
    const emptyState = wrapper.find('[data-test="category-empty-state"]')
    expect(emptyState.exists()).toBe(true)
  })


  it('handles delete of non-existent category gracefully', async () => {
    // Arrange
    categoriesRef.value = []
    mockActions.delete = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Act
    const deleteBtns = wrapper.findAll('[data-test="delete-category-btn"]')
    if (deleteBtns.length > 0) {
      await deleteBtns[0].trigger('click')
    }
    // Assert
    expect(mockActions.delete).not.toHaveBeenCalled()
  })


    it('calls delete action when delete button is clicked', async () => {
    // Arrange
    categoriesRef.value = mockCategories
    mockActions.delete = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Act
    await wrapper.findAll('[data-test="delete-category-btn"]')[0].trigger('click')
    await flushPromises()
    // Assert
    expect(mockActions.delete).toHaveBeenCalledWith(1)
    })

  it('displays error message when one is set in error service', async () => {
    // Arrange - simulate error state (e.g., from previous failed operation)
    categoriesRef.value = mockCategories
    setMessage('Delete failed') // Simulate Axios interceptor setting error message
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Assert - ErrorMessage component should display the error
    const errorMsg = wrapper.find('[data-test="error-message"]')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('Delete failed')
    })


  it('has add category button', async () => {
    // Arrange
    mockActions.getAll.mockResolvedValue(undefined)
    categoriesRef.value = mockCategories
    // Act
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Assert
    const addBtn = wrapper.find('[data-test="add-category-btn"]')
    expect(addBtn.exists()).toBe(true)
    expect(addBtn.text()).toContain('Add Category')
})
})