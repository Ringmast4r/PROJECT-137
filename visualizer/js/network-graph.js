// Network Graph Visualization
// Force-directed graph showing Bible cross-references

class NetworkGraph {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.simulation = null;
        this.currentFilters = {};
    }

    render(filters = {}) {
        this.currentFilters = filters;

        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // Get filtered data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        let chapters = dataLoader.getChapters();
        let connections = this.filterConnections(dataLoader.getConnections(), filters);

        // Limit nodes for performance (take top connected chapters)
        const chapterConnectionCounts = new Map();
        connections.forEach(conn => {
            chapterConnectionCounts.set(conn.source, (chapterConnectionCounts.get(conn.source) || 0) + conn.weight);
            chapterConnectionCounts.set(conn.target, (chapterConnectionCounts.get(conn.target) || 0) + conn.weight);
        });

        // Take top 200 most connected chapters for performance
        const topChapters = chapters
            .map(ch => ({ ...ch, totalConnections: chapterConnectionCounts.get(ch.id) || 0 }))
            .filter(ch => ch.totalConnections > 0)
            .sort((a, b) => b.totalConnections - a.totalConnections)
            .slice(0, 200);

        const topChapterIds = new Set(topChapters.map(ch => ch.id));

        // Filter connections to only include top chapters
        connections = connections.filter(conn =>
            topChapterIds.has(conn.source) && topChapterIds.has(conn.target)
        );

        // Create nodes and links for D3
        const nodes = topChapters.map(ch => ({
            id: ch.id,
            book: ch.book,
            chapter: ch.chapter,
            testament: ch.testament,
            connections: ch.totalConnections
        }));

        const links = connections.map(conn => ({
            source: conn.source,
            target: conn.target,
            weight: conn.weight
        }));

        // Create container group for zoom
        const g = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'network-link')
            .style('stroke', d => {
                const sourceNode = nodes.find(n => n.id === d.source);
                const targetNode = nodes.find(n => n.id === d.target);
                if (sourceNode && targetNode) {
                    if (sourceNode.testament === 'OT' && targetNode.testament === 'OT') return '#2ecc71';
                    if (sourceNode.testament === 'NT' && targetNode.testament === 'NT') return '#00CED1';
                    return '#9370DB';
                }
                return '#666';
            })
            .style('stroke-width', d => Math.sqrt(d.weight) / 2)
            .style('stroke-opacity', 0.3);

        // Create nodes
        const node = g.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', 'network-node')
            .attr('r', d => 3 + Math.sqrt(d.connections) / 2)
            .style('fill', d => d.testament === 'OT' ? '#2ecc71' : '#00CED1')
            .style('stroke', '#FFD700')
            .style('stroke-width', 1.5)
            .style('cursor', 'pointer')
            .call(this.drag(this.simulation));

        // Add tooltips
        const tooltip = d3.select(`#${this.tooltipId}`);

        node.on('mouseover', (event, d) => {
            tooltip.style('display', 'block')
                .html(`
                    <strong>${d.book} ${d.chapter}</strong><br>
                    Testament: ${d.testament === 'OT' ? 'Old Testament' : 'New Testament'}<br>
                    Connections: ${d.connections}
                `);
        })
        .on('mousemove', (event) => {
            tooltip.style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('display', 'none');
        });

        // Highlight connections on hover
        node.on('mouseenter', (event, d) => {
            link.style('stroke-opacity', l =>
                (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
            );
            node.style('opacity', n =>
                (n.id === d.id || links.some(l =>
                    (l.source.id === d.id && l.target.id === n.id) ||
                    (l.target.id === d.id && l.source.id === n.id)
                )) ? 1 : 0.2
            );
        })
        .on('mouseleave', () => {
            link.style('stroke-opacity', 0.3);
            node.style('opacity', 1);
        });

        // Create force simulation
        this.simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(d => 50 + (1 / Math.sqrt(d.weight)))
                .strength(d => Math.min(d.weight / 100, 1))
            )
            .force('charge', d3.forceManyBody()
                .strength(-100)
                .distanceMax(300)
            )
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => 5 + Math.sqrt(d.connections) / 2))
            .on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            });

        // Add legend
        this.addLegend(svg, width, height);

        // Add reset zoom button
        this.addResetButton(svg, zoom);
    }

    filterConnections(connections, filters) {
        const testament = filters.testament || 'all';
        const minWeight = filters.minConnections || 1;

        const chapters = dataLoader.getChapters();

        return connections.filter(conn => {
            if (conn.weight < minWeight) return false;

            const sourceChapter = chapters.find(ch => ch.id === conn.source);
            const targetChapter = chapters.find(ch => ch.id === conn.target);

            if (!sourceChapter || !targetChapter) return false;

            if (testament === 'OT') {
                return sourceChapter.testament === 'OT' && targetChapter.testament === 'OT';
            } else if (testament === 'NT') {
                return sourceChapter.testament === 'NT' && targetChapter.testament === 'NT';
            } else if (testament === 'cross') {
                return sourceChapter.testament !== targetChapter.testament;
            }

            return true;
        });
    }

    drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    addLegend(svg, width, height) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 100})`);

        const legendData = [
            { color: '#2ecc71', label: 'Old Testament' },
            { color: '#00CED1', label: 'New Testament' },
            { color: '#9370DB', label: 'Cross-Testament Link' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legendItems.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 6)
            .style('fill', d => d.color)
            .style('stroke', '#FFD700')
            .style('stroke-width', 1.5);

        legendItems.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text(d => d.label);
    }

    addResetButton(svg, zoom) {
        const button = svg.append('g')
            .attr('class', 'reset-zoom')
            .attr('transform', 'translate(20, 20)')
            .style('cursor', 'pointer')
            .on('click', () => {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);
            });

        button.append('rect')
            .attr('width', 80)
            .attr('height', 30)
            .attr('rx', 5)
            .style('fill', '#FFD700')
            .style('opacity', 0.8);

        button.append('text')
            .attr('x', 40)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#1a1a2e')
            .style('font-weight', 'bold')
            .style('font-size', '12px')
            .text('Reset View');
    }

    showError(svg, message) {
        svg.append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('fill', '#FF6B6B')
            .attr('font-size', '18px')
            .text(message);
    }

    applyFilters(filters) {
        this.render(filters);
    }
}
