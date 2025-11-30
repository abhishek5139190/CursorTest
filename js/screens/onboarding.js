// Onboarding Screen

const OnboardingScreen = {
    selectedRoutines: [],

    init() {
        this.selectedRoutines = [];
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.onboarding-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen onboarding-screen active';
            app.appendChild(screen);
        } else {
            screen.classList.add('active');
        }

        screen.innerHTML = `
            <h1 class="onboarding-title">Your wellness journey starts with a single step</h1>
            <p class="onboarding-subtitle">Let's build a small routine that works for you. Select a few to begin.</p>
            
            <div class="routine-list">
                <div class="routine-card" data-routine="steps">
                    <div class="routine-icon teal">🚶</div>
                    <div class="routine-content">
                        <div class="routine-title">Daily Steps</div>
                        <div class="routine-description">Energize your body and mind</div>
                    </div>
                    <div class="routine-checkbox">✓</div>
                </div>
                
                <div class="routine-card selected" data-routine="hydration">
                    <div class="routine-star">⭐</div>
                    <div class="routine-icon teal">💧</div>
                    <div class="routine-content">
                        <div class="routine-title">Hydration</div>
                        <div class="routine-description">Improve focus and mood</div>
                    </div>
                    <div class="routine-checkbox">✓</div>
                </div>
                
                <div class="routine-card selected" data-routine="mindful-sleep">
                    <div class="routine-star">⭐</div>
                    <div class="routine-icon teal">🌙</div>
                    <div class="routine-content">
                        <div class="routine-title">Mindful Sleep</div>
                        <div class="routine-description">Rest well for a productive day</div>
                    </div>
                    <div class="routine-checkbox">✓</div>
                </div>
                
                <div class="routine-card" data-routine="mindfulness">
                    <div class="routine-icon gray">🧘</div>
                    <div class="routine-content">
                        <div class="routine-title">Mindfulness</div>
                        <div class="routine-description">Find calm and reduce stress</div>
                    </div>
                    <div class="routine-checkbox"></div>
                </div>
            </div>
            
            <button class="btn btn-primary" id="continue-btn">Continue</button>
            <button class="btn btn-text" id="skip-btn" style="width: 100%; margin-top: 12px;">Skip for now</button>
        `;

        // Set initial selected routines
        this.selectedRoutines = ['hydration', 'mindful-sleep'];

        // Attach event listeners
        this.attachEvents();
    },

    attachEvents() {
        // Routine card selection
        const routineCards = document.querySelectorAll('.routine-card');
        routineCards.forEach(card => {
            card.addEventListener('click', () => {
                const routine = card.dataset.routine;
                if (this.selectedRoutines.includes(routine)) {
                    this.selectedRoutines = this.selectedRoutines.filter(r => r !== routine);
                    card.classList.remove('selected');
                } else {
                    this.selectedRoutines.push(routine);
                    card.classList.add('selected');
                }
            });
        });

        // Continue button
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.handleContinue();
            });
        }

        // Skip button
        const skipBtn = document.getElementById('skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.handleSkip();
            });
        }
    },

    handleContinue() {
        try {
            // Save selected routines to state
            AppState.updateNested('user.routines', this.selectedRoutines);
            AppState.updateNested('user.onboarded', true);
            AppState.save();

            // Small delay to ensure state is saved
            setTimeout(() => {
                // Navigate to dashboard
                App.navigate('dashboard');
            }, 100);
        } catch (error) {
            console.error('Error in handleContinue:', error);
            alert('Error saving preferences. Please try again.');
        }
    },

    handleSkip() {
        try {
            // Mark as onboarded without routines
            AppState.updateNested('user.onboarded', true);
            AppState.save();

            // Small delay to ensure state is saved
            setTimeout(() => {
                // Navigate to dashboard
                App.navigate('dashboard');
            }, 100);
        } catch (error) {
            console.error('Error in handleSkip:', error);
            alert('Error saving preferences. Please try again.');
        }
    }
};

