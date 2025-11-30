// Dashboard Screen

const DashboardScreen = {
    init() {
        this.render();
    },

    render() {
        console.log('Dashboard render called');
        const app = document.getElementById('app');
        if (!app) {
            console.error('App container not found');
            return;
        }

        let screen = document.querySelector('.dashboard-screen');
        
        if (!screen) {
            console.log('Creating new dashboard screen element');
            screen = document.createElement('div');
            screen.className = 'screen dashboard-screen';
            app.appendChild(screen);
        } else {
            console.log('Using existing dashboard screen element');
        }

        const state = AppState.get();
        console.log('State:', state);
        if (!state || !state.metrics || !state.user) {
            console.error('State not properly initialized', state);
            screen.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Error</h2><p>State not initialized. Please refresh the page.</p></div>';
            return;
        }

        const metrics = state.metrics;
        const user = state.user;
        console.log('Rendering dashboard for user:', user.name, 'Metrics:', metrics);

        // Calculate progress percentages
        const stepsProgress = (metrics.steps.today / metrics.steps.goal) * 100;
        const waterProgress = (metrics.water.today / metrics.water.goal) * 100;
        const sleepProgress = (metrics.sleep.lastNight / 8) * 100; // Assuming 8h is ideal
        const stressLevel = metrics.stress.today;

        // Determine status for each metric
        const stepsStatus = stepsProgress >= 100 
            ? { type: 'teal', text: 'Goal Met', icon: '✓' }
            : stepsProgress >= 70 
            ? { type: 'teal', text: 'Nice job!', icon: '↑' }
            : { type: 'gray', text: 'On track', icon: '→' };

        const waterStatus = waterProgress >= 100
            ? { type: 'teal', text: 'Goal Met', icon: '✓' }
            : { type: 'gray', text: 'On track', icon: '→' };

        const sleepStatus = sleepProgress >= 100
            ? { type: 'teal', text: 'Goal Met', icon: '✓' }
            : { type: 'gray', text: 'Steady', icon: '→' };

        const stressStatus = { type: 'gray', text: 'Steady', icon: '→' };

        // Set innerHTML first - ensure content is visible
        const htmlContent = `
            <div class="dashboard-header">
                <div>
                    <h1 class="welcome-text">Welcome back, ${user.name}</h1>
                </div>
                <div class="streak-badge">
                    🔥 ${user.streak}-day streak
                </div>
            </div>

            <div class="metrics-grid">
                <div id="steps-card" style="min-height: 120px; background: #f0f0f0; border-radius: 8px; padding: 8px;">Loading...</div>
                <div id="water-card" style="min-height: 120px; background: #f0f0f0; border-radius: 8px; padding: 8px;">Loading...</div>
                <div id="sleep-card" style="min-height: 120px; background: #f0f0f0; border-radius: 8px; padding: 8px;">Loading...</div>
                <div id="stress-card" style="min-height: 120px; background: #f0f0f0; border-radius: 8px; padding: 8px;">Loading...</div>
            </div>

            <div class="thought-card">
                <div class="thought-header">
                    <div class="thought-icon">💭</div>
                    <div class="thought-title">A thought for you</div>
                </div>
                <div class="thought-text">
                    Feeling the pressure? A 5-minute breathing exercise can work wonders to reset your focus.
                </div>
                <button class="btn btn-secondary" style="width: 100%;" id="start-exercise-btn">Start exercise</button>
            </div>

            <button class="btn btn-primary" id="checkin-btn">Check-in now</button>
        `;
        
        console.log('Setting innerHTML, content length:', htmlContent.length);
        screen.innerHTML = htmlContent;
        console.log('innerHTML set, screen.innerHTML length:', screen.innerHTML.length);
        
        // Force display with !important
        screen.style.setProperty('display', 'block', 'important');
        screen.style.setProperty('visibility', 'visible', 'important');
        screen.style.setProperty('opacity', '1', 'important');
        screen.style.setProperty('position', 'relative', 'important');
        screen.style.setProperty('z-index', '1', 'important');
        screen.style.setProperty('width', '100%', 'important');
        screen.style.setProperty('height', 'auto', 'important');
        screen.style.setProperty('min-height', 'calc(100vh - 80px)', 'important');
        
        // Verify visibility
        const computedStyle = window.getComputedStyle(screen);
        console.log('Computed styles:', {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            width: computedStyle.width,
            height: computedStyle.height,
            position: computedStyle.position
        });
        
        // Test if content is actually in DOM
        const testElement = screen.querySelector('.dashboard-header');
        console.log('Test element found:', !!testElement, testElement ? testElement.textContent.substring(0, 50) : 'N/A');

        // Render metric cards immediately after setting innerHTML
        // Use a small delay to ensure DOM is updated
        setTimeout(() => {
            if (typeof MetricCard === 'undefined') {
                console.error('MetricCard component not found');
                return;
            }

            // Query containers from within the screen element
            const stepsContainer = screen.querySelector('#steps-card');
            const waterContainer = screen.querySelector('#water-card');
            const sleepContainer = screen.querySelector('#sleep-card');
            const stressContainer = screen.querySelector('#stress-card');

            if (stepsContainer && waterContainer && sleepContainer && stressContainer) {
                MetricCard.render(stepsContainer, {
                    icon: '👣',
                    title: 'Steps',
                    value: metrics.steps.today.toLocaleString(),
                    progress: { current: metrics.steps.today, goal: metrics.steps.goal },
                    status: stepsStatus
                });

                MetricCard.render(waterContainer, {
                    icon: '💧',
                    title: 'Water',
                    value: `${(metrics.water.today / 1000).toFixed(1)} L`,
                    progress: { current: metrics.water.today, goal: metrics.water.goal },
                    status: waterStatus
                });

                MetricCard.render(sleepContainer, {
                    icon: '🌙',
                    title: 'Sleep',
                    value: `${Math.floor(metrics.sleep.lastNight)}h ${Math.round((metrics.sleep.lastNight % 1) * 60)}m`,
                    progress: { current: metrics.sleep.lastNight, goal: 8 },
                    status: sleepStatus
                });

                MetricCard.render(stressContainer, {
                    icon: '😊',
                    title: 'Stress',
                    value: stressLevel === 1 ? 'Low' : stressLevel === 2 ? 'Mild' : stressLevel === 3 ? 'Moderate' : stressLevel === 4 ? 'High' : 'Very High',
                    progress: { current: stressLevel, goal: 5 },
                    status: stressStatus
                });

                // Make cards clickable
                [stepsContainer, waterContainer, sleepContainer, stressContainer].forEach((container, index) => {
                    const screens = ['steps', 'water', 'sleep', 'stress'];
                    container.style.cursor = 'pointer';
                    container.addEventListener('click', () => {
                        App.navigate(screens[index]);
                    });
                });
            } else {
                console.error('Metric card containers not found', {
                    steps: !!stepsContainer,
                    water: !!waterContainer,
                    sleep: !!sleepContainer,
                    stress: !!stressContainer
                });
            }
        }, 50);

        // Render navigation and attach events
        setTimeout(() => {
            // Render navigation
            if (typeof Navigation !== 'undefined') {
                // Remove existing navigation if any
                const existingNav = document.querySelector('.bottom-nav');
                if (existingNav) {
                    existingNav.remove();
                }
                Navigation.render(document.body, 'dashboard');
            } else {
                console.error('Navigation component not found');
            }

            // Attach event listeners
            this.attachEvents();
        }, 100);
    },

    attachEvents() {
        const checkinBtn = document.getElementById('checkin-btn');
        if (checkinBtn) {
            checkinBtn.addEventListener('click', () => {
                App.navigate('checkin');
            });
        }

        const exerciseBtn = document.getElementById('start-exercise-btn');
        if (exerciseBtn) {
            exerciseBtn.addEventListener('click', () => {
                // Could navigate to a breathing exercise screen or show a modal
                alert('Breathing exercise: Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5 times.');
            });
        }
    }
};

