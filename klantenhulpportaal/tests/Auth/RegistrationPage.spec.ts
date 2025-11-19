import {mount, flushPromises} from '@vue/test-utils';
import {vi, MockInstance} from 'vitest';
import {createRouter, createWebHistory} from 'vue-router';
import RegistrationPage from '../../resources/js/domains/Auth/pages/RegistrationPage.vue';
import {register} from '../../resources/js/services/auth';
import {destroyMessage, destroyErrors, setMessage, setErrorBag} from '../../resources/js/services/error';

// Mock the auth service
vi.mock('../../resources/js/services/auth', () => ({
    register: vi.fn(),
    isAuthenticated: {value: false},
    isAdmin: {value: false},
}));

describe('RegistrationPage UI', () => {
    beforeEach(() => {
        destroyMessage();
        destroyErrors();
    });

    it('renders the registration form with required fields, data-test, and accessibility attributes', () => {
        // Arrange
        const wrapper = mount(RegistrationPage);

        // Act
        const nameInput = wrapper.find('[data-test="register-name"]');
        const emailInput = wrapper.find('[data-test="register-email"]');
        const passwordInput = wrapper.find('[data-test="register-password"]');
        const confirmInput = wrapper.find('[data-test="register-password-confirmation"]');
        const submitButton = wrapper.find('[data-test="register-submit"]');

        // Assert
        expect(nameInput.exists()).toBe(true);
        expect(nameInput.attributes('type')).toBe('text');
        expect(nameInput.attributes('aria-label')).toBe('Name');

        expect(emailInput.exists()).toBe(true);
        expect(emailInput.attributes('type')).toBe('email');
        expect(emailInput.attributes('aria-label')).toBe('Email');

        expect(passwordInput.exists()).toBe(true);
        expect(passwordInput.attributes('type')).toBe('password');
        expect(passwordInput.attributes('aria-label')).toBe('Password');

        expect(confirmInput.exists()).toBe(true);
        expect(confirmInput.attributes('type')).toBe('password');
        expect(confirmInput.attributes('aria-label')).toBe('Confirm Password');

        expect(submitButton.exists()).toBe(true);
        expect(submitButton.attributes('type')).toBe('submit');
        expect(submitButton.attributes('aria-label')).toBe('Register');

        // Assert ErrorMessage and FormError components
        expect(wrapper.findComponent({name: 'ErrorMessage'}).exists()).toBe(true);
        expect(wrapper.findComponent({name: 'FormError'}).exists()).toBe(true);
    });

    it('calls register service with correct data when the form is submitted', async () => {
        // Arrange
        const wrapper = mount(RegistrationPage);

        // Act
        await wrapper.find('[data-test="register-name"]').setValue('Test User');
        await wrapper.find('[data-test="register-email"]').setValue('test@example.com');
        await wrapper.find('[data-test="register-password"]').setValue('password123');
        await wrapper.find('[data-test="register-password-confirmation"]').setValue('password123');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        // Assert
        expect(register).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123',
        });
    });
    it('redirects to login after successful registration', async () => {
        // Arrange
        const router = createRouter({
            history: createWebHistory(),
            routes: [
                {path: '/register', component: RegistrationPage},
                {path: '/login', component: {template: '<div>Login</div>'}},
            ],
        });
        (register as unknown as MockInstance).mockResolvedValueOnce({});
        const wrapper = mount(RegistrationPage, {global: {plugins: [router]}});
        await wrapper.find('[data-test="register-name"]').setValue('Test User');
        await wrapper.find('[data-test="register-email"]').setValue('test@example.com');
        await wrapper.find('[data-test="register-password"]').setValue('password123');
        await wrapper.find('[data-test="register-password-confirmation"]').setValue('password123');

        // Act
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();

        // Assert
        expect(router.currentRoute.value.path).toBe('/login');
    });

    it('shows error messages when registration fails due to backend validation', async () => {
        // Arrange
        setMessage('De ingevoerde gegevens zijn niet juist');
        setErrorBag({
            email: ['Invalid email format'],
            password: ['Password is too short'],
        });
        const wrapper = mount(RegistrationPage);
        await flushPromises();

        // Act & Assert
        expect(wrapper.findComponent({name: 'ErrorMessage'}).exists()).toBe(true);
        expect(wrapper.findComponent({name: 'FormError'}).exists()).toBe(true);
        expect(wrapper.text()).toContain('De ingevoerde gegevens zijn niet juist');
        expect(wrapper.text()).toContain('Invalid email format');
        expect(wrapper.text()).toContain('Password is too short');
    });
});
