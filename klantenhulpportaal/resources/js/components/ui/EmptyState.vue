<template>
    <div class="text-center py-8 px-6 text-gray-500">
        <div v-if="icon" class="mb-4">
            <div class="mx-auto h-12 w-12 text-gray-400">
                <slot name="icon">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </slot>
            </div>
        </div>

        <h3 v-if="title" class="text-lg font-medium text-gray-900 mb-2">
            {{ title }}
        </h3>

        <p class="text-sm text-gray-500 mb-4">
            <slot>
                {{ message }}
            </slot>
        </p>

        <div v-if="$slots.actions" class="mt-4">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string;
    message?: string;
    icon?: boolean;
}

withDefaults(defineProps<Props>(), {
    icon: true,
    message: 'No items found.',
});
</script>
