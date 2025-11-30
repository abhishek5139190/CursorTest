// Sleep Detail Screen

const SleepScreen = {
    viewMode: 'daily',
    sleepHours: 7.5,
    selectedHabits: [],

    init() {
        const state = AppState.get();
        this.sleepHours = state.metrics.sleep.lastNight;
        this.selectedHabits = state.habits.sleep || [];
        this.viewMode = 'daily';
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.sleep-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen detail-screen sleep-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        const state = AppState.get();
        const sleepData = state.metrics.sleep;
        const weeklyData = sleepData.weekly;
        const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        
        // Find today's index (assuming last item is today)
        const todayIndex = weeklyData.length - 1;

        screen.innerHTML = `
            <div class="screen-header">
                <button class="back-button" onclick="App.navigate('dashboard')">←</button>
                <h2 class="screen-title">Sleep</h2>
                <button class="menu-button">⋯</button>
            </div>

            <div class="detail-header-card">
                <div class="detail-subtitle">Last night's sleep</div>
                <div class="detail-main-value">${Math.floor(sleepData.lastNight)}h ${Math.round((sleepData.lastNight % 1) * 60)}m</div>
                <div style="font-size: 24px;">😊</div>
            </div>

            <div class="toggle-group">
                <button class="toggle-btn ${this.viewMode === 'daily' ? 'active' : ''}" data-mode="daily">Daily</button>
                <button class="toggle-btn ${this.viewMode === 'weekly' ? 'active' : ''}" data-mode="weekly">Weekly</button>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div>
                        <div class="chart-title">Last 7 days</div>
                        <div class="chart-subtitle">Sep 10–16</div>
                    </div>
                </div>
                <div id="sleep-chart"></div>
            </div>

            <div class="log-section">
                <div class="log-title">How was your sleep?</div>
                <div class="slider-container">
                    <input type="range" class="slider" id="sleep-slider" min="0" max="12" step="0.5" value="${this.sleepHours}">
                    <div class="slider-value" id="sleep-value">${this.sleepHours}h ${Math.round((this.sleepHours % 1) * 60)}m</div>
                </div>
                <div style="margin-top: 12px; color: var(--text-secondary); font-size: 14px; cursor: pointer;">
                    Add Bedtime & Wake-up <span style="float: right;">▼</span>
                </div>
                <button class="btn btn-secondary" id="save-sleep-btn" style="width: 100%; margin-top: 16px;">Save Sleep</button>
            </div>

            <div class="log-section">
                <div class="log-title">Sleep Habits</div>
                <div class="habit-grid">
                    <div class="habit-button ${this.selectedHabits.includes('no-caffeine') ? 'active' : ''}" data-habit="no-caffeine">
                        <div class="habit-icon">☕</div>
                        <div class="habit-label">No Caffeine Late</div>
                    </div>
                    <div class="habit-button ${this.selectedHabits.includes('no-screens') ? 'active' : ''}" data-habit="no-screens">
                        <div class="habit-icon">📱</div>
                        <div class="habit-label">No Screens Before Bed</div>
                    </div>
                    <div class="habit-button ${this.selectedHabits.includes('sun-wake') ? 'active' : ''}" data-habit="sun-wake">
                        <div class="habit-icon">☀️</div>
                        <div class="habit-label">Woke Up With Sun</div>
                    </div>
                    <div class="habit-button ${this.selectedHabits.includes('consistent') ? 'active' : ''}" data-habit="consistent">
                        <div class="habit-icon">🌙</div>
                        <div class="habit-label">Consistent Bedtime</div>
                    </div>
                </div>
            </div>

            <div class="ai-insight-card">
                <div class="ai-insight-icon">🧠</div>
                <div class="ai-insight-content">
                    <div class="ai-insight-title">AI Insight</div>
                    <div class="ai-insight-text">
                        It looks like you got more rest this weekend. Great job prioritizing your sleep!
                    </div>
                </div>
            </div>
        `;

        // Render chart
        Chart.renderBarChart('#sleep-chart', weeklyData, labels, {
            highlightIndex: todayIndex,
            activeIndex: todayIndex,
            height: 120
        });

        // Attach event listeners
        this.attachEvents();
    },

    attachEvents() {
        // Toggle buttons
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewMode = btn.dataset.mode;
                toggleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Could refresh chart view here if needed
            });
        });

        // Sleep slider
        const slider = document.getElementById('sleep-slider');
        const valueDisplay = document.getElementById('sleep-value');
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                this.sleepHours = parseFloat(e.target.value);
                const hours = Math.floor(this.sleepHours);
                const minutes = Math.round((this.sleepHours % 1) * 60);
                valueDisplay.textContent = `${hours}h ${minutes}m`;
            });
        }

        // Habit buttons
        const habitButtons = document.querySelectorAll('.habit-button');
        habitButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const habit = btn.dataset.habit;
                if (this.selectedHabits.includes(habit)) {
                    this.selectedHabits = this.selectedHabits.filter(h => h !== habit);
                    btn.classList.remove('active');
                } else {
                    this.selectedHabits.push(habit);
                    btn.classList.add('active');
                }
            });
        });

        // Save button
        const saveBtn = document.getElementById('save-sleep-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSleep();
            });
        }
    },

    saveSleep() {
        // Update state
        AppState.updateNested('metrics.sleep.lastNight', this.sleepHours);
        AppState.updateNested('habits.sleep', this.selectedHabits);
        
        // Update weekly array (last item is today)
        const state = AppState.get();
        state.metrics.sleep.weekly[6] = this.sleepHours;
        AppState.save();

        // Navigate back
        App.navigate('dashboard');
    }
};

