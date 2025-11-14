import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import { ref, type Ref } from 'vue';
import type { User } from '../resources/js/types/auth';
import NavBar from '../resources/js/components/NavBar.vue';

// Mock the auth service
vi.mock('../resources/js/services/auth', () => ({
  isAuthenticated: ref(false),
  loggedInUser: ref(null),
  isAdmin: ref(false)
}));

// Mock LogoutButton component
vi.mock('../resources/js/components/LogoutButton.vue', () => ({
  default: {
    name: 'LogoutButton',
    template: '<button type="button" data-test="logout-button">Logout</button>'
  }
}));

// Import the mocked module to control it
import * as authService from '../resources/js/services/auth';

// Create router for the tests
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/tickets', component: { template: '<div>Tickets</div>' } },
    { path: '/admin', component: { template: '<div>Admin</div>' } },
    { path: '/help', component: { template: '<div>Help</div>' } }
  ]
});

describe('NavBar Component', () => {
  beforeEach(() => {
    // Reset auth state
    (authService.isAuthenticated as Ref<boolean>).value = false;
    (authService.loggedInUser as Ref<User | null>).value = null;
    (authService.isAdmin as Ref<boolean>).value = false;
  });

  describe('Non-authenticated users', () => {
    it('shows login, register, and help links for non-authenticated users', () => {
      // Arrange & Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      expect(wrapper.find('[data-test="navbar-login"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-register"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-help"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-welcome"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="navbar-tickets"]').exists()).toBe(false);
    });

    it('shows the correct link URLs for non-authenticated users', () => {
      // Arrange & Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      expect(wrapper.find('[data-test="navbar-login"]').attributes('href')).toBe('/login');
      expect(wrapper.find('[data-test="navbar-register"]').attributes('href')).toBe('/register');
      expect(wrapper.find('[data-test="navbar-help"]').attributes('href')).toBe('/help');
    });
  });

  describe('Authenticated regular users', () => {
    it('shows user-specific navigation for authenticated regular users', () => {
      // Arrange
      const regularUser: User = { id: 1, name: 'Regular User', email: 'user@example.com', is_admin: false };
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.loggedInUser as Ref<User | null>).value = regularUser;
      (authService.isAdmin as Ref<boolean>).value = false;

      // Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      expect(wrapper.find('[data-test="navbar-welcome"]').text()).toContain('Welcome, Regular User!');
      expect(wrapper.find('[data-test="navbar-tickets"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-tickets"]').text()).toBe('My Tickets');
      expect(wrapper.find('[data-test="navbar-help"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="logout-button"]').exists()).toBe(true);
      
      // Should not show admin links
      expect(wrapper.find('[data-test="navbar-admin-dashboard"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="navbar-admin-users"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="navbar-admin-categories"]').exists()).toBe(false);
      
      // Should not show login/register
      expect(wrapper.find('[data-test="navbar-login"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="navbar-register"]').exists()).toBe(false);
    });
  });

  describe('Authenticated admin users', () => {
    it('shows admin-specific navigation for authenticated admin users', () => {
      // Arrange
      const adminUser: User = { id: 1, name: 'Admin User', email: 'admin@example.com', is_admin: true };
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.loggedInUser as Ref<User | null>).value = adminUser;
      (authService.isAdmin as Ref<boolean>).value = true;

      // Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      expect(wrapper.find('[data-test="navbar-welcome"]').text()).toContain('Welcome, Admin User!');
      expect(wrapper.find('[data-test="navbar-tickets"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-tickets"]').text()).toBe('Tickets');
      expect(wrapper.find('[data-test="navbar-help"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="logout-button"]').exists()).toBe(true);
      
      // Should show admin links
      expect(wrapper.find('[data-test="navbar-admin-dashboard"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-admin-users"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="navbar-admin-categories"]').exists()).toBe(true);
      
      // Should not show login/register
      expect(wrapper.find('[data-test="navbar-login"]').exists()).toBe(false);
      expect(wrapper.find('[data-test="navbar-register"]').exists()).toBe(false);
    });

    it('has correct URLs for admin navigation links', () => {
      // Arrange
      const adminUser: User = { id: 1, name: 'Admin User', email: 'admin@example.com', is_admin: true };
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.loggedInUser as Ref<User | null>).value = adminUser;
      (authService.isAdmin as Ref<boolean>).value = true;

      // Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      expect(wrapper.find('[data-test="navbar-admin-dashboard"]').attributes('href')).toBe('/admin');
      expect(wrapper.find('[data-test="navbar-admin-users"]').attributes('href')).toBe('/admin/users');
      expect(wrapper.find('[data-test="navbar-admin-categories"]').attributes('href')).toBe('/admin/categories');
    });
  });

  describe('Logo and brand', () => {
    it('displays the logo/brand link correctly', () => {
      // Arrange & Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      const logoLink = wrapper.find('[data-test="navbar-logo"]');
      expect(logoLink.exists()).toBe(true);
      expect(logoLink.text()).toBe('Klantenhulpportaal');
      expect(logoLink.attributes('href')).toBe('/');
    });
  });

  describe('Smart tickets navigation', () => {
    it('shows "My Tickets" for regular users and "Tickets" for admins', () => {
      // Test regular user
      const regularUser: User = { id: 1, name: 'Regular User', email: 'user@example.com', is_admin: false };
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.loggedInUser as Ref<User | null>).value = regularUser;
      (authService.isAdmin as Ref<boolean>).value = false;

      const regularWrapper = mount(NavBar, { global: { plugins: [router] } });
      expect(regularWrapper.find('[data-test="navbar-tickets"]').text()).toBe('My Tickets');

      // Test admin user
      const adminUser: User = { id: 2, name: 'Admin User', email: 'admin@example.com', is_admin: true };
      (authService.loggedInUser as Ref<User | null>).value = adminUser;
      (authService.isAdmin as Ref<boolean>).value = true;

      const adminWrapper = mount(NavBar, { global: { plugins: [router] } });
      expect(adminWrapper.find('[data-test="navbar-tickets"]').text()).toBe('Tickets');
    });

    it('both user types navigate to the same tickets URL', () => {
      // Both regular users and admins should go to /tickets - the backend will handle showing appropriate tickets
      const user: User = { id: 1, name: 'User', email: 'user@example.com', is_admin: false };
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.loggedInUser as Ref<User | null>).value = user;
      (authService.isAdmin as Ref<boolean>).value = false;

      const wrapper = mount(NavBar, { global: { plugins: [router] } });
      expect(wrapper.find('[data-test="navbar-tickets"]').attributes('href')).toBe('/tickets');
    });
  });

  describe('Accessibility', () => {
    it('includes proper accessibility attributes', () => {
      // Arrange & Act
      const wrapper = mount(NavBar, { global: { plugins: [router] } });

      // Assert
      const nav = wrapper.find('nav');
      expect(nav.attributes('aria-label')).toBe('Main navigation');
      
      // All router-links should have role="link"
      const links = wrapper.findAll('a[role="link"]');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});