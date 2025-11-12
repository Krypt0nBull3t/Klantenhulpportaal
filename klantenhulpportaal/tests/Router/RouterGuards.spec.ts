import { vi } from 'vitest';
import { ref, type Ref } from 'vue';

// Mock the auth service before importing the router
vi.mock('../../resources/js/services/auth', () => ({
  isAuthenticated: ref(false),
  isAdmin: ref(false)
}));

// Import the mocked auth service to control it
import * as authService from '../../resources/js/services/auth';

// Import the ACTUAL router with guards
import router from '../../resources/js/router';

describe('Actual Router Guards Integration', () => {
  beforeEach(async () => {
    // Reset auth state
    (authService.isAuthenticated as Ref<boolean>).value = false;
    (authService.isAdmin as Ref<boolean>).value = false;
    
    // Reset router to home page
    await router.push('/');
  });

  describe('Auth Routes (requiresGuest)', () => {
    it('allows unauthenticated users to access login page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = false;
      
      // Act
      await router.push('/login');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('redirects authenticated users away from login page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/login');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('redirects authenticated users away from register page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/register');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('redirects authenticated users away from password recovery page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/password/email');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });
  });

  describe('Protected Routes (requiresAuth)', () => {
    it('redirects unauthenticated users to login from tickets page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = false;
      
      // Act
      await router.push('/tickets');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows authenticated users to access tickets page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/tickets');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/tickets');
    });
  });

  describe('Public Routes', () => {
    it('allows unauthenticated users to access landing page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = false;
      
      // Act
      await router.push('/');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('allows authenticated users to access landing page', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });
  });

  describe('Admin-Only Routes (requiresAdmin)', () => {
    it('redirects non-admin authenticated users away from admin routes', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.isAdmin as Ref<boolean>).value = false;
      
      // Act - try to access the real admin dashboard route
      await router.push('/admin');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/');
    });

    it('allows admin users to access admin routes', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      (authService.isAdmin as Ref<boolean>).value = true;
      
      // Act - access the real admin dashboard route
      await router.push('/admin');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/admin');
    });

    it('redirects unauthenticated users to login for admin routes', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = false;
      (authService.isAdmin as Ref<boolean>).value = false;
      
      // Act - try to access admin route while unauthenticated
      await router.push('/admin');
      
      // Assert - should redirect to login due to requiresAuth check happening first
      expect(router.currentRoute.value.path).toBe('/login');
    });
  });

  describe('Authentication Flow', () => {
    it('redirects unauthenticated user to login when accessing protected route', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = false;
      
      // Act
      await router.push('/tickets');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/login');
    });

    it('allows access to protected route after authentication', async () => {
      // Arrange
      (authService.isAuthenticated as Ref<boolean>).value = true;
      
      // Act
      await router.push('/tickets');
      
      // Assert
      expect(router.currentRoute.value.path).toBe('/tickets');
    });
  });
});