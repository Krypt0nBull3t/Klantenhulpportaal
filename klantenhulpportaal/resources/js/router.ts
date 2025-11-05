import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './App.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // Add more routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
