// Heatmap Visualization
// 66x66 book-to-book connection matrix

class Heatmap {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
    }

    render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Get book matrix data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        const bookMatrix = dataLoader.getBookMatrix();
        if (!bookMatrix || !bookMatrix.books || !bookMatrix.matrix) {
            this.showError(svg, 'Book matrix data not available');
            return;
        }

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        const margin = { top: 100, right: 50, bottom: 150, left: 150 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Get book data
        const books = bookMatrix.books;
        const matrix = bookMatrix.matrix;

        // Apply filters
        let filteredBooks = books;
        let filteredMatrix = matrix;

        const testament = filters.testament || 'all';
        if (testament !== 'all') {
            const otBooks = 39;

            if (testament === 'OT') {
                filteredBooks = books.slice(0, otBooks);
                filteredMatrix = matrix.slice(0, otBooks).map(row => row.slice(0, otBooks));
            } else if (testament === 'NT') {
                filteredBooks = books.slice(otBooks);
                filteredMatrix = matrix.slice(otBooks).map(row => row.slice(otBooks));
            }
        }

        const cellSize = Math.min(innerWidth, innerHeight) / filteredBooks.length;

        // Find max value for color scale
        const maxValue = d3.max(filteredMatrix.flat());

        // Color scale
        const colorScale = d3.scaleSequential()
            .domain([0, maxValue])
            .interpolator(d3.interpolateYlOrRd);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw cells
        const rows = g.selectAll('.row')
            .data(filteredMatrix)
            .enter()
            .append('g')
            .attr('class', 'row')
            .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);

        rows.selectAll('.cell')
            .data((d, i) => d.map((value, j) => ({ value, row: i, col: j })))
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('x', d => d.col * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .style('fill', d => d.value === 0 ? '#0a0a0a' : colorScale(d.value))
            .style('stroke', '#1a1a2e')
            .style('stroke-width', 0.5)
            .on('mouseover', (event, d) => {
                const sourceBook = filteredBooks[d.row];
                const targetBook = filteredBooks[d.col];
                const connections = d.value;

                tooltip.style('display', 'block')
                    .html(`
                        <strong>${sourceBook} → ${targetBook}</strong><br>
                        Connections: ${connections}
                    `);

                // Highlight row and column
                d3.selectAll('.cell')
                    .style('opacity', cell =>
                        cell.row === d.row || cell.col === d.col ? 1 : 0.3
                    );

                // Highlight labels
                d3.selectAll('.row-label')
                    .style('font-weight', (_, i) => i === d.row ? 'bold' : 'normal')
                    .style('fill', (_, i) => i === d.row ? '#FFD700' : '#00CED1');

                d3.selectAll('.col-label')
                    .style('font-weight', (_, i) => i === d.col ? 'bold' : 'normal')
                    .style('fill', (_, i) => i === d.col ? '#FFD700' : '#00CED1');
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('display', 'none');

                d3.selectAll('.cell').style('opacity', 1);
                d3.selectAll('.row-label')
                    .style('font-weight', 'normal')
                    .style('fill', '#00CED1');
                d3.selectAll('.col-label')
                    .style('font-weight', 'normal')
                    .style('fill', '#00CED1');
            });

        // Add row labels
        g.selectAll('.row-label')
            .data(filteredBooks)
            .enter()
            .append('text')
            .attr('class', 'row-label')
            .attr('x', -5)
            .attr('y', (d, i) => i * cellSize + cellSize / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', `${Math.max(8, cellSize * 0.6)}px`)
            .text(d => d);

        // Add column labels
        g.selectAll('.col-label')
            .data(filteredBooks)
            .enter()
            .append('text')
            .attr('class', 'col-label')
            .attr('x', (d, i) => i * cellSize + cellSize / 2)
            .attr('y', -5)
            .attr('text-anchor', 'start')
            .attr('transform', (d, i) => `rotate(-90, ${i * cellSize + cellSize / 2}, -5)`)
            .style('fill', '#00CED1')
            .style('font-size', `${Math.max(8, cellSize * 0.6)}px`)
            .text(d => d);

        // Add testament dividers if showing all
        if (testament === 'all') {
            const otBooks = 39;
            const dividerPos = otBooks * cellSize;

            // Vertical divider
            g.append('line')
                .attr('x1', dividerPos)
                .attr('y1', 0)
                .attr('x2', dividerPos)
                .attr('y2', filteredBooks.length * cellSize)
                .style('stroke', '#FFD700')
                .style('stroke-width', 3);

            // Horizontal divider
            g.append('line')
                .attr('x1', 0)
                .attr('y1', dividerPos)
                .attr('x2', filteredBooks.length * cellSize)
                .attr('y2', dividerPos)
                .style('stroke', '#FFD700')
                .style('stroke-width', 3);

            // Testament labels
            svg.append('text')
                .attr('x', margin.left + (otBooks * cellSize) / 2)
                .attr('y', margin.top - 60)
                .attr('text-anchor', 'middle')
                .style('fill', '#2ecc71')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Old Testament');

            svg.append('text')
                .attr('x', margin.left + otBooks * cellSize + ((filteredBooks.length - otBooks) * cellSize) / 2)
                .attr('y', margin.top - 60)
                .attr('text-anchor', 'middle')
                .style('fill', '#00CED1')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('New Testament');
        }

        // Add color legend
        this.addColorLegend(svg, width, height, colorScale, maxValue);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text(`Bible Book Cross-Reference Heatmap (${filteredBooks.length}x${filteredBooks.length})`);

        // Add subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 55)
            .attr('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text('Hover over cells to see connection details | Darker = More connections');
    }

    addColorLegend(svg, width, height, colorScale, maxValue) {
        const legendWidth = 200;
        const legendHeight = 15;
        const legendX = width - legendWidth - 50;
        const legendY = height - 50;

        const legend = svg.append('g')
            .attr('transform', `translate(${legendX}, ${legendY})`);

        // Create gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'heatmap-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%');

        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const value = (maxValue / steps) * i;
            gradient.append('stop')
                .attr('offset', `${(i / steps) * 100}%`)
                .attr('stop-color', colorScale(value));
        }

        // Draw gradient bar
        legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#heatmap-gradient)')
            .style('stroke', '#FFD700')
            .style('stroke-width', 1);

        // Add labels
        legend.append('text')
            .attr('x', 0)
            .attr('y', legendHeight + 15)
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text('0');

        legend.append('text')
            .attr('x', legendWidth)
            .attr('y', legendHeight + 15)
            .attr('text-anchor', 'end')
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text(Math.round(maxValue));

        legend.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Connection Strength');
    }

    showError(svg, message) {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

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
