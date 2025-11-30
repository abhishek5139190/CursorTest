// Bottom Navigation Component

const Navigation = {
    // Create navigation bar
    create() {
        return `
            <nav class="bottom-nav">
                <button class="nav-item" data-screen="dashboard">
                    <span class="nav-icon">🏠</span>
                    <span>Home</span>
                </button>
                <button class="nav-item" data-screen="journal">
                    <span class="nav-icon">📔</span>
                    <span>Journal</span>
                </button>
                <button class="nav-item" data-screen="insights">
                    <span class="nav-icon">📊</span>
                    <span>Insights</span>
                </button>
                <button class="nav-item" data-screen="profile">
                    <span class="nav-icon">👤</span>
                    <span>Profile</span>
                </button>
            </nav>
        `;
    },

    // Render navigation
    render(container, activeScreen = 'dashboard') {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.create();
            this.attachEvents(activeScreen);
        }
    },

    // Attach event listeners
    attachEvents(activeScreen) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const screen = item.dataset.screen;
            
            // Set active state
            if (screen === activeScreen) {
                item.classList.add('active');
            }

            // Add click handler
            item.addEventListener('click', () => {
                if (screen === 'dashboard') {
                    App.navigate('dashboard');
                } else if (screen === 'journal') {
                    // Journal functionality can be added later
                    App.navigate('dashboard');
                } else if (screen === 'insights') {
                    // Insights functionality can be added later
                    App.navigate('dashboard');
                } else if (screen === 'profile') {
                    // Profile functionality can be added later
                    App.navigate('dashboard');
                }
            });
        });
    },

    // Update active state
    setActive(screenName) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
    }
};

