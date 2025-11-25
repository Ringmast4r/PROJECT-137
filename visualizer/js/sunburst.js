// Sunburst Diagram Visualization
// Hierarchical view: Testament → Book → Chapter

class Sunburst {
    constructor(svgId, tooltipId) {
        this.svgId = svgId;
        this.tooltipId = tooltipId;
        this.currentRoot = null;
    }

    render(filters = {}) {
        const svg = d3.select(`#${this.svgId}`);
        svg.selectAll('*').remove();

        // Get data using dataLoader API
        if (!dataLoader || !dataLoader.isLoaded) {
            this.showError(svg, 'Data not loaded');
            return;
        }

        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;
        const radius = Math.min(width, height) / 2;

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Build hierarchy
        const hierarchy = this.buildHierarchy(filters);

        // Create partition layout
        const partition = d3.partition()
            .size([2 * Math.PI, radius]);

        const root = d3.hierarchy(hierarchy)
            .sum(d => d.value || 0)
            .sort((a, b) => b.value - a.value);

        partition(root);

        this.currentRoot = root;

        // Arc generator
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(['OT', 'NT'])
            .range(['#2ecc71', '#00CED1']);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Draw arcs
        const path = g.selectAll('path')
            .data(root.descendants().filter(d => d.depth > 0))
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', d => {
                if (d.depth === 1) {
                    // Testament level
                    return d.data.name === 'Old Testament' ? '#2ecc71' : '#00CED1';
                } else if (d.depth === 2) {
                    // Book level
                    const testament = d.parent.data.name === 'Old Testament' ? 'OT' : 'NT';
                    return d3.rgb(color(testament)).brighter(0.5);
                } else {
                    // Chapter level
                    const testament = d.parent.parent.data.name === 'Old Testament' ? 'OT' : 'NT';
                    return d3.rgb(color(testament)).brighter(1);
                }
            })
            .style('stroke', '#1a1a2e')
            .style('stroke-width', 1)
            .style('opacity', 0.8)
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => {
                // Highlight path to root
                path.style('opacity', node => {
                    return this.isAncestor(node, d) || node === d ? 1 : 0.3;
                });

                let tooltipText = '';
                if (d.depth === 1) {
                    tooltipText = `<strong>${d.data.name}</strong><br>Books: ${d.children.length}<br>Total Chapters: ${d.value}`;
                } else if (d.depth === 2) {
                    tooltipText = `<strong>${d.data.name}</strong><br>Chapters: ${d.value}<br>Connections: ${d.data.connections || 0}`;
                } else if (d.depth === 3) {
                    tooltipText = `<strong>${d.parent.data.name} ${d.data.name}</strong><br>Connections: ${d.data.connections || 0}`;
                }

                tooltip.style('display', 'block').html(tooltipText);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                path.style('opacity', 0.8);
                tooltip.style('display', 'none');
            })
            .on('click', (event, d) => {
                event.stopPropagation();
                if (d.depth > 0) {
                    this.zoomTo(d, path, arc, tooltip);
                }
            });

        // Add center text
        const centerText = g.append('text')
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('cursor', 'pointer')
            .text('Bible')
            .on('click', () => {
                this.zoomTo(root, path, arc, tooltip);
            });

        // Add subtitle
        const subtitle = g.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 20)
            .style('fill', '#00CED1')
            .style('font-size', '11px')
            .text('Click to zoom');

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('fill', '#FFD700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text('Bible Structure Sunburst');

        // Add breadcrumb
        this.breadcrumb = svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#00CED1')
            .style('font-size', '12px')
            .text('Testament → Book → Chapter');

        // Add legend
        this.addLegend(svg, width);
    }

    buildHierarchy(filters) {
        const testament = filters.testament || 'all';

        // Get data from dataLoader
        const chapters = dataLoader.getChapters();
        const connections = dataLoader.getConnections();

        // Group chapters by book and testament
        const otBooks = new Map();
        const ntBooks = new Map();

        chapters.forEach(ch => {
            // Apply testament filter
            if (testament === 'OT' && ch.testament !== 'OT') return;
            if (testament === 'NT' && ch.testament !== 'NT') return;

            const bookMap = ch.testament === 'OT' ? otBooks : ntBooks;

            if (!bookMap.has(ch.book)) {
                bookMap.set(ch.book, {
                    name: ch.book,
                    children: [],
                    connections: 0
                });
            }

            const book = bookMap.get(ch.book);

            // Count connections for this chapter
            const chapterConnections = connections.filter(
                conn => conn.source === ch.id || conn.target === ch.id
            ).reduce((sum, conn) => sum + conn.weight, 0);

            book.children.push({
                name: `${ch.chapter}`,
                value: 1,
                connections: chapterConnections
            });

            book.connections += chapterConnections;
        });

        // Build hierarchy
        const children = [];

        if ((testament === 'all' || testament === 'OT') && otBooks.size > 0) {
            children.push({
                name: 'Old Testament',
                children: Array.from(otBooks.values())
            });
        }

        if ((testament === 'all' || testament === 'NT') && ntBooks.size > 0) {
            children.push({
                name: 'New Testament',
                children: Array.from(ntBooks.values())
            });
        }

        return {
            name: 'Bible',
            children: children
        };
    }

    isAncestor(ancestor, node) {
        let current = node;
        while (current.parent) {
            if (current.parent === ancestor) return true;
            current = current.parent;
        }
        return false;
    }

    zoomTo(d, path, arc, tooltip) {
        const transition = d3.transition()
            .duration(750)
            .tween('scale', () => {
                const xd = d3.interpolate(this.currentRoot.x0, d.x0);
                const yd = d3.interpolate(this.currentRoot.y0, d.y0);
                const yr = d3.interpolate(this.currentRoot.y1 - this.currentRoot.y0, d.y1 - d.y0);

                return t => {
                    this.currentRoot.x0 = xd(t);
                    this.currentRoot.y0 = yd(t);
                    this.currentRoot.y1 = yd(t) + yr(t);
                };
            });

        transition.selectAll('path')
            .attrTween('d', node => {
                return t => {
                    const x0 = (node.x0 - this.currentRoot.x0) / (this.currentRoot.x1 - this.currentRoot.x0) * 2 * Math.PI;
                    const x1 = (node.x1 - this.currentRoot.x0) / (this.currentRoot.x1 - this.currentRoot.x0) * 2 * Math.PI;
                    const y0 = (node.y0 - this.currentRoot.y0) / (this.currentRoot.y1 - this.currentRoot.y0) * (Math.min(svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height) / 2);
                    const y1 = (node.y1 - this.currentRoot.y0) / (this.currentRoot.y1 - this.currentRoot.y0) * (Math.min(svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height) / 2);

                    return d3.arc()
                        .startAngle(x0)
                        .endAngle(x1)
                        .innerRadius(y0)
                        .outerRadius(y1)
                        (node);
                };
            });

        // Update breadcrumb
        const ancestors = [];
        let current = d;
        while (current) {
            ancestors.unshift(current.data.name);
            current = current.parent;
        }

        if (this.breadcrumb) {
            this.breadcrumb.text(ancestors.join(' → '));
        }

        this.currentRoot = d;
    }

    addLegend(svg, width) {
        const legend = svg.append('g')
            .attr('transform', 'translate(20, 80)');

        const legendData = [
            { color: '#2ecc71', label: 'Old Testament', level: 'Testament' },
            { color: d3.rgb('#2ecc71').brighter(0.5), label: 'OT Books', level: 'Book' },
            { color: d3.rgb('#2ecc71').brighter(1), label: 'OT Chapters', level: 'Chapter' },
            { color: '#00CED1', label: 'New Testament', level: 'Testament' },
            { color: d3.rgb('#00CED1').brighter(0.5), label: 'NT Books', level: 'Book' },
            { color: d3.rgb('#00CED1').brighter(1), label: 'NT Chapters', level: 'Chapter' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(legendData)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

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
            .style('font-size', '11px')
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
