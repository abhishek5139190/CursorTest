// Main App Controller and Routing

const App = {
    currentScreen: null,
    screens: {},

    // Initialize the app
    init() {
        try {
            // Initialize state
            if (typeof AppState === 'undefined') {
                console.error('AppState is not defined. Make sure state.js is loaded.');
                return;
            }
            AppState.init();

            // Register all screens
            this.registerScreens();

            // Set up routing
            this.setupRouting();

            // Load initial screen
            this.navigateToInitialScreen();
        } catch (error) {
            console.error('Error initializing app:', error);
            // Show error message to user
            const app = document.getElementById('app');
            if (app) {
                app.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <h2>Error Loading App</h2>
                        <p>${error.message}</p>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">Please check the browser console for more details.</p>
                    </div>
                `;
            }
        }
    },

    // Register all screen modules
    registerScreens() {
        const requiredScreens = {
            onboarding: OnboardingScreen,
            dashboard: DashboardScreen,
            sleep: SleepScreen,
            steps: StepsScreen,
            stress: StressScreen,
            water: WaterScreen,
            checkin: CheckinScreen,
            loading: LoadingScreen,
            results: ResultsScreen
        };

        // Check if all screens are defined
        const missingScreens = [];
        for (const [name, screen] of Object.entries(requiredScreens)) {
            if (typeof screen === 'undefined') {
                missingScreens.push(name);
            }
        }

        if (missingScreens.length > 0) {
            console.error('Missing screen modules:', missingScreens);
        }

        this.screens = requiredScreens;
    },

    // Set up hash-based routing
    setupRouting() {
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // Handle initial route after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.handleRoute();
        }, 50);
    },

    // Handle route changes
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'onboarding';
        const screenName = hash.split('?')[0];
        const params = this.parseParams(hash);

        if (this.screens[screenName]) {
            this.showScreen(screenName, params);
        } else {
            this.showScreen('onboarding');
        }
    },

    // Parse URL parameters
    parseParams(hash) {
        const params = {};
        const queryString = hash.split('?')[1];
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                params[key] = decodeURIComponent(value);
            });
        }
        return params;
    },

    // Show a specific screen
    showScreen(screenName, params = {}) {
        console.log('Showing screen:', screenName);
        
        // Get or create the screen element FIRST (before hiding others)
        let screenElement = document.querySelector(`.${screenName}-screen`);
        
        if (!screenElement) {
            // Create screen element if it doesn't exist
            const app = document.getElementById('app');
            if (app) {
                screenElement = document.createElement('div');
                screenElement.className = `screen ${screenName}-screen`;
                app.appendChild(screenElement);
                console.log('Created new screen element:', screenName);
            }
        }

        // Hide all OTHER screens (but not the one we're about to show)
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(screen => {
            if (screen !== screenElement) {
                screen.classList.remove('active');
                screen.style.display = 'none';
            }
        });

        // Hide/destroy current screen if different
        if (this.currentScreen && this.currentScreen !== screenName && this.screens[this.currentScreen] && this.screens[this.currentScreen].destroy) {
            this.screens[this.currentScreen].destroy();
        }

        // Set new current screen
        this.currentScreen = screenName;

        // Initialize screen (this will render content into the screen element)
        if (screenElement && this.screens[screenName] && this.screens[screenName].init) {
            this.screens[screenName].init(params);
            console.log('Screen initialized, content length:', screenElement.innerHTML.length);
        } else {
            console.error('Screen not found or element not created:', screenName, 'Available screens:', Object.keys(this.screens));
        }

        // Show the screen after initialization
        if (screenElement) {
            screenElement.classList.add('active');
            screenElement.style.display = 'block';
            screenElement.style.visibility = 'visible';
            screenElement.style.opacity = '1';
            console.log('Screen element activated:', screenName, 'Final content length:', screenElement.innerHTML.length);
        } else {
            console.error(`Screen element not found for: ${screenName}`);
        }

        // Update URL hash (without triggering hashchange)
        if (window.location.hash.slice(1) !== screenName) {
            window.location.hash = screenName;
        }

        // Update navigation active state
        if (screenName === 'dashboard' && typeof Navigation !== 'undefined') {
            Navigation.setActive('dashboard');
        }
    },

    // Navigate to a screen
    navigate(screenName, params = {}) {
        let hash = screenName;
        if (Object.keys(params).length > 0) {
            const queryString = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
            hash = `${screenName}?${queryString}`;
        }
        window.location.hash = hash;
    },

    // Navigate to initial screen based on state
    navigateToInitialScreen() {
        // Check if there's already a hash in the URL
        const currentHash = window.location.hash.slice(1);
        if (currentHash && this.screens[currentHash.split('?')[0]]) {
            // Use the hash from URL
            this.handleRoute();
            return;
        }

        // Otherwise, determine initial screen from state
        const state = AppState.get();
        if (!state || !state.user || !state.user.onboarded) {
            this.showScreen('onboarding');
        } else {
            this.showScreen('dashboard');
        }
    }
};

// Initialize app when DOM is ready
function initializeApp() {
    // Wait a tiny bit to ensure all scripts are loaded
    setTimeout(() => {
        if (typeof App !== 'undefined') {
            App.init();
        } else {
            console.error('App object not found. Make sure app.js is loaded.');
        }
    }, 10);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

