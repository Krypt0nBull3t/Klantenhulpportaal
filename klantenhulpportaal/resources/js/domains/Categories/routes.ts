import type {RouteRecordRaw} from 'vue-router';
import CategoryOverview from './pages/CategoryOverview.vue';

export const categoryRoutes: RouteRecordRaw[] = [
    {
        path: '/categories',
        name: 'CategoryOverview',
        component: CategoryOverview,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Categories Management',
        },
    },
];
