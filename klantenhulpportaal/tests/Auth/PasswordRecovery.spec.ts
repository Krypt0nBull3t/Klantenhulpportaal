import PasswordRecovery from '../../resources/js/domains/Auth/pages/PasswordRecovery.vue';
import {setMessage, setErrorBag, destroyErrors, destroyMessage} from '../../resources/js/services/error';
import {mount, flushPromises} from '@vue/test-utils';
import {vi} from 'vitest';
import {sendPasswordResetLink} from '../../resources/js/services/auth';

// Mock the auth service
vi.mock('../../resources/js/services/auth', () => ({
    sendPasswordResetLink: vi.fn(),
    isAuthenticated: {value: false},
    isAdmin: {value: false},
}));

describe('PasswordRecovery UI', () => {
    beforeEach(() => {
        destroyMessage();
        destroyErrors();
    });

    it('renders the password recovery form with required fields, data-test, and accessibility attributes', () => {
        // Arrange
        const wrapper = mount(PasswordRecovery);
        // Act
        const emailInput = wrapper.find('[data-test="recovery-email"]');
        const submitButton = wrapper.find('[data-test="recovery-submit"]');
        // Assert
        expect(emailInput.exists()).toBe(true);
        expect(emailInput.attributes('type')).toBe('email');
        expect(emailInput.attributes('aria-label')).toBe('Email');
        expect(submitButton.exists()).toBe(true);
        expect(submitButton.attributes('type')).toBe('submit');
        expect(submitButton.attributes('aria-label')).toBe('Recover Password');
    });

    it('calls recoverPassword service with correct email when the form is submitted', async () => {
        // Arrange
        const wrapper = mount(PasswordRecovery);
        // Act
        await wrapper.find('[data-test="recovery-email"]').setValue('user@example.com');
        await wrapper.find('form').trigger('submit.prevent');
        await flushPromises();
        // Assert
        expect(sendPasswordResetLink).toHaveBeenCalledWith('user@example.com');
    });

    it('renders ErrorMessage component when a general error is present', async () => {
        // Arrange
        setMessage('An error occurred during password recovery.');
        const wrapper = mount(PasswordRecovery);
        // Act
        await flushPromises();
        // Assert
        expect(wrapper.findComponent({name: 'ErrorMessage'}).exists()).toBe(true);
    });

    it('renders FormError component when validation errors are present', async () => {
        // Arrange
        setErrorBag({email: ['The email field is required.']});
        const wrapper = mount(PasswordRecovery);
        // Act
        await flushPromises();
        // Assert
        expect(wrapper.findComponent({name: 'FormError'}).exists()).toBe(true);
    });
});
