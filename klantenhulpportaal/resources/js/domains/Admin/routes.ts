import {type RouteRecordRaw} from 'vue-router';
import AdminDashboard from './pages/AdminDashboard.vue';

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Admin Dashboard',
        },
    },
];
