// Check-in Screen

const CheckinScreen = {
    sleepHours: 7,
    mood: null,
    stress: null,
    water: 0,
    movement: null,

    init() {
        // Load current values from state
        const state = AppState.get();
        this.sleepHours = state.metrics.sleep.lastNight || 7;
        this.stress = state.metrics.stress.today || 3;
        this.water = state.metrics.water.today || 0;
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.checkin-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen checkin-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        screen.innerHTML = `
            <div class="screen-header">
                <button class="back-button" onclick="App.navigate('dashboard')">←</button>
                <h2 class="screen-title">Daily Check-in</h2>
                <div style="width: 40px;"></div>
            </div>

            <form class="checkin-form" id="checkin-form">
                <div class="checkin-section">
                    <div class="checkin-section-title">Sleep Hours</div>
                    <div class="slider-container">
                        <input type="range" class="slider" id="sleep-input" min="0" max="12" step="0.5" value="${this.sleepHours}">
                        <div class="slider-value" id="sleep-display">${this.sleepHours}h ${Math.round((this.sleepHours % 1) * 60)}m</div>
                    </div>
                </div>

                <div class="checkin-section">
                    <div class="checkin-section-title">Mood / Stress Level</div>
                    <div class="mood-selector">
                        <div class="mood-option ${this.stress === 1 ? 'selected' : ''}" data-value="1">
                            <div class="mood-emoji">😊</div>
                            <div class="mood-label">Great</div>
                        </div>
                        <div class="mood-option ${this.stress === 2 ? 'selected' : ''}" data-value="2">
                            <div class="mood-emoji">🙂</div>
                            <div class="mood-label">Good</div>
                        </div>
                        <div class="mood-option ${this.stress === 3 ? 'selected' : ''}" data-value="3">
                            <div class="mood-emoji">😐</div>
                            <div class="mood-label">Okay</div>
                        </div>
                        <div class="mood-option ${this.stress === 4 ? 'selected' : ''}" data-value="4">
                            <div class="mood-emoji">😔</div>
                            <div class="mood-label">Tired</div>
                        </div>
                        <div class="mood-option ${this.stress === 5 ? 'selected' : ''}" data-value="5">
                            <div class="mood-emoji">😟</div>
                            <div class="mood-label">Stressed</div>
                        </div>
                    </div>
                </div>

                <div class="checkin-section">
                    <div class="checkin-section-title">Water Intake (ml)</div>
                    <input type="number" class="input-field" id="water-input" placeholder="Enter water intake in ml" value="${this.water || ''}" min="0">
                </div>

                <div class="checkin-section">
                    <div class="checkin-section-title">Movement Level (Optional)</div>
                    <div class="movement-buttons">
                        <button type="button" class="movement-button ${this.movement === 'low' ? 'selected' : ''}" data-movement="low">Low</button>
                        <button type="button" class="movement-button ${this.movement === 'medium' ? 'selected' : ''}" data-movement="medium">Medium</button>
                        <button type="button" class="movement-button ${this.movement === 'high' ? 'selected' : ''}" data-movement="high">High</button>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" id="submit-checkin">Check My Day</button>
            </form>
        `;

        this.attachEvents();
    },

    attachEvents() {
        // Sleep slider
        const sleepInput = document.getElementById('sleep-input');
        const sleepDisplay = document.getElementById('sleep-display');
        if (sleepInput && sleepDisplay) {
            sleepInput.addEventListener('input', (e) => {
                this.sleepHours = parseFloat(e.target.value);
                const hours = Math.floor(this.sleepHours);
                const minutes = Math.round((this.sleepHours % 1) * 60);
                sleepDisplay.textContent = `${hours}h ${minutes}m`;
            });
        }

        // Mood selector
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                moodOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.stress = parseInt(option.dataset.value);
            });
        });

        // Movement buttons
        const movementButtons = document.querySelectorAll('.movement-button');
        movementButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                movementButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.movement = btn.dataset.movement;
            });
        });

        // Form submission
        const form = document.getElementById('checkin-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }
    },

    handleSubmit() {
        // Get water value
        const waterInput = document.getElementById('water-input');
        this.water = waterInput ? parseInt(waterInput.value) || 0 : 0;

        // Validate required fields
        if (this.stress === null) {
            alert('Please select your mood/stress level');
            return;
        }

        // Prepare check-in data
        const checkInData = {
            sleep: this.sleepHours,
            stress: this.stress,
            water: this.water
        };

        if (this.movement) {
            checkInData.movement = this.movement;
        }

        // Store check-in data temporarily (will be saved after Gemini response)
        window.currentCheckInData = checkInData;

        // Navigate to loading screen
        App.navigate('loading');
    }
};

