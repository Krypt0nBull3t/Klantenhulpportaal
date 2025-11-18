import TicketOverview from "./pages/TicketOverview.vue";

export const ticketsRoutes = [
    {
        path: '/tickets', 
        component: TicketOverview, 
        name: 'TicketsOverview',
        meta: { requiresAuth: true }
    },
];