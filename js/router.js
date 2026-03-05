import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../firebase-config.js';

export const routes = {
    LANDING: 'landing',
    LOGIN: 'login',
    REGISTER: 'register',
    DASHBOARD: 'dashboard'
};

const viewContainer = document.getElementById('view-container');

export async function navigateTo(view) {
    const user = auth.currentUser;

    // Route Protection
    if (view === routes.DASHBOARD && !user) {
        return navigateTo(routes.LOGIN);
    }
    if ((view === routes.LOGIN || view === routes.REGISTER) && user) {
        return navigateTo(routes.DASHBOARD);
    }

    renderView(view);
}

function renderView(view) {
    window.location.hash = view;

    switch (view) {
        case routes.LOGIN:
            viewContainer.innerHTML = getLoginHTML();
            initLoginLogic();
            break;
        case routes.REGISTER:
            viewContainer.innerHTML = getRegisterHTML();
            initRegisterLogic();
            break;
        case routes.DASHBOARD:
            viewContainer.innerHTML = getDashboardHTML();
            initDashboardLogic();
            break;
        default:
            viewContainer.innerHTML = getLandingHTML();
            initLandingLogic();
    }
}

// HTML Templates (Minimal versions for now)
function getLoginHTML() {
    return `
        <div class="auth-page">
            <div class="auth-card">
                <h2>Welcome Back</h2>
                <form id="login-form">
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="login-email" required placeholder="name@email.com">
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="login-password" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-auth">Sign In</button>
                </form>
                <p>Don't have an account? <a href="#register" class="toggle-auth">Sign Up</a></p>
            </div>
        </div>
    `;
}

function getRegisterHTML() {
    return `
        <div class="auth-page">
            <div class="auth-card">
                <h2>Create Account</h2>
                <form id="register-form">
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="register-email" required placeholder="name@email.com">
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="register-password" required placeholder="••••••••">
                    </div>
                    <div class="input-group">
                        <label>Confirm Password</label>
                        <input type="password" id="register-confirm" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn-auth">Register</button>
                </form>
                <p>Already have an account? <a href="#login" class="toggle-auth">Sign In</a></p>
            </div>
        </div>
    `;
}

function getDashboardHTML() {
    return `
        <div class="dashboard-page">
            <nav class="dash-nav">
                <span class="logo">EASYCRYPTO</span>
                <button id="logout-btn">Logout</button>
            </nav>
            <div class="container dash-content">
                <h1>Dashboard</h1>
                <div class="wallet-grid">
                    <div class="wallet-card">
                        <h3>Spot Wallet</h3>
                        <div id="spot-balances" class="balance-list">Loading...</div>
                    </div>
                    <div class="wallet-card">
                        <h3>Funding Wallet</h3>
                        <div id="funding-balances" class="balance-list">Loading...</div>
                    </div>
                </div>
                <div class="dash-actions">
                    <button class="btn-secondary">Transfer Funds</button>
                    <button class="btn-primary">Go to Trade</button>
                </div>
            </div>
        </div>
    `;
}

function getLandingHTML() {
    return `<h1>Landing Page</h1><p><a href="#login">Login</a> | <a href="#register">Register</a></p>`;
}

// Module placeholder logic (will be implemented in separate files or below)
function initLoginLogic() {
    const form = document.getElementById('login-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigateTo(routes.DASHBOARD);
        } catch (error) {
            alert(error.message);
        }
    };
    document.querySelector('.toggle-auth').onclick = (e) => { e.preventDefault(); navigateTo(routes.REGISTER); };
}

function initRegisterLogic() {
    const form = document.getElementById('register-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        if (password !== confirm) return alert("Passwords don't match");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Check your email for confirmation!");
        } catch (error) {
            alert(error.message);
        }
    };
    document.querySelector('.toggle-auth').onclick = (e) => { e.preventDefault(); navigateTo(routes.LOGIN); };
}

async function initDashboardLogic() {
    document.getElementById('logout-btn').onclick = async () => {
        await signOut(auth);
        navigateTo(routes.LOGIN);
    };

    const user = auth.currentUser;

    // Placeholder until Firestore structure is defined
    if (user) {
        document.getElementById('spot-balances').innerHTML = 'No funds';
        document.getElementById('funding-balances').innerHTML = 'No funds';
    }
}

function initLandingLogic() {
    // Basic landing page logic
}
