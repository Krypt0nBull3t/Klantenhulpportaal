import {createApp} from 'vue';
import App from './App.vue';
import router from './router';

/**
 * Initialize the Vue application
 * Authentication state restoration is handled by the router guard
 */
function initializeApp() {
    const app = createApp(App);
    app.use(router);
    app.mount('#app');
}

// Start the application
initializeApp();
