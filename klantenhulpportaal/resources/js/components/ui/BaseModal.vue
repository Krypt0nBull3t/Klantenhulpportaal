<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white/20"
            @click.self="handleBackdropClick"
        >
            <div
                :class="modalClasses"
                role="dialog"
                :aria-labelledby="title ? 'modal-title' : undefined"
                aria-modal="true"
            >
                <button
                    v-if="showClose"
                    class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl z-10"
                    aria-label="Close modal"
                    @click="handleClose"
                >
                    &times;
                </button>

                <div v-if="title" class="mb-6">
                    <h2 id="modal-title" class="text-xl font-bold text-gray-900">
                        {{ title }}
                    </h2>
                    <p v-if="subtitle" class="mt-2 text-gray-600">{{ subtitle }}</p>
                </div>

                <div :class="contentClasses">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="mt-6 flex justify-end space-x-3">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import {computed} from 'vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
    show: boolean;
    title?: string;
    subtitle?: string;
    size?: ModalSize;
    showClose?: boolean;
    closeOnBackdrop?: boolean;
    maxHeight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
    showClose: true,
    closeOnBackdrop: true,
    maxHeight: true,
});

const emit = defineEmits<{
    close: [];
}>();

const modalClasses = computed(() => {
    const baseClasses = 'bg-white rounded-lg shadow-lg p-8 relative';

    const sizeClasses = {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-2xl',
        lg: 'w-full max-w-4xl',
        xl: 'w-full max-w-6xl',
        full: 'w-[95vw] h-[95vh]',
    };

    const heightClass = props.maxHeight && props.size !== 'full' ? 'max-h-[90vh] overflow-y-auto' : '';

    return [baseClasses, sizeClasses[props.size], heightClass].filter(Boolean).join(' ');
});

const contentClasses = computed(() => {
    return props.size === 'full' ? 'h-full overflow-y-auto' : '';
});

const handleClose = (): void => {
    emit('close');
};

const handleBackdropClick = (): void => {
    if (props.closeOnBackdrop) {
        emit('close');
    }
};
</script>
