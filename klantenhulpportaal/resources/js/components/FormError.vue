<template>
    <div
        v-for="error in getErrorByProperty(name).value"
        :key="error"
        class="mt-1 text-sm text-red-600"
        data-test="form-error"
    >
        {{ error }}
    </div>
</template>

<script setup lang="ts">
import {getErrorByProperty} from '../services/error';

defineProps<{name: string}>();
</script>
