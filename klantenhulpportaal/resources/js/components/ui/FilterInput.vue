<template>
    <div :class="containerClasses">
        <input
            :value="modelValue"
            :type="type"
            :placeholder="placeholder"
            :data-test="dataTest"
            :class="inputClasses"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
    modelValue: string;
    type?: 'text' | 'search';
    placeholder?: string;
    dataTest?: string;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    minWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    size: 'md',
    fullWidth: false,
});

defineEmits<{
    'update:modelValue': [value: string];
}>();

const containerClasses = computed(() => {
    const baseClasses = props.fullWidth ? 'flex-1' : '';
    const minWidthClass = props.minWidth || (props.fullWidth ? 'min-w-64' : 'min-w-32');

    return [baseClasses, minWidthClass].filter(Boolean).join(' ');
});

const inputClasses = computed(() => {
    const baseClasses =
        'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500';

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return [baseClasses, sizeClasses[props.size]].join(' ');
});
</script>
