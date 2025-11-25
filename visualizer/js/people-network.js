// People Network Visualization
// Network graph showing relationships between biblical people

class PeopleNetwork {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.simulation = null;
    }

    async render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Check if theographic data is loaded
        if (!theographicLoader || !theographicLoader.isLoaded) {
            this.showLoading(svg);
            return;
        }

        const people = theographicLoader.getPeople();
        const peopleGroups = theographicLoader.getPeopleGroups();

        if (!people || people.length === 0) {
            this.showError(svg, 'No people data available');
            return;
        }

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height || 800;

        // Filter to top people by verse count for performance
        const topPeople = people
            .filter(p => p.fields.verseCount && p.fields.verseCount > 5)
            .sort((a, b) => (b.fields.verseCount || 0) - (a.fields.verseCount || 0))
            .slice(0, 200); // Top 200 people

        // Create nodes
        const nodes = topPeople.map(person => ({
            id: person.id,
            name: person.fields.name,
            gender: person.fields.gender,
            verseCount: person.fields.verseCount || 0,
            memberOf: person.fields.memberOf,
            birthPlace: person.fields.birthPlace,
            deathPlace: person.fields.deathPlace
        }));

        // Create links based on shared groups (tribes, families)
        const links = [];
        const peopleById = new Map(topPeople.map(p => [p.id, p]));

        topPeople.forEach(person => {
            if (!person.fields.memberOf) return;

            person.fields.memberOf.forEach(groupId => {
                // Find other people in same group
                topPeople.forEach(other => {
                    if (other.id !== person.id && other.fields.memberOf &&
                        other.fields.memberOf.includes(groupId)) {

                        // Avoid duplicate links
                        const existingLink = links.find(l =>
                            (l.source === person.id && l.target === other.id) ||
                            (l.source === other.id && l.target === person.id)
                        );

                        if (!existingLink) {
                            links.push({
                                source: person.id,
                                target: other.id,
                                group: groupId
                            });
                        }
                    }
                });
            });
        });

        console.log(`Rendering ${nodes.length} people with ${links.length} relationships`);

        const g = svg.append('g');

        // Add zoom
        const zoom = d3.zoom()
            .scaleExtent([0.5, 5])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Create force simulation
        this.simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Draw links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', '#00CED1')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.3);

        // Draw nodes
        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .call(d3.drag()
                .on('start', (event, d) => this.dragstarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragended(event, d))
            );

        // Node circles
        node.append('circle')
            .attr('r', d => Math.min(20, 5 + Math.sqrt(d.verseCount)))
            .attr('fill', d => this.getGenderColor(d.gender))
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 2)
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .attr('stroke-width', 4)
                    .attr('r', d => Math.min(25, 7 + Math.sqrt(d.verseCount)));

                // Highlight connected links
                link.attr('stroke-opacity', l =>
                    l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
                );

                tooltip.style('display', 'block')
                    .html(`
                        <strong>${d.name}</strong><br>
                        Gender: ${d.gender || 'Unknown'}<br>
                        Mentions: ${d.verseCount} verses<br>
                        ${d.memberOf ? `Groups: ${d.memberOf.length}` : ''}
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', (event, d) => {
                d3.select(event.currentTarget)
                    .attr('stroke-width', 2)
                    .attr('r', d => Math.min(20, 5 + Math.sqrt(d.verseCount)));

                link.attr('stroke-opacity', 0.3);
                tooltip.style('display', 'none');
            });

        // Labels for major people
        node.filter(d => d.verseCount > 50)
            .append('text')
            .attr('dx', d => Math.min(22, 7 + Math.sqrt(d.verseCount)))
            .attr('dy', 4)
            .attr('fill', '#00CED1')
            .attr('font-size', '10px')
            .text(d => d.name);

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text(`Biblical People Network - Top ${nodes.length} People`);

        // Add subtitle
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text('Connections show shared groups (tribes, families) | Drag nodes | Scroll to zoom');

        // Add legend
        this.addLegend(svg, width, height);
    }

    getGenderColor(gender) {
        const colors = {
            'Male': '#3498db',
            'Female': '#e74c3c',
            'Unknown': '#95a5a6'
        };
        return colors[gender] || colors['Unknown'];
    }

    addLegend(svg, width, height) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 100})`);

        const genders = [
            { label: 'Male', color: '#3498db' },
            { label: 'Female', color: '#e74c3c' },
            { label: 'Unknown', color: '#95a5a6' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(genders)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('circle')
            .attr('r', 8)
            .attr('fill', d => d.color)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 2);

        legendItems.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text(d => d.label);
    }

    // Drag functions
    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
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
            .text('Loading people data...');
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
