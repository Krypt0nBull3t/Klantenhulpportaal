import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
        reporter: ['text', 'json', 'html'],
        },
        setupFiles: ['./tests/setup.ts'],
    },
});
