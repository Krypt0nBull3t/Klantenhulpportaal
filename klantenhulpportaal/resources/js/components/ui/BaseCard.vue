<template>
    <div :class="cardClasses">
        <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
            <slot name="header">
                <h2 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
            </slot>
        </div>

        <div v-if="$slots.default" :class="contentClasses">
            <slot />
        </div>

        <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

type CardVariant = 'default' | 'bordered' | 'elevated';

interface Props {
    variant?: CardVariant;
    title?: string;
    subtitle?: string;
    noPadding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    noPadding: false,
});

const cardClasses = computed(() => {
    const baseClasses = 'bg-white rounded-lg overflow-hidden';

    const variantClasses = {
        default: 'shadow',
        bordered: 'border border-gray-200',
        elevated: 'shadow-lg',
    };

    return [baseClasses, variantClasses[props.variant]].filter(Boolean).join(' ');
});

const contentClasses = computed(() => {
    return props.noPadding ? '' : 'px-6 py-4';
});
</script>
