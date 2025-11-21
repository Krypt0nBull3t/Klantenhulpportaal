<template>
    <div class="mb-4">
        <label v-if="label" :for="id || name" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
        </label>

        <input
            v-if="type !== 'textarea' && type !== 'select'"
            :id="id || name"
            :name="name"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            :data-test="dataTest"
            :aria-label="ariaLabel || label"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"
            :class="[
                type === 'email' || type === 'password' ? 'appearance-none relative focus:z-10 sm:text-sm' : '',
                error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
            ]"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />

        <select
            v-else-if="type === 'select'"
            :id="id || name"
            :name="name"
            :value="modelValue"
            :data-test="dataTest"
            :aria-label="ariaLabel || label"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            :class="error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <option v-if="placeholder" value="">{{ placeholder }}</option>
            <slot />
        </select>

        <textarea
            v-else-if="type === 'textarea'"
            :id="id || name"
            :name="name"
            :value="modelValue"
            :placeholder="placeholder"
            :rows="rows || 4"
            :data-test="dataTest"
            :aria-label="ariaLabel || label"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-gray-900"
            :class="error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        ></textarea>

        <FormError v-if="name" :name="name" />
    </div>
</template>

<script setup lang="ts">
import FormError from '../FormError.vue';

interface Props {
    type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number';
    modelValue?: string | number;
    name: string;
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    autocomplete?: string;
    dataTest?: string;
    ariaLabel?: string;
    rows?: number;
    error?: boolean;
}

defineProps<Props>();

defineEmits<{
    'update:modelValue': [value: string | number];
}>();
</script>
