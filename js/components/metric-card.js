// Metric Card Component

const MetricCard = {
    // Create metric card HTML
    create(data) {
        const { icon, title, value, progress, status, statusIcon } = data;
        const progressPercent = Math.min(100, Math.max(0, (progress.current / progress.goal) * 100));

        let statusHtml = '';
        if (status) {
            const statusClass = status.type || 'gray';
            statusHtml = `
                <div class="metric-status">
                    <span class="badge badge-${statusClass}">
                        ${statusIcon || ''} ${status.text}
                    </span>
                </div>
            `;
        }

        return `
            <div class="metric-card">
                <div class="metric-card-header">
                    <div class="metric-icon">${icon}</div>
                    <div class="metric-title">${title}</div>
                </div>
                <div class="metric-value">${value}</div>
                <div class="metric-progress">
                    <div class="metric-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                ${statusHtml}
            </div>
        `;
    },

    // Render metric card
    render(container, data) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.create(data);
        } else {
            console.error('MetricCard: Container not found', container);
        }
    }
};

