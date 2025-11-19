import {createRouter, createWebHistory} from 'vue-router';
import {ticketsRoutes} from '../domains/Tickets/routes';
import {landingRoutes} from '../domains/Landing/routes';
import {authRoutes} from '../domains/Auth/routes';
import {adminRoutes} from '../domains/Admin/routes';
import {categoryRoutes} from '../domains/Categories/routes';
import {isAuthenticated, isAdmin, fetchUser} from '../services/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [...landingRoutes, ...authRoutes, ...ticketsRoutes, ...adminRoutes, ...categoryRoutes],
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
    if (!authInitialized && to.meta.requiresAuth) {
        authInitialized = true;
        await fetchUser();
    }

    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }

    if (to.meta.requiresAdmin && !isAdmin.value) {
        return next('/');
    }

    if (to.meta.requiresGuest && isAuthenticated.value) {
        return next('/');
    }

    next();
});

export default router;
