import { render, fireEvent } from '@testing-library/vue';
import LoginPage from '../resources/js/domains/Auth/pages/LoginPage.vue';

describe('LoginPage', () => {
  it('renders login form with email and password fields', async () => {
    const { getByLabelText, getByRole } = render(LoginPage);
    expect(getByLabelText(/email/i)).toBeDefined();
    expect(getByLabelText(/password/i)).toBeDefined();
    expect(getByRole('button', { name: /login/i })).toBeDefined();
  });

  it('shows error message on invalid submit', async () => {
    const { getByRole, findByText } = render(LoginPage);
    await fireEvent.click(getByRole('button', { name: /login/i }));
    expect(await findByText(/please enter your email and password/i)).toBeDefined();
  });
});
