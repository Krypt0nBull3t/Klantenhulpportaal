import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { ref, type Ref } from 'vue';
import type { User } from '../resources/js/types/auth';
import LandingPage from '../resources/js/domains/Landing/pages/LandingPage.vue';

// Mock the auth service
vi.mock('../resources/js/services/auth', () => ({
  isAuthenticated: ref(false),
  loggedInUser: ref(null),
  isAdmin: ref(false)
}));

// Import the mocked module to control it
import * as authService from '../resources/js/services/auth';

// Mock LogoutButton component
vi.mock('../resources/js/components/LogoutButton.vue', () => ({
  default: {
    name: 'LogoutButton',
    template: '<button type="button" data-test="logout-button">Logout</button>'
  }
}));

// Create router for the tests
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/help', component: { template: '<div>Help</div>' } }
  ]
});

describe('LandingPage', () => {
  beforeEach(() => {
    // Reset auth state before each test
    (authService.isAuthenticated as Ref<boolean>).value = false;
    (authService.loggedInUser as Ref<User | null>).value = null;
    (authService.isAdmin as Ref<boolean>).value = false;
  });

  it('renders portal name and description', () => {
    // Arrange
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.text()).toContain('Klantenhulpportaal');
    expect(wrapper.text()).toContain('Customer Support Portal');
  });

  it('shows call-to-action buttons for non-authenticated users', () => {
    // Arrange
    (authService.isAuthenticated as Ref<boolean>).value = false;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.find('[data-test="landing-register-cta"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="landing-login-cta"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="landing-tickets-cta"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="landing-admin-cta"]').exists()).toBe(false);
  });

  it('shows tickets CTA for authenticated regular users', () => {
    // Arrange
    const testUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = testUser;
    (authService.isAdmin as Ref<boolean>).value = false;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.find('[data-test="landing-tickets-cta"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="landing-register-cta"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="landing-login-cta"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="landing-admin-cta"]').exists()).toBe(false);
  });

  it('shows admin and tickets CTAs for admin users', () => {
    // Arrange
    const adminUser: User = { id: 1, name: 'Admin User', email: 'admin@example.com', is_admin: true };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = adminUser;
    (authService.isAdmin as Ref<boolean>).value = true;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.find('[data-test="landing-admin-cta"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="landing-tickets-cta"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="landing-register-cta"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="landing-login-cta"]').exists()).toBe(false);
  });

  it('has correct CTA button links', () => {
    // Arrange - Test for non-authenticated user CTAs
    (authService.isAuthenticated as Ref<boolean>).value = false;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.find('[data-test="landing-register-cta"]').attributes('href')).toBe('/register');
    expect(wrapper.find('[data-test="landing-login-cta"]').attributes('href')).toBe('/login');
  });
});