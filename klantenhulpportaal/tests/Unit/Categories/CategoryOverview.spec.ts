/**
 * @file CategoryOverview.spec.ts
 * @description Vitest test for CategoryOverview.vue using categoryStore
 * @module CategoryOverviewTest
 */


import { mount, flushPromises } from '@vue/test-utils'
import CategoryOverview from '../../../resources/js/domains/Categories/pages/CategoryOverview.vue'
import { ref } from 'vue'
import { Category } from '../../../resources/js/domains/Categories/types'

let categoriesRef: ReturnType<typeof ref<Category[]>>
let mockActions: any

vi.mock('../../../resources/js/domains/Categories/store', () => ({
  categoryStore: {
    get actions() {
      return mockActions
    },
    get getters() {
      return { all: categoriesRef }
    }
  }
}))

const mockCategories: Category[] = [
  { id: 1, name: 'Algemeen' },
  { id: 2, name: 'Technisch' }
]

describe('CategoryOverview.vue', () => {
  it('fetches and displays categories from the backend API', async () => {
    // Arrange: mock Axios GET to /api/categories
    const apiCategories = [
      { id: 1, name: 'Algemeen' },
      { id: 2, name: 'Technisch' }
    ];
    vi.mock('axios', () => ({
      default: {
        get: vi.fn().mockResolvedValue({ data: apiCategories })
      }
    }));
    // Act
    const wrapper = mount(CategoryOverview);
    await flushPromises();
    // Assert
    const rows = wrapper.findAll('[data-test="category-row"]');
    expect(rows.length).toBe(apiCategories.length);
    expect(rows[0].text()).toContain('Algemeen');
    expect(rows[1].text()).toContain('Technisch');
  });

  beforeEach(() => {
    categoriesRef = ref<Category[]>([])
    mockActions = {
      getAll: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      create: vi.fn()
    }
  })

  it('renders all categories in the overview when present', async () => {
    // Arrange
    categoriesRef.value = mockCategories
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Assert
    const rows = wrapper.findAll('[data-test="category-row"]')
    expect(rows.length).toBe(mockCategories.length)
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


  it('shows error message if delete action fails', async () => {
    // Arrange
    categoriesRef.value = mockCategories
    mockActions.delete = vi.fn().mockRejectedValue(new Error('Delete failed'))
    const wrapper = mount(CategoryOverview)
    await flushPromises()
    // Act
    await wrapper.findAll('[data-test="delete-category-btn"]')[0].trigger('click')
    await flushPromises()
    // Assert
  const errorMsg = wrapper.find('[data-test="category-error"]')
  expect(errorMsg.exists()).toBe(true)
  // Optionally check for error content if ErrorMessage is mocked to show it
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
    expect(addBtn.text()).toContain('Categorie toevoegen')
  })
})
