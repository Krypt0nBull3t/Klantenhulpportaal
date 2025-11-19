<template>
    <PageContainer>
        <ErrorMessage v-if="!activeModal" data-test="error-message" />

        <div class="mb-6">
            <h1 data-test="category-overview-title" class="text-3xl font-bold text-gray-900 mb-2">
                Categories Management
            </h1>
            <p class="text-gray-600">Manage ticket categories for the support portal</p>
        </div>

        <BaseCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600">Manage your support categories</p>
                    <BaseButton data-test="add-category-btn" aria-label="Add category" @click="openModal('create')">
                        Add Category
                    </BaseButton>
                </div>
            </template>

            <EmptyState
                v-if="!categories.value.length"
                title="No categories found"
                message="Get started by creating your first category."
                data-test="category-empty-state"
            >
                <template #actions>
                    <BaseButton @click="openModal('create')">Add Category</BaseButton>
                </template>
            </EmptyState>

            <ul v-else data-test="category-list" class="divide-y divide-gray-200">
                <li
                    v-for="category in categories.value"
                    :key="category.id"
                    data-test="category-row"
                    class="py-4 flex items-center justify-between"
                >
                    <div>
                        <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
                        <p class="text-sm text-gray-500">ID: {{ category.id }}</p>
                    </div>
                    <ActionGroup>
                        <BaseButton
                            variant="link"
                            data-test="edit-category-btn"
                            aria-label="Edit category"
                            @click="openModal('edit', category)"
                        >
                            Edit
                        </BaseButton>
                        <BaseButton
                            variant="link"
                            data-test="delete-category-btn"
                            aria-label="Delete category"
                            @click="deleteCategory(category.id)"
                        >
                            Delete
                        </BaseButton>
                    </ActionGroup>
                </li>
            </ul>
        </BaseCard>

        <BaseModal
            :show="!!activeModal"
            :title="activeModal === 'create' ? 'Create Category' : 'Edit Category'"
            size="sm"
            @close="closeModal"
        >
            <CategoryCreateForm v-if="activeModal === 'create'" @close="closeModal" />
            <CategoryEditForm
                v-else-if="activeModal === 'edit' && selectedCategory"
                :category="selectedCategory"
                @close="closeModal"
            />
        </BaseModal>
    </PageContainer>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {categoryStore} from '../store';
import {Category} from '../types';
import {destroyErrors, destroyMessage} from '../../../services/error';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {PageContainer, BaseCard, BaseButton, BaseModal, EmptyState, ActionGroup} from '../../../components/ui';
import CategoryCreateForm from './CategoryCreateForm.vue';
import CategoryEditForm from './CategoryEditForm.vue';

const categories = computed(() => categoryStore.getters.all);
const activeModal = ref<'create' | 'edit' | null>(null);
const selectedCategory = ref<Category | null>(null);

async function deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
        await categoryStore.actions.delete(id);
    }
}

function openModal(type: 'create' | 'edit', category?: Category) {
    activeModal.value = type;
    selectedCategory.value = category || null;
}

function closeModal() {
    activeModal.value = null;
    selectedCategory.value = null;
    destroyErrors();
    destroyMessage();
}

categoryStore.actions.getAll();
</script>

<style scoped></style>
