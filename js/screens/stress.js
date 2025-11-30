// Stress Detail Screen

const StressScreen = {
    viewMode: 'weekly',
    currentFeeling: 3,
    selectedTrigger: 'work',

    init() {
        const state = AppState.get();
        this.currentFeeling = state.metrics.stress.today;
        this.viewMode = 'weekly';
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.stress-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen detail-screen stress-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        const state = AppState.get();
        const stressData = state.metrics.stress;
        const weeklyData = stressData.weekly;
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const avgStress = (weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length).toFixed(1);
        const todayIndex = weeklyData.length - 1;
        
        // Calculate change (simple comparison)
        const prevAvg = weeklyData.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
        const change = ((avgStress - prevAvg) / prevAvg * 100).toFixed(0);

        screen.innerHTML = `
            <div class="screen-header">
                <button class="back-button" onclick="App.navigate('dashboard')">←</button>
                <h2 class="screen-title">Stress</h2>
                <button class="menu-button">⋯</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <div class="card">
                    <div class="detail-subtitle">Today's Level</div>
                    <div class="detail-main-value" style="font-size: 36px;">${stressData.today}</div>
                    <div class="small-text">${this.getStressLabel(stressData.today)}</div>
                </div>
                <div class="card">
                    <div class="detail-subtitle">Mood Meter</div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        ${[1, 2, 3, 4, 5].map(i => `
                            <div class="feeling-circle ${i <= stressData.today ? 'active' : ''}">${i}</div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="toggle-group">
                <button class="toggle-btn ${this.viewMode === 'daily' ? 'active' : ''}" data-mode="daily">Daily</button>
                <button class="toggle-btn ${this.viewMode === 'weekly' ? 'active' : ''}" data-mode="weekly">Weekly</button>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div>
                        <div class="chart-title">Stress Trend</div>
                        <div class="chart-subtitle">Last 7 Days</div>
                    </div>
                    <div class="chart-stats">
                        Avg. ${avgStress}
                        <span class="chart-change">↑ ${Math.abs(change)}%</span>
                    </div>
                </div>
                <div id="stress-chart"></div>
            </div>

            <div class="log-section">
                <div class="log-title">How are you feeling now?</div>
                <div class="feeling-selector">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <div class="feeling-circle ${i === this.currentFeeling ? 'active' : ''}" data-feeling="${i}">${i}</div>
                    `).join('')}
                </div>
            </div>

            <div class="log-section">
                <div class="log-title">What triggered it? (Optional)</div>
                <div class="trigger-group">
                    <button class="trigger-button ${this.selectedTrigger === 'work' ? 'active' : ''}" data-trigger="work">Work</button>
                    <button class="trigger-button ${this.selectedTrigger === 'sleep' ? 'active' : ''}" data-trigger="sleep">Sleep</button>
                    <button class="trigger-button ${this.selectedTrigger === 'health' ? 'active' : ''}" data-trigger="health">Health</button>
                    <button class="trigger-button ${this.selectedTrigger === 'social' ? 'active' : ''}" data-trigger="social">Social</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 24px;">🔥</div>
                        <div>
                            <div style="font-weight: 600; font-size: 16px;">3-Day Streak</div>
                            <div class="small-text">Keep it up!</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 24px;">⭐</div>
                        <div>
                            <div style="font-weight: 600; font-size: 16px;">Mindful Moment</div>
                            <div class="small-text">Today's win</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ai-insight-card">
                <div class="ai-insight-icon">✨</div>
                <div class="ai-insight-content">
                    <div class="ai-insight-title">AI Insight</div>
                    <div class="ai-insight-text">
                        Feeling overwhelmed? A 30-second focus on your breath can make a big difference.
                    </div>
                    <button class="btn btn-secondary" id="micro-reset-btn" style="width: 100%; margin-top: 12px;">
                        🧘 Try a micro-reset
                    </button>
                </div>
            </div>
        `;

        // Render chart
        Chart.renderBarChart('#stress-chart', weeklyData, labels, {
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
            });
        });

        // Feeling selector
        const feelingCircles = document.querySelectorAll('.feeling-circle[data-feeling]');
        feelingCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                this.currentFeeling = parseInt(circle.dataset.feeling);
                feelingCircles.forEach(c => c.classList.remove('active'));
                circle.classList.add('active');
                this.saveStress();
            });
        });

        // Trigger buttons
        const triggerButtons = document.querySelectorAll('.trigger-button');
        triggerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedTrigger = btn.dataset.trigger;
                triggerButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Micro-reset button
        const microResetBtn = document.getElementById('micro-reset-btn');
        if (microResetBtn) {
            microResetBtn.addEventListener('click', () => {
                alert('Micro-reset: Close your eyes, take 3 deep breaths. Focus on your breath for 30 seconds. You\'ve got this!');
            });
        }
    },

    getStressLabel(level) {
        const labels = {
            1: 'Low',
            2: 'Mild',
            3: 'Moderate',
            4: 'High',
            5: 'Very High'
        };
        return labels[level] || 'Moderate';
    },

    saveStress() {
        AppState.updateNested('metrics.stress.today', this.currentFeeling);
        const state = AppState.get();
        state.metrics.stress.weekly[6] = this.currentFeeling;
        AppState.save();
    }
};

