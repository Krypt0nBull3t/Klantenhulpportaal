/**
 * @file CategoryEditForm.spec.ts
 * @description Tests for the CategoryEditForm component (TDD, AAA pattern)
 * Follows copilot-instructions.md conventions.
 */

import {mount, flushPromises} from '@vue/test-utils';
import {vi} from 'vitest';
import CategoryEditForm from '../../resources/js/domains/Categories/pages/CategoryEditForm.vue';
import {setErrorBag, destroyErrors, destroyMessage} from '../../resources/js/services/error';

// Mock the categoryStore module
vi.mock('../../resources/js/domains/Categories/store', () => {
    let mockActions: {update: ReturnType<typeof vi.fn>};

    return {
        categoryStore: {
            get actions() {
                return mockActions || (mockActions = {update: vi.fn().mockResolvedValue(undefined)});
            },
        },
    };
});

import {categoryStore} from '../../resources/js/domains/Categories/store';

const category = {id: 1, name: 'Original Category'};

describe('CategoryEditForm', () => {
    beforeEach(() => {
        // Arrange: Reset mocks and error state
        vi.clearAllMocks();
        const updateMock = categoryStore.actions.update as ReturnType<typeof vi.fn>;
        updateMock.mockResolvedValue(undefined);
        destroyMessage();
        destroyErrors();
    });
    it('renders with existing category data', () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        const inputEl = wrapper.find('input#category-name').element as HTMLInputElement;
        // Assert
        expect(inputEl.value).toBe('Original Category');
    });

    it('submits updated category name', async () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('input#category-name').setValue('Updated Category');
        await wrapper.find('form').trigger('submit.prevent');
        // Assert
        expect(categoryStore.actions.update).toHaveBeenCalledWith(1, {name: 'Updated Category'});
    });

    it('shows validation errors from backend', async () => {
        // Arrange
        const updateMock = categoryStore.actions.update as ReturnType<typeof vi.fn>;
        updateMock.mockImplementation(() => {
            // Simulate the error handling that would normally happen in Axios interceptors
            setErrorBag({name: ['Name is required']});
            // In real app, Axios interceptor handles the error and the store action would resolve
            return Promise.resolve();
        });
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('input#category-name').setValue('Updated Category');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();
        // Assert
        expect(wrapper.text()).toContain('Name is required');
    });

    it('emits close event on successful update', async () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('input#category-name').setValue('Updated Category');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();
        // Assert
        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('cancels edit and emits close event', async () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('[data-test="cancel-btn"]').trigger('click');
        // Assert
        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('does not submit if name is unchanged', async () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('form').trigger('submit.prevent');
        // Assert
        expect(categoryStore.actions.update).not.toHaveBeenCalled();
    });

    it('handles rapid submit/cancel edge case', async () => {
        // Arrange
        const wrapper = mount(CategoryEditForm, {
            props: {category},
        });
        // Act
        await wrapper.find('input#category-name').setValue('Updated Category');
        await wrapper.find('form').trigger('submit.prevent');
        await wrapper.find('[data-test="cancel-btn"]').trigger('click');
        // Assert
        const closeEvents = wrapper.emitted('close') || [];
        expect(closeEvents.length).toBeGreaterThanOrEqual(1);
    });
});
