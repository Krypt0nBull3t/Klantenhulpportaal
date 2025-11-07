import { render } from '@testing-library/vue';
import LandingPage from '../resources/js/domains/Landing/pages/LandingPage.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/register', component: { template: '<div>Register</div>' } },
    { path: '/help', component: { template: '<div>Help</div>' } },
  ],
});

describe('LandingPage', () => {
  it('renders portal name and description', async () => {
    // Arrange
    const { getByRole, getByText } = render(LandingPage, { global: { plugins: [router] } });

    // Act
    const heading = getByRole('heading', { name: /klantenhulpportaal/i });
    const description = getByText(/customer support portal/i);

    // Assert
    expect(heading).toBeDefined();
    expect(description).toBeDefined();
  });

  it('shows navigation links', async () => {
    // Arrange
    const { getByRole } = render(LandingPage, { global: { plugins: [router] } });

    // Act & Assert
    expect(getByRole('link', { name: /login/i })).toBeDefined();
    expect(getByRole('link', { name: /register/i })).toBeDefined();
    expect(getByRole('link', { name: /help/i })).toBeDefined();
  });

  it('has accessible ARIA labels', async () => {
    // Arrange
    const { getByLabelText } = render(LandingPage, { global: { plugins: [router] } });

    // Act
    const nav = getByLabelText(/main navigation/i);

    // Assert
    expect(nav).toBeDefined();
  });
});