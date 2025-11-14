import type { RouteRecordRaw } from 'vue-router';

const CategoryOverview = () => import('./pages/CategoryOverview.vue');

/**
 * @module categoryRoutes
 * @description Frontend routes for category management (admin-only)
 */
export const categoryRoutes: RouteRecordRaw[] = [
    {
        path: '/categories',
        name: 'CategoryOverview',
        component: CategoryOverview,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Categories Management'
        }
    }
];