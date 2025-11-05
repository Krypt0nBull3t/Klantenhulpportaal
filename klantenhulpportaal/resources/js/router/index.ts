import { createRouter, createWebHistory } from 'vue-router';
import { ticketsRoutes } from '../domains/Tickets/routes';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...ticketsRoutes
    ],
});

export default router;