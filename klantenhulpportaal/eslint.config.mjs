import {defineConfig} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default defineConfig([
    {
        files: ['**/*.js', '**/*.ts', '**/*.vue'],
        extends: [js.configs.recommended],
    },
    {
        files: ['**/*.ts', '**/*.vue'],
        extends: [ts.configs.recommended],
    },
    {
        files: ['**/*.vue'],
        extends: [vue.configs['flat/essential']],
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                defineEmits: 'readonly',
                defineProps: 'readonly',
                withDefaults: 'readonly',
            },
            parser: vueParser,
            parserOptions: {
                parser: ts.parser,
                extraFileExtensions: ['.vue'],
                ecmaFeatures: {jsx: true},
            },
        },
    },
]);