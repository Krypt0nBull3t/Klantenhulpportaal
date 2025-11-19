<template>
    <div class="overflow-hidden">
        <EmptyState v-if="!data.length" v-bind="emptyStateProps">
            <template v-if="$slots['empty-icon']" #icon>
                <slot name="empty-icon" />
            </template>
            <template v-if="$slots['empty-actions']" #actions>
                <slot name="empty-actions" />
            </template>
            <slot v-if="$slots['empty-content']" name="empty-content" />
        </EmptyState>

        <div v-else class="overflow-x-auto -mx-6">
            <div class="inline-block min-w-full py-2 align-middle">
                <table :data-test="dataTest" class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <slot name="header" :handleSort="handleSort" :getSortIcon="getSortIcon" />
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="(item, index) in data"
                            :key="getRowKey ? getRowKey(item, index) : index"
                            :data-test="rowDataTest"
                            class="hover:bg-gray-50"
                        >
                            <slot name="row" :item="item" :index="index" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T = Record<string, unknown>">
import {computed} from 'vue';
import EmptyState from './EmptyState.vue';

export interface SortConfig {
    field: string | null;
    direction: 'asc' | 'desc';
}

interface Props {
    data: T[];
    sortConfig?: SortConfig;
    dataTest?: string;
    rowDataTest?: string;
    getRowKey?: (item: T, index: number) => string | number;
    emptyTitle?: string;
    emptyMessage?: string;
    emptyIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    dataTest: 'data-table',
    rowDataTest: 'table-row',
    emptyTitle: 'No data found',
    emptyMessage: 'There are no items to display.',
    emptyIcon: true,
});

const emit = defineEmits<{
    sort: [field: string];
}>();

const emptyStateProps = computed(() => ({
    title: props.emptyTitle,
    message: props.emptyMessage,
    icon: props.emptyIcon,
}));

const handleSort = (field: string): void => {
    emit('sort', field);
};

const getSortIcon = (field: string): string => {
    if (!props.sortConfig || props.sortConfig.field !== field) {
        return '↕️';
    }
    return props.sortConfig.direction === 'asc' ? '↑' : '↓';
};
</script>
