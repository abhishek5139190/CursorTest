// Progress Bar Component

const ProgressBar = {
    // Create circular progress bar
    createCircular(percent, size = 120, strokeWidth = 8) {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percent / 100) * circumference;

        return `
            <div class="progress-bar-circular" style="width: ${size}px; height: ${size}px;">
                <svg width="${size}" height="${size}">
                    <circle class="bg" cx="${size/2}" cy="${size/2}" r="${radius}" stroke-width="${strokeWidth}"></circle>
                    <circle class="progress" cx="${size/2}" cy="${size/2}" r="${radius}" 
                            stroke-width="${strokeWidth}" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${offset}"></circle>
                </svg>
            </div>
        `;
    },

    // Create linear progress bar
    createLinear(percent, height = 8) {
        return `
            <div class="progress-bar-linear" style="height: ${height}px;">
                <div class="progress-bar-linear-fill" style="width: ${percent}%"></div>
            </div>
        `;
    },

    // Render circular progress
    renderCircular(container, percent, size, strokeWidth) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.createCircular(percent, size, strokeWidth);
        }
    },

    // Render linear progress
    renderLinear(container, percent, height) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.createLinear(percent, height);
        }
    }
};

