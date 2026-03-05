import { navigateTo, routes } from './router.js';
import { auth, onAuthStateChanged } from '../firebase-config.js';

async function initApp() {
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
        if (user) navigateTo(routes.DASHBOARD);
        else navigateTo(routes.LOGIN);
    });

    // Handle initial route
    const hash = window.location.hash.replace('#', '');
    if (Object.values(routes).includes(hash)) {
        navigateTo(hash);
    } else {
        navigateTo(routes.LANDING);
    }
}

initApp();
