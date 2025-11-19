<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />

        <main class="flex-1">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>
