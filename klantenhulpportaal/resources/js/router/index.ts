import { createRouter, createWebHistory } from 'vue-router';
import { ticketsRoutes } from '../domains/Tickets/routes';
import { landingRoutes } from '../domains/Landing/routes';
import { authRoutes } from '../domains/Auth/routes';
import { adminRoutes } from '../domains/Admin/routes';
import { isAuthenticated, isAdmin } from '../services/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...landingRoutes,
        ...authRoutes,
        ...ticketsRoutes,
        ...adminRoutes
    ],
});

/**
 * Global navigation guard for route protection
 * Handles authentication and authorization checks
 */
router.beforeEach((to, from, next) => {
    // Check if route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        return next('/login');
    }
    
    // Check if route requires admin privileges
    // Silently redirect non-admins - they shouldn't see these routes anyway
    if (to.meta.requiresAdmin && !isAdmin.value) {
        return next('/');
    }
    
    // Redirect authenticated users away from guest-only pages (login, register, etc)
    if (to.meta.requiresGuest && isAuthenticated.value) {
        return next('/');
    }
    
    // Allow navigation
    next();
});

export default router;