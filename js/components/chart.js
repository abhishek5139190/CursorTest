// Chart Component

const Chart = {
    // Create bar chart
    createBarChart(data, labels, options = {}) {
        const { highlightIndex, maxValue } = options;
        const max = maxValue || Math.max(...data);
        const height = options.height || 120;

        let barsHtml = '';
        data.forEach((value, index) => {
            const barHeight = max > 0 ? (value / max) * height : 0;
            const isHighlight = highlightIndex === index;
            const isActive = options.activeIndex === index;

            barsHtml += `
                <div class="bar ${isHighlight ? 'highlight' : ''}" style="height: ${barHeight}px;">
                    <div class="bar-label ${isActive ? 'active' : ''}">${labels[index]}</div>
                </div>
            `;
        });

        return `
            <div class="chart-container">
                <div class="bar-chart" style="height: ${height}px;">
                    ${barsHtml}
                </div>
            </div>
        `;
    },

    // Create line chart
    createLineChart(data, labels, options = {}) {
        const { width = 300, height = 100 } = options;
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        // Generate SVG path
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        });

        const pathData = `M ${points.join(' L ')}`;
        const areaData = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

        return `
            <div class="chart-container">
                <div class="line-chart" style="width: 100%; height: ${height}px;">
                    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}">
                        <path class="area" d="${areaData}"></path>
                        <path class="line" d="${pathData}"></path>
                    </svg>
                </div>
            </div>
        `;
    },

    // Render bar chart
    renderBarChart(container, data, labels, options) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.createBarChart(data, labels, options);
        }
    },

    // Render line chart
    renderLineChart(container, data, labels, options) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.innerHTML = this.createLineChart(data, labels, options);
        }
    }
};

