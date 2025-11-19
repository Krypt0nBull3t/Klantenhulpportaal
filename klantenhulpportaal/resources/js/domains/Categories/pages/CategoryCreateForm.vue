<template>
    <form class="space-y-6" @submit.prevent="onSubmit">
        <ErrorMessage />

        <FormInput
            v-model="name"
            type="text"
            name="name"
            label="Category Name"
            data-test="category-name-input"
            aria-label="Category name"
            required
        />

        <BaseButton type="submit" full-width data-test="category-submit-btn" aria-label="Create category">
            Create
        </BaseButton>
    </form>
</template>

<script setup lang="ts">
import {ref, defineEmits} from 'vue';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import {FormInput, BaseButton} from '../../../components/ui';
import {categoryStore} from '../../Categories/store';
import {destroyErrors} from '../../../services/error';

const name = ref('');

const emit = defineEmits(['close']);

async function onSubmit() {
    destroyErrors();
    await categoryStore.actions.create({name: name.value});
    emit('close');
}
</script>
