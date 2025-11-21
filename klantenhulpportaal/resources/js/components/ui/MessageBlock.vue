<template>
  <div :class="blockClasses">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-900">
        <slot name="author" />
      </span>
      <span class="text-xs text-gray-500">
        <slot name="date" />
      </span>
    </div>
    <p class="text-sm text-gray-700 whitespace-pre-wrap">
      <slot />
    </p>
  </div>
</template>
<script setup lang="ts">
import {computed} from 'vue';
const props = defineProps<{ type: 'reply' | 'note' }>();
const blockClasses = computed(() => {
  if (props.type === 'reply') {
    return 'bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400';
  }
  if (props.type === 'note') {
    return 'bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400';
  }
  return 'bg-gray-50 rounded-lg p-4';
});
</script>
