<template>
    <div v-if="getMessage" class="error-container">
        <div class="error-message">
            {{ getMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {getMessage} from '../services/error';
</script>

<style scoped>
.error-container {
    margin: 1rem 0;
    padding: 1rem;
    border: 1px solid #e53e3e;
    border-radius: 4px;
    background-color: #fff5f5;
    color: #e53e3e;
}

.error-message {
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.error-list {
    margin: 0;
    padding-left: 1.5rem;
}

.error-item {
    margin: 0.25rem 0;
}
</style>