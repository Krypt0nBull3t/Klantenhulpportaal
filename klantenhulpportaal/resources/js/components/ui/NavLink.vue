<template>
    <component
        :is="to ? 'router-link' : 'a'"
        :to="to"
        :href="href"
        :class="linkClasses"
        :role="role || (to ? undefined : 'link')"
        :data-test="dataTest"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import {computed} from 'vue';

type NavLinkVariant = 'primary' | 'secondary' | 'admin' | 'plain';

interface Props {
    to?: string;
    href?: string;
    variant?: NavLinkVariant;
    active?: boolean;
    role?: string;
    dataTest?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    active: false,
});

const linkClasses = computed(() => {
    const baseClasses = 'transition-colors';

    const variantClasses = {
        primary: 'text-blue-600 hover:underline',
        secondary: 'text-gray-700 hover:text-gray-900',
        admin: 'text-purple-600 hover:underline font-semibold',
        plain: 'text-gray-900 hover:text-gray-600',
    };

    const activeClass = props.active ? 'font-semibold' : '';

    return [baseClasses, variantClasses[props.variant], activeClass].filter(Boolean).join(' ');
});
</script>
