<template>
    <div :class="groupClasses">
        <slot />
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

type ActionGroupAlign = 'left' | 'center' | 'right';
type ActionGroupDirection = 'horizontal' | 'vertical';

interface Props {
    align?: ActionGroupAlign;
    direction?: ActionGroupDirection;
    spacing?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
    align: 'left',
    direction: 'horizontal',
    spacing: 'md',
});

const groupClasses = computed(() => {
    const baseClasses = 'flex';

    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    };

    const directionClasses = {
        horizontal: 'flex-row',
        vertical: 'flex-col',
    };

    const spacingClasses = {
        sm: props.direction === 'horizontal' ? 'space-x-2' : 'space-y-2',
        md: props.direction === 'horizontal' ? 'space-x-3' : 'space-y-3',
        lg: props.direction === 'horizontal' ? 'space-x-4' : 'space-y-4',
    };

    return [
        baseClasses,
        alignClasses[props.align],
        directionClasses[props.direction],
        spacingClasses[props.spacing],
    ].join(' ');
});
</script>
