<template>
    <div :class="containerClasses">
        <select
            :value="modelValue"
            :data-test="dataTest"
            :class="selectClasses"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <slot />
        </select>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
    modelValue: string | number;
    dataTest?: string;
    size?: 'sm' | 'md' | 'lg';
    minWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    minWidth: 'min-w-32',
});

defineEmits<{
    'update:modelValue': [value: string | number];
}>();

const containerClasses = computed(() => {
    return props.minWidth;
});

const selectClasses = computed(() => {
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
