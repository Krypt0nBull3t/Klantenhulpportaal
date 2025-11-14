import { createRouter, createWebHistory } from 'vue-router';
import { ticketsRoutes } from '../domains/Tickets/routes';
import { landingRoutes } from '../domains/Landing/routes';
import { authRoutes } from '../domains/Auth/routes';
import { adminRoutes } from '../domains/Admin/routes';
import { categoryRoutes } from '../domains/Categories/routes';
import { isAuthenticated, isAdmin, fetchUser } from '../services/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...landingRoutes,
        ...authRoutes,
        ...ticketsRoutes,
        ...adminRoutes,
        ...categoryRoutes
    ],
});

// Track if we've attempted to restore auth state
let authInitialized = false;

/**
 * Global navigation guard for route protection
 * Handles authentication and authorization checks
 */
router.beforeEach(async (to, from, next) => {
    // On first navigation, ensure we've tried to restore authentication state
    if (!authInitialized && to.meta.requiresAuth) {
        authInitialized = true;
        try {
            await fetchUser();
        } catch (error) {
            // If fetchUser fails, user is not authenticated, continue with normal flow
        }
    }
    
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