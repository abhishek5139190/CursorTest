// localStorage helper functions

const Storage = {
    // Save state to localStorage
    saveState(state) {
        try {
            localStorage.setItem('honestHealthState', JSON.stringify(state));
            return true;
        } catch (error) {
            console.error('Error saving state:', error);
            return false;
        }
    },

    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem('honestHealthState');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading state:', error);
            return null;
        }
    },

    // Clear all stored data
    clearState() {
        try {
            localStorage.removeItem('honestHealthState');
            return true;
        } catch (error) {
            console.error('Error clearing state:', error);
            return false;
        }
    }
};

