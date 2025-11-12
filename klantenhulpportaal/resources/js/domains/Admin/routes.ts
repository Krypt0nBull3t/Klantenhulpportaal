import { type RouteRecordRaw } from 'vue-router';

// Lazy load admin components for better performance
const AdminDashboard = () => import('./pages/AdminDashboard.vue');

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Admin Dashboard'
        }
    }
];