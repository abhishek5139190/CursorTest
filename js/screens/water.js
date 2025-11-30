// Water Detail Screen

const WaterScreen = {
    viewMode: 'daily',

    init() {
        this.viewMode = 'daily';
        this.render();
    },

    render() {
        const app = document.getElementById('app');
        let screen = document.querySelector('.water-screen');
        
        if (!screen) {
            screen = document.createElement('div');
            screen.className = 'screen detail-screen water-screen';
            app.appendChild(screen);
        }
        screen.classList.add('active');

        const state = AppState.get();
        const waterData = state.metrics.water;
        const progressPercent = Math.min(100, (waterData.today / waterData.goal) * 100);
        const cups = Math.round(waterData.today / 250);
        const goalCups = Math.round(waterData.goal / 250);
        
        // 24h data (sample)
        const hourlyData = [200, 300, 400, 500, 600, 800, 1000, 1200, 1400, 1500, 1600, 1650];
        const hourlyLabels = ['12am', '6am', '12pm', '6pm', 'Now'];
        const hourlyDataPoints = [0, 300, 800, 1200, 1650];
        const last24h = hourlyData[hourlyData.length - 1];
        const prev24h = 1500;
        const change = ((last24h - prev24h) / prev24h * 100).toFixed(0);

        screen.innerHTML = `
            <div class="screen-header">
                <button class="back-button" onclick="App.navigate('dashboard')">←</button>
                <h2 class="screen-title">Water</h2>
                <button class="menu-button">⋯</button>
            </div>

            <div class="detail-header-card">
                <div id="water-progress-circle" style="margin: 20px auto;"></div>
                <div style="font-size: 32px; margin: 12px 0;">💧</div>
                <div style="font-weight: 600; font-size: 18px; margin-bottom: 8px;">Goal Met!</div>
                <div class="detail-main-value" style="font-size: 32px;">${waterData.today} / ${waterData.goal} ml</div>
                <div class="small-text">${cups} / ${goalCups} Cups</div>
            </div>

            <div style="margin-bottom: 20px;">
                <div class="log-title">Today's Achievements</div>
                <div style="display: flex; gap: 12px; margin-top: 12px;">
                    <div class="badge badge-teal" style="padding: 12px 16px;">
                        <span style="font-size: 20px;">☀️</span> Morning Hydration
                    </div>
                    <div class="badge badge-yellow" style="padding: 12px 16px;">
                        <span style="font-size: 20px;">🌾</span> Consistent Sip
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
                        <div class="chart-title">Last 24 Hours</div>
                    </div>
                    <div class="chart-stats">
                        ${last24h} ml
                        <span class="chart-change" style="color: #4CAF50;">↑ ${Math.abs(change)}%</span>
                    </div>
                </div>
                <div id="water-chart"></div>
            </div>

            <div class="log-section">
                <div class="log-title">Log Your Intake</div>
                <div class="water-buttons">
                    <button class="water-button" data-amount="250">+250ml</button>
                    <button class="water-button" data-amount="500">+500ml</button>
                    <button class="water-button" data-amount="250" data-cup="true">+1 Cup</button>
                    <button class="water-button" data-amount="custom" style="display: flex; align-items: center; gap: 4px;">
                        <span>✏️</span> Custom
                    </button>
                </div>
            </div>

            <div class="ai-insight-card">
                <div class="ai-insight-icon">💡</div>
                <div class="ai-insight-content">
                    <div class="ai-insight-title">AI Insight</div>
                    <div class="ai-insight-text">
                        You're consistently hydrated in the mornings. Let's keep that momentum going this afternoon! Try a glass before your 2 PM meeting.
                    </div>
                </div>
            </div>
        `;

        // Render circular progress
        ProgressBar.renderCircular('#water-progress-circle', progressPercent, 120, 8);

        // Render line chart
        Chart.renderLineChart('#water-chart', hourlyDataPoints, hourlyLabels, {
            width: 300,
            height: 100
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

        // Water buttons
        const waterButtons = document.querySelectorAll('.water-button');
        waterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = btn.dataset.amount;
                if (amount === 'custom') {
                    const customAmount = prompt('Enter amount in ml:');
                    if (customAmount && !isNaN(customAmount) && parseInt(customAmount) > 0) {
                        this.addWater(parseInt(customAmount));
                    }
                } else {
                    const mlAmount = btn.dataset.cup === 'true' ? 250 : parseInt(amount);
                    this.addWater(mlAmount);
                }
            });
        });
    },

    addWater(amount) {
        const state = AppState.get();
        const newTotal = state.metrics.water.today + amount;
        AppState.updateNested('metrics.water.today', newTotal);
        state.metrics.water.weekly[6] = newTotal;
        AppState.save();
        this.render();
    }
};

