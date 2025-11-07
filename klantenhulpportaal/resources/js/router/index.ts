import { createRouter, createWebHistory } from 'vue-router';
import { ticketsRoutes } from '../domains/Tickets/routes';
import { landingRoutes } from '../domains/Landing/routes';

const router = createRouter({
    history: createWebHistory(),
    routes: [
    ...landingRoutes,
    ...ticketsRoutes
    ],
});

export default router;