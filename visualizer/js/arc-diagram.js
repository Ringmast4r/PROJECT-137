// Arc Diagram Visualization

class ArcDiagram {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.tooltip = null;
        this.width = 0;
        this.height = 900;  // Increased from 600 to give arcs more vertical space
        this.margin = { top: 60, right: 50, bottom: 100, left: 50 };  // More space for title and labels
    }

    render(filters = {}) {
        // Clear previous
        const container = document.getElementById(this.svgId);
        if (!container) {
            console.error(`❌ FATAL: SVG container not found: #${this.svgId}`);
            console.error('📋 Available SVG elements:', document.querySelectorAll('svg'));
            console.error('📋 Available elements with "svg" in ID:', document.querySelectorAll('[id*="svg"]'));
            return;
        }
        container.innerHTML = '';

        // Check if data is loaded
        if (!dataLoader || !dataLoader.isLoaded) {
            console.error('❌ Data not loaded yet');
            const svg = d3.select(`#${this.svgId}`);
            svg.append('text')
                .attr('x', container.clientWidth / 2)
                .attr('y', this.height / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', '#FF6B6B')
                .attr('font-size', '18px')
                .text('Loading data...');
            return;
        }

        // Get dimensions
        this.width = container.clientWidth;

        // Create SVG
        this.svg = d3.select(`#${this.svgId}`)
            .attr('width', this.width)
            .attr('height', this.height);

        this.tooltip = d3.select(`#${this.tooltipId}`);

        // Get data
        const chapters = dataLoader.getChapters();
        let connections = dataLoader.getConnections();

        // Apply filters
        if (filters.testament && filters.testament !== 'all') {
            connections = dataLoader.filterConnectionsByTestament(filters.testament);
        }

        if (filters.book) {
            connections = dataLoader.filterConnectionsByBook(filters.book);
        }

        if (filters.minConnections > 1) {
            connections = connections.filter(c => c.weight >= filters.minConnections);
        }

        // Draw visualization
        this.drawArcDiagram(chapters, connections);
    }

    drawArcDiagram(chapters, connections) {
        const innerWidth = this.width - this.margin.left - this.margin.right;
        const innerHeight = this.height - this.margin.top - this.margin.bottom;

        // Create main group
        const g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // Scale for chapter positions
        const xScale = d3.scaleLinear()
            .domain([0, chapters.length - 1])
            .range([0, innerWidth]);

        // Rainbow color scale based on distance between chapters (Chris Harrison style)
        const maxDistance = chapters.length - 1;
        const rainbowColorScale = d3.scaleSequential(d3.interpolateRainbow)
            .domain([0, maxDistance]);

        // Testament colors for chapter bars
        const testamentColorScale = d3.scaleOrdinal()
            .domain(['OT', 'NT'])
            .range(['#2ecc71', '#00CED1']);

        // Draw arcs (connections)
        const maxWeight = d3.max(connections, d => d.weight) || 1;

        const arcGenerator = d3.linkVertical()
            .source(d => [xScale(d.source), innerHeight])
            .target(d => [xScale(d.target), innerHeight])
            .x(d => d[0])
            .y(d => {
                const distance = Math.abs(d[0] - d.target[0]);
                return innerHeight - distance * 0.5; // Arc height based on distance
            });

        // Draw connection arcs
        g.selectAll('.arc-line')
            .data(connections)
            .enter()
            .append('path')
            .attr('class', 'arc-line')
            .attr('d', d => {
                const x1 = xScale(d.source);
                const x2 = xScale(d.target);
                const distance = Math.abs(x2 - x1);
                // Make arcs much taller: increased multiplier from 0.4 to 0.65
                // Allow arcs to use up to 95% of vertical space
                const height = Math.min(distance * 0.65, innerHeight * 0.95);

                return `M ${x1},${innerHeight}
                        Q ${(x1 + x2) / 2},${innerHeight - height}
                        ${x2},${innerHeight}`;
            })
            .style('stroke', d => {
                // Color based on distance between chapters (rainbow effect)
                const distance = Math.abs(d.source - d.target);
                return rainbowColorScale(distance);
            })
            .style('stroke-width', d => Math.sqrt(d.weight) / 3)
            .style('stroke-opacity', d => Math.min(d.weight / maxWeight * 0.6, 0.7))
            .style('fill', 'none')
            .on('mouseover', (event, d) => {
                const sourceChapter = chapters[d.source];
                const targetChapter = chapters[d.target];

                this.tooltip
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px')
                    .html(`
                        <strong>${sourceChapter.label}</strong> → <strong>${targetChapter.label}</strong>
                        <br/>Connections: ${d.weight}
                        <br/>Type: ${sourceChapter.testament} → ${targetChapter.testament}
                    `);

                // Highlight this arc
                d3.select(event.target)
                    .style('stroke-opacity', 1)
                    .style('stroke-width', 3);
            })
            .on('mouseout', (event, d) => {
                this.tooltip.style('opacity', 0);

                d3.select(event.target)
                    .style('stroke-opacity', Math.min(d.weight / maxWeight, 0.8))
                    .style('stroke-width', Math.sqrt(d.weight) / 3);
            });

        // Draw chapter markers (bottom line)
        const chapterGroups = g.selectAll('.chapter-node')
            .data(chapters)
            .enter()
            .append('g')
            .attr('class', 'chapter-node')
            .attr('transform', d => `translate(${xScale(d.id)}, ${innerHeight})`);

        // Chapter bars
        chapterGroups.append('rect')
            .attr('x', -1)
            .attr('y', 0)
            .attr('width', 2)
            .attr('height', 30)
            .attr('fill', d => testamentColorScale(d.testament))
            .attr('opacity', 0.8)
            .on('mouseover', (event, d) => {
                this.tooltip
                    .style('opacity', 1)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px')
                    .html(`
                        <strong>${d.label}</strong>
                        <br/>Book: ${d.book}
                        <br/>Testament: ${d.testament}
                    `);

                // Highlight related arcs
                d3.selectAll('.arc-line')
                    .style('opacity', arc => {
                        if (arc.source === d.id || arc.target === d.id) {
                            return 1;
                        }
                        return 0.1;
                    });
            })
            .on('mouseout', () => {
                this.tooltip.style('opacity', 0);

                d3.selectAll('.arc-line')
                    .style('opacity', null);
            });

        // Book labels (sample - show every 10th chapter to avoid clutter)
        const bookChanges = [];
        let lastBook = '';
        chapters.forEach((chapter, i) => {
            if (chapter.book !== lastBook) {
                bookChanges.push({ index: i, book: chapter.book, testament: chapter.testament });
                lastBook = chapter.book;
            }
        });

        g.selectAll('.book-label')
            .data(bookChanges)
            .enter()
            .append('text')
            .attr('class', 'book-label')
            .attr('x', d => xScale(d.index))
            .attr('y', innerHeight + 50)
            .attr('text-anchor', 'start')
            .attr('transform', d => `rotate(-45, ${xScale(d.index)}, ${innerHeight + 50})`)
            .style('font-size', '10px')
            .style('fill', d => testamentColorScale(d.testament))
            .style('opacity', 0.7)
            .text(d => d.book);

        // Legend - Rainbow gradient explanation
        const legend = this.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${this.width - 250}, 20)`);

        // Title
        legend.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', '13px')
            .style('font-weight', 'bold')
            .style('fill', '#FFD700')
            .text('Arc Color = Distance');

        // Create gradient bar
        const gradientWidth = 200;
        const gradientHeight = 15;

        // Create linear gradient
        const defs = this.svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'rainbow-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%');

        // Add color stops for rainbow
        const numStops = 20;
        for (let i = 0; i <= numStops; i++) {
            const offset = (i / numStops) * 100;
            const distance = (i / numStops) * maxDistance;
            gradient.append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', rainbowColorScale(distance));
        }

        // Draw gradient rectangle
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 10)
            .attr('width', gradientWidth)
            .attr('height', gradientHeight)
            .style('fill', 'url(#rainbow-gradient)');

        // Labels
        legend.append('text')
            .attr('x', 0)
            .attr('y', 40)
            .style('font-size', '11px')
            .style('fill', '#ccc')
            .text('Close');

        legend.append('text')
            .attr('x', gradientWidth)
            .attr('y', 40)
            .attr('text-anchor', 'end')
            .style('font-size', '11px')
            .style('fill', '#ccc')
            .text('Far Apart');

        // Title
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', '#FFD700')
            .text(`Bible Cross-References Arc Diagram (${connections.length.toLocaleString()} connections)`);

        // Subtitle with attribution
        this.svg.append('text')
            .attr('x', this.width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('fill', '#00CED1')
            .text('Inspired by Chris Harrison & Christoph Römhild (2007) • Rainbow colors show distance between chapters');
    }
}
