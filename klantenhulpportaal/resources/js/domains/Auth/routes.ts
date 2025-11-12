import LoginPage from './pages/LoginPage.vue';
import RegistrationPage from './pages/RegistrationPage.vue';
import PasswordRecovery from './pages/PasswordRecovery.vue';

export const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegistrationPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/password/email',
    name: 'Password Recovery',
    component: PasswordRecovery,
    meta: { requiresGuest: true }
  }
];