<template>
    <button
        :type="type"
        :class="buttonClasses"
        :disabled="disabled"
        :data-test="dataTest"
        :aria-label="ariaLabel"
        @click="$emit('click', $event)"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
import {computed} from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    fullWidth?: boolean;
    dataTest?: string;
    ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    fullWidth: false,
});

defineEmits<{
    click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
    const baseClasses =
        'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
        primary: 'text-white bg-blue-600 border border-transparent hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
        danger: 'text-white bg-red-600 border border-transparent hover:bg-red-700 focus:ring-red-500',
        ghost: 'text-gray-600 bg-transparent border border-transparent hover:bg-gray-50 focus:ring-blue-500',
        link: 'text-blue-600 bg-transparent border-none hover:text-blue-900 focus:ring-blue-500 underline-offset-4 hover:underline px-0',
    };

    const widthClass = props.fullWidth ? 'w-full flex justify-center' : '';

    return [baseClasses, sizeClasses[props.size], variantClasses[props.variant], widthClass].filter(Boolean).join(' ');
});
</script>
