// tests/Auth/LoginPage.spec.ts
import { mount, flushPromises } from '@vue/test-utils';
import { vi } from 'vitest';
import LoginPage from '../../resources/js/domains/Auth/pages/LoginPage.vue';
import { setMessage, setErrorBag, destroyMessage, destroyErrors } from '../../resources/js/services/error';
import { createRouter, createWebHistory } from 'vue-router';

// Mock the auth service
vi.mock('../../resources/js/services/auth', () => ({
  login: vi.fn(),
}));

/**
 * LoginPage UI
 *
 * This test verifies that the LoginPage component renders a login form with:
 * - An email input field (data-test, type, aria-label)
 * - A password input field (data-test, type, aria-label)
 * - A submit button (data-test, type, aria-label)
 * - ErrorMessage component for general errors
 * - FormError component for field-specific errors
 *
 * The test follows the AAA (Arrange, Act, Assert) pattern.
 */
describe('LoginPage UI', () => {
  beforeEach(() => {
    destroyMessage();
    destroyErrors();
  });

  it('renders the login form with required fields, data-test, and accessibility attributes', () => {
    // Arrange
    const wrapper = mount(LoginPage);

    // Act
    const emailInput = wrapper.find('[data-test="login-email"]');
    const passwordInput = wrapper.find('[data-test="login-password"]');
    const submitButton = wrapper.find('[data-test="login-submit"]');

    // Assert
    expect(emailInput.exists()).toBe(true);
    expect(emailInput.attributes('type')).toBe('email');
    expect(emailInput.attributes('aria-label')).toBe('Email');

    expect(passwordInput.exists()).toBe(true);
    expect(passwordInput.attributes('type')).toBe('password');
    expect(passwordInput.attributes('aria-label')).toBe('Password');

    expect(submitButton.exists()).toBe(true);
    expect(submitButton.attributes('type')).toBe('submit');
    expect(submitButton.attributes('aria-label')).toBe('Login');
  });

  it('calls login service with correct credentials when the form is submitted', async () => {
    // Arrange
    const { login } = await import('../../resources/js/services/auth');
    const wrapper = mount(LoginPage);

    // Act
    await wrapper.find('[data-test="login-email"]').setValue('user@example.com');
    await wrapper.find('[data-test="login-password"]').setValue('secret123');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    // Assert
    expect(login).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123'
    });
  });

  it('renders ErrorMessage component when a general error is present', async () => {
    // Arrange
    setMessage('Invalid credentials');
    const wrapper = mount(LoginPage);
    await flushPromises();

    // Act & Assert
    expect(wrapper.text()).toContain('Invalid credentials');
  });

  it('renders FormError component for invalid email format', async () => {
    // Arrange
    setErrorBag({ email: ['Invalid email format'] });
    const wrapper = mount(LoginPage);
    await flushPromises();

    // Act
    const emailErrors = wrapper.findAll('.form-error');

    // Assert
    expect(emailErrors.length).toBeGreaterThan(0);
    expect(emailErrors[0].text()).toContain('Invalid email format');
  });

  it('renders FormError component for short password', async () => {
    // Arrange
    setErrorBag({ password: ['Password is too short'] });
    const wrapper = mount(LoginPage);
    await flushPromises();

    // Act
    const passwordErrors = wrapper.findAll('.form-error');

    // Assert
    expect(passwordErrors.length).toBeGreaterThan(0);
    expect(passwordErrors[0].text()).toContain('Password is too short');
  });

  it('shows a Register link that routes to /register', async () => {
    // Arrange
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/login', component: LoginPage },
        { path: '/register', component: { template: '<div>Register</div>' } }
      ]
    });
    const wrapper = mount(LoginPage, { global: { plugins: [router] } });

  // Act
  const registerLink = wrapper.findComponent({ name: 'RouterLink' });

  // Assert
  expect(registerLink.exists()).toBe(true);
  expect(registerLink.props('to')).toBe('/register');
  });
});
