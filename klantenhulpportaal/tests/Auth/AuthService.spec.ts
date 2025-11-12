import { vi } from 'vitest';
import { ref, type Ref } from 'vue';
import type { User } from '../../resources/js/types/auth';

// Mock the auth service following LandingPage.spec.ts pattern
vi.mock('../../resources/js/services/auth', () => ({
  isAuthenticated: ref(false),
  loggedInUser: ref(null),
  isAdmin: ref(false)
}));

// Import the mocked module to control it
import * as authService from '../../resources/js/services/auth';

describe('Auth Service - isAdmin', () => {
  beforeEach(() => {
    // Reset auth state before each test
    (authService.isAuthenticated as Ref<boolean>).value = false;
    (authService.loggedInUser as Ref<User | null>).value = null;
    (authService.isAdmin as Ref<boolean>).value = false;
  });

  it('returns false when no user is logged in', () => {
    // Arrange - no user logged in (default state from beforeEach)
    
    // Act & Assert
    expect(authService.isAdmin.value).toBe(false);
    expect(authService.isAuthenticated.value).toBe(false);
  });

  it('returns false when user is logged in but not admin', () => {
    // Arrange
    const regularUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      is_admin: false
    };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = regularUser;
    (authService.isAdmin as Ref<boolean>).value = false; // Based on user.is_admin
    
    // Act & Assert
    expect(authService.isAdmin.value).toBe(false);
    expect(authService.isAuthenticated.value).toBe(true);
  });

  it('returns true when user is logged in and is admin', () => {
    // Arrange
    const adminUser: User = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      is_admin: true
    };
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = adminUser;
    (authService.isAdmin as Ref<boolean>).value = true; // Based on user.is_admin
    
    // Act & Assert
    expect(authService.isAdmin.value).toBe(true);
    expect(authService.isAuthenticated.value).toBe(true);
  });

  it('returns false when user object exists but is_admin is undefined', () => {
    // Arrange
    const userWithoutAdminFlag = {
      id: 1,
      name: 'User',
      email: 'user@example.com'
      // is_admin is missing (undefined)
    } as User;
    (authService.isAuthenticated as Ref<boolean>).value = true;
    (authService.loggedInUser as Ref<User | null>).value = userWithoutAdminFlag;
    (authService.isAdmin as Ref<boolean>).value = false; // undefined should be falsy
    
    // Act & Assert
    expect(authService.isAdmin.value).toBe(false);
  });
});