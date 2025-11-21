<template>
    <span :class="badgeClasses" :data-test="dataTest">
        <slot />
    </span>
</template>

<script setup lang="ts">
import {computed} from 'vue';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface Props {
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
    dataTest?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
    rounded: true,
});

const badgeClasses = computed(() => {
    const baseClasses = 'inline-flex items-center font-medium';

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
    };

    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-indigo-100 text-indigo-800',
    };

    const roundedClass = props.rounded ? 'rounded-full' : 'rounded';

    return [baseClasses, sizeClasses[props.size], variantClasses[props.variant], roundedClass]
        .filter(Boolean)
        .join(' ');
});
</script>
