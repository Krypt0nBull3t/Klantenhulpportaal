import { createRouter, createWebHistory } from 'vue-router';
import { ticketsRoutes } from '../domains/Tickets/routes';
import { landingRoutes } from '../domains/Landing/routes';
import { authRoutes } from '../domains/Auth/routes';

const router = createRouter({
    history: createWebHistory(),
    routes: [
    ...landingRoutes,
    ...authRoutes,
    ...ticketsRoutes
    ],
});

export default router;