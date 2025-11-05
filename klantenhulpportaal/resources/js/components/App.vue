<template>
  <div id="app">
    <header class="bg-blue-600 text-white p-4">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
    </header>
    
    <main class="container mx-auto mt-8 p-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Welcome to your Vue 3 + Laravel + TypeScript app!</h2>
        <p class="text-gray-600 mb-4">Count: {{ count }}</p>
        <button 
          @click="increment"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Increment
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref<string>('Klantenhulpportaal')
const count = ref<number>(0)

const increment = (): void => {
  count.value++
}
</script>

<style scoped>
/* Component-specific styles */
</style>