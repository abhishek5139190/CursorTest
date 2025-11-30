// Results Screen

const ResultsScreen = {
    init(params) {
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.results-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen results-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        const wellnessResponse = window.wellnessResponse;
        const checkInData = window.currentCheckInData;

        if (!wellnessResponse) {
            // No response data, redirect to check-in
            App.navigate('checkin');
            return;
        }

        screen.innerHTML = `
            <div class="results-header">
                <h1 class="results-title">Your Wellness Plan</h1>
                <p class="results-subtitle">Here's your personalized micro-habits for today</p>
            </div>

            <div class="results-sections">
                <div class="result-section">
                    <div class="result-section-title">Physical Reset</div>
                    <div class="result-section-content">
                        ${wellnessResponse.physicalReset || 'No suggestion available.'}
                    </div>
                </div>

                <div class="result-section">
                    <div class="result-section-title">Mind Reset</div>
                    <div class="result-section-content">
                        ${wellnessResponse.mindReset || 'No suggestion available.'}
                    </div>
                </div>

                <div class="result-section">
                    <div class="result-section-title">Lifestyle Boost</div>
                    <div class="result-section-content">
                        ${wellnessResponse.lifestyleBoost || 'No suggestion available.'}
                    </div>
                </div>

                <div class="result-section">
                    <div class="result-section-title">Honest Insight</div>
                    <div class="result-section-content">
                        ${wellnessResponse.honestInsight || 'No insight available.'}
                    </div>
                </div>

                <div class="result-section">
                    <div class="result-section-title">Daily Suggestion</div>
                    <div class="result-section-content">
                        ${wellnessResponse.dailySuggestion || 'No suggestion available.'}
                    </div>
                </div>
            </div>

            <div class="results-actions">
                <button class="btn btn-primary" id="save-entry-btn">Save Entry</button>
                <button class="btn btn-text" id="back-dashboard-btn">Back to Dashboard</button>
            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        // Save entry button
        const saveBtn = document.getElementById('save-entry-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveEntry();
            });
        }

        // Back to dashboard button
        const backBtn = document.getElementById('back-dashboard-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                App.navigate('dashboard');
            });
        }
    },

    saveEntry() {
        const checkInData = window.currentCheckInData;
        const wellnessResponse = window.wellnessResponse;

        if (!checkInData) {
            alert('No check-in data to save');
            return;
        }

        // Add check-in to state
        AppState.addCheckIn(checkInData);

        // Store wellness response with check-in
        const state = AppState.get();
        const lastCheckIn = state.checkIns[state.checkIns.length - 1];
        if (lastCheckIn) {
            lastCheckIn.wellnessResponse = wellnessResponse;
            AppState.save();
        }

        // Show success message
        const saveBtn = document.getElementById('save-entry-btn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✓ Saved!';
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor = '#4CAF50';

            setTimeout(() => {
                App.navigate('dashboard');
            }, 1500);
        }
    }
};

