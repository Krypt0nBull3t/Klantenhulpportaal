<template>
    <div v-for="error in getErrorByProperty(name).value" :key="error" class="form-error">
        {{ error }}
    </div>
</template>

<script setup lang="ts">
import {getErrorByProperty} from '../services/error';

defineProps<{name: string}>();
</script>

<style scoped>
.form-error {
    color: #e53e3e;
    font-size: 0.95em;
    margin-top: 0.25rem;
}
</style>