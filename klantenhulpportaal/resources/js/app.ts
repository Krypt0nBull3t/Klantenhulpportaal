import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { fetchUser } from './services/auth';

/**
 * Initialize the Vue application with authentication state restoration
 */
async function initializeApp() {
  const app = createApp(App);
  app.use(router);
  
  // Restore user authentication state from server session/cookie
  // This prevents users from appearing logged out on page refresh (F5)
  // 401 errors are handled silently by the HTTP interceptor
  await fetchUser();
  
  app.mount('#app');
}

// Start the application
initializeApp();
