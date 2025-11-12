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

  it('has accessible ARIA labels', () => {
    // Arrange
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.find('[aria-label="Main navigation"]').exists()).toBe(true);
  });

  it('shows login/register links when user is not authenticated', () => {
    // Arrange
    (authService.isAuthenticated as Ref<boolean>).value = false;
    (authService.loggedInUser as Ref<User | null>).value = null;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.text()).toContain('Login');
    expect(wrapper.text()).toContain('Register');
    expect(wrapper.find('[data-test="logout-button"]').exists()).toBe(false);
  });

  it('shows user name and logout button when authenticated', () => {
    // Arrange
    const testUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = testUser;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.find('[data-test="logout-button"]').exists()).toBe(true);
  });

  it('hides login/register links when user is authenticated', () => {
    // Arrange
    const testUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', is_admin: false };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = testUser;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert  
    expect(wrapper.text()).not.toContain('Login');
    expect(wrapper.text()).not.toContain('Register');
  });

  it('shows admin dashboard link for admin users', () => {
    // Arrange
    const adminUser: User = { id: 1, name: 'Admin User', email: 'admin@example.com', is_admin: true };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = adminUser;
    (authService.isAdmin as Ref<boolean>).value = true;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.text()).toContain('Admin Dashboard');
    const adminLink = wrapper.find('a[href="/admin"]');
    expect(adminLink.exists()).toBe(true);
  });

  it('hides admin dashboard link for non-admin users', () => {
    // Arrange
    const regularUser: User = { id: 1, name: 'Regular User', email: 'user@example.com', is_admin: false };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = regularUser;
    (authService.isAdmin as Ref<boolean>).value = false;
    const wrapper = mount(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(wrapper.text()).not.toContain('Admin Dashboard');
    const adminLink = wrapper.find('a[href="/admin"]');
    expect(adminLink.exists()).toBe(false);
  });
});