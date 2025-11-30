// State management

const AppState = {
    // Default state structure
    defaultState: {
        user: {
            name: "Alex",
            routines: [],
            streak: 14,
            onboarded: false
        },
        metrics: {
            steps: {
                today: 6540,
                goal: 8000,
                weekly: [5200, 6100, 7200, 6800, 7500, 8200, 6540]
            },
            water: {
                today: 1200,
                goal: 2000,
                weekly: [1500, 1800, 1600, 1900, 1700, 2000, 1200]
            },
            sleep: {
                lastNight: 7.5,
                weekly: [7.0, 7.5, 6.5, 8.0, 7.5, 8.5, 7.5]
            },
            stress: {
                today: 3,
                weekly: [2, 3, 4, 3, 5, 2, 3]
            }
        },
        checkIns: [],
        habits: {
            sleep: ["no-caffeine", "no-screens"],
            steps: [],
            water: [],
            stress: []
        },
        lastCheckIn: null
    },

    // Current state
    state: null,

    // Initialize state
    init() {
        const saved = Storage.loadState();
        if (saved) {
            // Deep merge to preserve nested structures
            this.state = this.deepMerge(JSON.parse(JSON.stringify(this.defaultState)), saved);
        } else {
            this.state = JSON.parse(JSON.stringify(this.defaultState));
        }
        this.save();
    },

    // Deep merge helper
    deepMerge(target, source) {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    },

    // Check if value is an object
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    },

    // Get current state
    get() {
        return this.state;
    },

    // Update state
    update(updates) {
        this.state = { ...this.state, ...updates };
        this.save();
    },

    // Update nested state
    updateNested(path, value) {
        const keys = path.split('.');
        let current = this.state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        this.save();
    },

    // Save to localStorage
    save() {
        Storage.saveState(this.state);
    },

    // Calculate streak
    calculateStreak() {
        // Simple streak calculation based on check-ins
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        const lastCheckIn = this.state.lastCheckIn;
        if (!lastCheckIn) {
            return 0;
        }

        const lastCheckInDate = new Date(lastCheckIn).toDateString();
        if (lastCheckInDate === today || lastCheckInDate === yesterday) {
            return this.state.user.streak || 0;
        }
        return 0;
    },

    // Add check-in
    addCheckIn(checkInData) {
        const checkIn = {
            ...checkInData,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        this.state.checkIns.push(checkIn);
        this.state.lastCheckIn = new Date().toISOString();
        
        // Update metrics based on check-in
        if (checkInData.sleep !== undefined) {
            this.state.metrics.sleep.lastNight = checkInData.sleep;
            this.state.metrics.sleep.weekly[6] = checkInData.sleep;
        }
        if (checkInData.water !== undefined) {
            this.state.metrics.water.today = checkInData.water;
            this.state.metrics.water.weekly[6] = checkInData.water;
        }
        if (checkInData.stress !== undefined) {
            this.state.metrics.stress.today = checkInData.stress;
            this.state.metrics.stress.weekly[6] = checkInData.stress;
        }
        
        // Update streak
        const newStreak = this.calculateStreak();
        if (newStreak > 0) {
            this.state.user.streak = newStreak;
        }
        
        this.save();
    }
};

