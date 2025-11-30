// Loading Screen

const LoadingScreen = {
    init() {
        this.render();
        this.processCheckIn();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.loading-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen loading-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        screen.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Generating your personalized wellness insights...</div>
        `;
    },

    async processCheckIn() {
        const checkInData = window.currentCheckInData;
        
        if (!checkInData) {
            // No check-in data, go back to check-in screen
            setTimeout(() => {
                App.navigate('checkin');
            }, 2000);
            return;
        }

        try {
            // Call Gemini API
            const wellnessResponse = await generateWellnessResponse(checkInData);
            
            // Store response for results screen
            window.wellnessResponse = wellnessResponse;
            window.currentCheckInData = checkInData;

            // Navigate to results screen
            App.navigate('results');
        } catch (error) {
            console.error('Error generating wellness response:', error);
            
            // Show error message
            const screen = document.querySelector('.loading-screen');
            if (screen) {
                screen.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 24px;">⚠️</div>
                        <h2 style="margin-bottom: 16px;">Oops! Something went wrong</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">
                            ${error.message || 'Unable to generate wellness insights. Please try again.'}
                        </p>
                        <button class="btn btn-primary" onclick="App.navigate('checkin')">Try Again</button>
                        <button class="btn btn-text" onclick="App.navigate('dashboard')" style="margin-top: 12px;">Back to Dashboard</button>
                    </div>
                `;
            }
        }
    }
};

