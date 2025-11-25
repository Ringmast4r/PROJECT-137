// Timeline Visualization
// Chronological view of biblical events and periods

class Timeline {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
    }

    async render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Check if theographic data is loaded
        if (!theographicLoader || !theographicLoader.isLoaded) {
            this.showLoading(svg);
            return;
        }

        const events = theographicLoader.getEventsTimeline();
        const periods = theographicLoader.getPeriods();

        if (!events || events.length === 0) {
            this.showError(svg, 'No timeline data available');
            return;
        }

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height || 800;

        const margin = { top: 80, right: 50, bottom: 100, left: 150 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Group events by period
        const eventsByPeriod = d3.group(events, d => d.periodInfo?.fields.name || 'Unknown');

        // Create time scale based on periods
        const allPeriods = periods.filter(p => p.fields.yearNum !== undefined);
        allPeriods.sort((a, b) => (a.fields.yearNum || 0) - (b.fields.yearNum || 0));

        if (allPeriods.length === 0) {
            this.showError(svg, 'No period data available for timeline');
            return;
        }

        const minYear = Math.min(...allPeriods.map(p => p.fields.yearNum || 0));
        const maxYear = Math.max(...allPeriods.map(p => p.fields.yearNum || 0));

        // X scale for time
        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, innerWidth]);

        // Draw timeline axis
        const timeline = g.append('line')
            .attr('x1', 0)
            .attr('y1', innerHeight / 2)
            .attr('x2', innerWidth)
            .attr('y2', innerHeight / 2)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 3);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw periods
        const periodGroups = g.selectAll('.period')
            .data(allPeriods)
            .enter()
            .append('g')
            .attr('class', 'period')
            .attr('transform', d => `translate(${xScale(d.fields.yearNum || 0)}, ${innerHeight / 2})`);

        // Period markers
        periodGroups.append('circle')
            .attr('r', 8)
            .attr('fill', '#2ecc71')
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 2)
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .attr('r', 12)
                    .attr('stroke-width', 3);

                tooltip.style('display', 'block')
                    .html(`
                        <strong>${d.fields.name}</strong><br>
                        Year: ${d.fields.yearNum}<br>
                        ${d.fields.description || ''}
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget)
                    .attr('r', 8)
                    .attr('stroke-width', 2);
                tooltip.style('display', 'none');
            });

        // Period labels
        periodGroups.append('text')
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .attr('transform', 'rotate(-45)')
            .text(d => d.fields.name);

        // Draw events
        const eventY = (i, total) => {
            const spread = innerHeight * 0.6;
            const offset = (i % 2 === 0 ? -1 : 1);
            return (innerHeight / 2) + (offset * (20 + (i % 5) * (spread / 10)));
        };

        let eventIndex = 0;
        events.forEach(event => {
            if (!event.periodInfo || !event.periodInfo.fields.yearNum) return;

            const x = xScale(event.periodInfo.fields.yearNum);
            const y = eventY(eventIndex, events.length);

            const eventGroup = g.append('g')
                .attr('class', 'event')
                .attr('transform', `translate(${x}, ${y})`);

            // Connection line to timeline
            eventGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', (innerHeight / 2) - y)
                .attr('stroke', '#00CED1')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '2,2')
                .attr('opacity', 0.5);

            // Event marker
            eventGroup.append('circle')
                .attr('r', 6)
                .attr('fill', '#e74c3c')
                .attr('stroke', '#FFD700')
                .attr('stroke-width', 1.5)
                .on('mouseover', function(ev, d) {
                    d3.select(this)
                        .attr('r', 10)
                        .attr('stroke-width', 2);

                    tooltip.style('display', 'block')
                        .html(`
                            <strong>${event.fields.name}</strong><br>
                            Period: ${event.periodInfo.fields.name}<br>
                            ${event.fields.description || ''}<br>
                            Verses: ${event.fields.verseCount || 0}
                        `);
                })
                .on('mousemove', (ev) => {
                    tooltip.style('left', (ev.pageX + 10) + 'px')
                        .style('top', (ev.pageY - 28) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('r', 6)
                        .attr('stroke-width', 1.5);
                    tooltip.style('display', 'none');
                });

            // Event label (for major events)
            if (event.fields.verseCount > 10) {
                eventGroup.append('text')
                    .attr('dx', 10)
                    .attr('dy', 4)
                    .attr('fill', '#00CED1')
                    .attr('font-size', '9px')
                    .text(event.fields.name);
            }

            eventIndex++;
        });

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text(`Biblical Timeline - ${events.length} Events across ${allPeriods.length} Periods`);

        // Add subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text('Hover over periods and events for details');

        // Add legend
        this.addLegend(svg, width, height);
    }

    addLegend(svg, width, height) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 80})`);

        const items = [
            { label: 'Time Period', color: '#2ecc71', shape: 'circle' },
            { label: 'Biblical Event', color: '#e74c3c', shape: 'circle' },
            { label: 'Timeline', color: '#FFD700', shape: 'line' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(items)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.filter(d => d.shape === 'circle')
            .append('circle')
            .attr('r', 6)
            .attr('fill', d => d.color)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 1.5);

        legendItems.filter(d => d.shape === 'line')
            .append('line')
            .attr('x1', -6)
            .attr('y1', 0)
            .attr('x2', 6)
            .attr('y2', 0)
            .attr('stroke', d => d.color)
            .attr('stroke-width', 3);

        legendItems.append('text')
            .attr('x', 12)
            .attr('y', 4)
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text(d => d.label);
    }

    showLoading(svg) {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height || 800;

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '18px')
            .text('Loading timeline data...');
    }

    showError(svg, message) {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height || 800;

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FF6B6B')
            .attr('font-size', '18px')
            .text(message);
    }

    applyFilters(filters) {
        this.render(filters);
    }
}
