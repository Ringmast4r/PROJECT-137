// Chord Diagram Visualization
// Circular visualization of book-to-book cross-references

class ChordDiagram {
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
        const outerRadius = Math.min(width, height) * 0.4;
        const innerRadius = outerRadius - 20;

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Get book data
        const books = bookMatrix.books;
        const matrix = bookMatrix.matrix;

        // Apply filters
        let filteredBooks = books;
        let filteredMatrix = matrix;

        const testament = filters.testament || 'all';
        if (testament !== 'all') {
            const otBooks = 39; // First 39 books are OT

            if (testament === 'OT') {
                filteredBooks = books.slice(0, otBooks);
                filteredMatrix = matrix.slice(0, otBooks).map(row => row.slice(0, otBooks));
            } else if (testament === 'NT') {
                filteredBooks = books.slice(otBooks);
                filteredMatrix = matrix.slice(otBooks).map(row => row.slice(otBooks));
            }
        }

        // Create chord layout
        const chord = d3.chord()
            .padAngle(0.05)
            .sortSubgroups(d3.descending);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const ribbon = d3.ribbon()
            .radius(innerRadius);

        const chords = chord(filteredMatrix);

        // Color scale
        const otBooks = testament === 'NT' ? 0 : (testament === 'OT' ? filteredBooks.length : 39);
        const color = d3.scaleOrdinal()
            .domain(d3.range(filteredBooks.length))
            .range(filteredBooks.map((book, i) =>
                i < otBooks ? '#2ecc71' : '#00CED1'
            ));

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw ribbons (connections)
        const ribbons = g.append('g')
            .selectAll('path')
            .data(chords)
            .enter()
            .append('path')
            .attr('d', ribbon)
            .style('fill', d => color(d.target.index))
            .style('opacity', 0.6)
            .style('stroke', d => d3.rgb(color(d.target.index)).darker())
            .style('stroke-width', 0.5)
            .on('mouseover', (event, d) => {
                // Highlight this ribbon
                ribbons.style('opacity', r => r === d ? 0.9 : 0.1);

                const sourceBook = filteredBooks[d.source.index];
                const targetBook = filteredBooks[d.target.index];
                const connections = d.source.value;

                tooltip.style('display', 'block')
                    .html(`
                        <strong>${sourceBook} → ${targetBook}</strong><br>
                        Connections: ${connections}
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                ribbons.style('opacity', 0.6);
                tooltip.style('display', 'none');
            });

        // Draw groups (books)
        const group = g.append('g')
            .selectAll('g')
            .data(chords.groups)
            .enter()
            .append('g');

        group.append('path')
            .style('fill', d => color(d.index))
            .style('stroke', '#FFD700')
            .style('stroke-width', 2)
            .attr('d', arc)
            .on('mouseover', (event, d) => {
                // Highlight ribbons connected to this group
                ribbons.style('opacity', r =>
                    r.source.index === d.index || r.target.index === d.index ? 0.9 : 0.1
                );

                const book = filteredBooks[d.index];
                const totalConnections = d.value;

                tooltip.style('display', 'block')
                    .html(`
                        <strong>${book}</strong><br>
                        Total Connections: ${totalConnections}
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                ribbons.style('opacity', 0.6);
                tooltip.style('display', 'none');
            });

        // Add book labels
        group.append('text')
            .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr('dy', '.35em')
            .attr('transform', d => `
                rotate(${(d.angle * 180 / Math.PI - 90)})
                translate(${outerRadius + 10})
                ${d.angle > Math.PI ? 'rotate(180)' : ''}
            `)
            .style('text-anchor', d => d.angle > Math.PI ? 'end' : 'start')
            .style('font-size', '10px')
            .style('fill', '#00CED1')
            .text(d => filteredBooks[d.index]);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text('Bible Book Cross-Reference Chord Diagram');

        // Add legend
        this.addLegend(svg, width, height, testament);

        // Add info text
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text(`Showing ${filteredBooks.length} books | Hover over arcs or ribbons for details`);
    }

    addLegend(svg, width, height, testament) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 80})`);

        const legendData = testament === 'NT'
            ? [{ color: '#00CED1', label: 'New Testament Books' }]
            : testament === 'OT'
            ? [{ color: '#2ecc71', label: 'Old Testament Books' }]
            : [
                { color: '#2ecc71', label: 'Old Testament' },
                { color: '#00CED1', label: 'New Testament' }
            ];

        const legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', d => d.color)
            .style('stroke', '#FFD700')
            .style('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text(d => d.label);
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
