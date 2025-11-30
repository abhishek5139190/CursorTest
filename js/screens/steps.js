// Steps Detail Screen

const StepsScreen = {
    viewMode: 'daily',
    stepsGoal: 8000,

    init() {
        const state = AppState.get();
        this.stepsGoal = state.metrics.steps.goal;
        this.viewMode = 'daily';
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.steps-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen detail-screen steps-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        const state = AppState.get();
        const stepsData = state.metrics.steps;
        const weeklyData = stepsData.weekly;
        const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        const progressPercent = Math.min(100, (stepsData.today / stepsData.goal) * 100);
        const weeklyTotal = weeklyData.reduce((a, b) => a + b, 0);
        const todayIndex = weeklyData.length - 1;

        screen.innerHTML = `
            <div class="screen-header">
                <button class="back-button" onclick="App.navigate('dashboard')">←</button>
                <h2 class="screen-title">Steps</h2>
                <button class="menu-button">⋯</button>
            </div>

            <div class="detail-header-card">
                <div class="detail-subtitle">Daily Steps Goal</div>
                <div class="detail-main-value">${stepsData.today.toLocaleString()}</div>
                <div class="small-text">of ${stepsData.goal.toLocaleString()} goal</div>
                <div id="steps-progress-circle" style="margin: 20px auto;"></div>
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
                    <div class="badge badge-teal">🔥 3-Day Streak</div>
                    <div class="badge badge-orange">☀️ Morning Walk</div>
                </div>
            </div>

            <div class="toggle-group">
                <button class="toggle-btn ${this.viewMode === 'daily' ? 'active' : ''}" data-mode="daily">Daily</button>
                <button class="toggle-btn ${this.viewMode === 'weekly' ? 'active' : ''}" data-mode="weekly">Weekly</button>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div>
                        <div class="chart-title">Last 7 Days</div>
                    </div>
                    <div class="chart-stats">
                        ${weeklyTotal.toLocaleString()}
                    </div>
                </div>
                <div id="steps-chart"></div>
            </div>

            <div class="log-section">
                <div class="log-title">Log Steps</div>
                <div class="log-buttons">
                    <button class="log-button" data-amount="500">+500</button>
                    <button class="log-button" data-amount="1000">+1000</button>
                    <button class="log-button" data-amount="custom">Custom</button>
                </div>
                <div class="log-input-group" id="custom-input-group" style="display: none;">
                    <input type="number" class="log-input" id="custom-steps-input" placeholder="Enter custom amount">
                    <button class="log-add-btn" id="add-custom-steps">Add</button>
                </div>
            </div>

            <div class="ai-insight-card">
                <div class="ai-insight-icon">✨</div>
                <div class="ai-insight-content">
                    <div class="ai-insight-title">Motivational Tip</div>
                    <div class="ai-insight-text">
                        You're close to your weekly average — a 5-min walk after lunch could boost your energy.
                    </div>
                </div>
            </div>
        `;

        // Render circular progress
        ProgressBar.renderCircular('#steps-progress-circle', progressPercent, 120, 8);

        // Render chart
        Chart.renderBarChart('#steps-chart', weeklyData, labels, {
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

        // Log buttons
        const logButtons = document.querySelectorAll('.log-button');
        logButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = btn.dataset.amount;
                if (amount === 'custom') {
                    const inputGroup = document.getElementById('custom-input-group');
                    inputGroup.style.display = 'flex';
                } else {
                    this.addSteps(parseInt(amount));
                }
            });
        });

        // Add custom steps
        const addBtn = document.getElementById('add-custom-steps');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const input = document.getElementById('custom-steps-input');
                const amount = parseInt(input.value);
                if (amount && amount > 0) {
                    this.addSteps(amount);
                    input.value = '';
                    document.getElementById('custom-input-group').style.display = 'none';
                }
            });
        }
    },

    addSteps(amount) {
        const state = AppState.get();
        const newTotal = state.metrics.steps.today + amount;
        AppState.updateNested('metrics.steps.today', newTotal);
        state.metrics.steps.weekly[6] = newTotal;
        AppState.save();
        this.render();
    }
};

