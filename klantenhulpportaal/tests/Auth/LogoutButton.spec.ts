import { mount, flushPromises } from '@vue/test-utils';
import { vi, MockInstance } from 'vitest';
import LogoutButton from '../../resources/js/components/LogoutButton.vue';
import { logout } from '../../resources/js/services/auth';
import { createRouter, createWebHistory } from 'vue-router';
import { setMessage, destroyMessage, destroyErrors } from '../../resources/js/services/error';

vi.mock('../../resources/js/services/auth', () => ({
  logout: vi.fn(),
  isAuthenticated: { value: true },
  isAdmin: { value: false }
}));

describe('LogoutButton Component', () => {
    beforeEach(() => {
        destroyMessage();
        destroyErrors();
    });
  it('renders logout button with correct attributes', () => {
    // Arrange & Act
    const wrapper = mount(LogoutButton);
    const button = wrapper.find('[data-test="logout-button"]');
    // Assert
    expect(button.exists()).toBe(true);
    expect(button.attributes('aria-label')).toBe('Logout');
  });

  it('calls logout service when clicked', () => {
    // Arrange
    const wrapper = mount(LogoutButton);
    const button = wrapper.find('[data-test="logout-button"]');
    // Act
    button.trigger('click');
    // Assert
    expect(logout).toHaveBeenCalled();
  });

  it('redirects to landing page after successful logout', async () => {
    // Arrange
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {path: '/', component: { template: '<div>Landing</div>' } }
      ]
    });
    const wrapper = mount(LogoutButton, {
      global: {
        plugins: [router],
      }
    });
    (logout as unknown as MockInstance).mockResolvedValueOnce({});
    // Act
    await wrapper.find('[data-test="logout-button"]').trigger('click');
    await flushPromises();
    // Assert
    expect(router.currentRoute.value.path).toBe('/');
  });

  it('renders ErrorMessage component when a general error is present', async () => {
    // Arrange
    setMessage('Logout failed.');
    const wrapper = mount(LogoutButton);
    await flushPromises();

    // Act & Assert
    expect(wrapper.text()).toContain('Logout failed.');
  });

});

