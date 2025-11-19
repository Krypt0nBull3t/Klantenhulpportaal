<template>
    <div v-if="getMessage" class="mb-4 p-4 border border-red-300 rounded-md bg-red-50" data-test="error-message">
        <div class="text-red-800 font-medium">
            {{ getMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {getMessage} from '../services/error';
</script>
