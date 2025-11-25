// Geographic Map Visualization
// World map showing 1,600+ biblical places with GPS coordinates

class GeographicMap {
    constructor(containerId, tooltipId) {
        this.containerId = containerId;
        this.tooltipId = tooltipId;
        this.svg = null;
        this.projection = null;
        this.path = null;
    }

    async render(filters = {}) {
        const container = d3.select(`#${this.containerId}`);
        container.selectAll('*').remove();

        // Check if theographic data is loaded
        if (!theographicLoader || !theographicLoader.isLoaded) {
            this.showLoading(container);
            return;
        }

        const places = theographicLoader.getPlacesWithCoordinates();
        if (!places || places.length === 0) {
            this.showError(container, 'No geographic data available');
            return;
        }

        const width = container.node().getBoundingClientRect().width;
        const height = 600;

        // Create SVG
        this.svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Setup map projection (focused on Middle East)
        this.projection = d3.geoMercator()
            .center([35, 31]) // Center on Israel/Palestine
            .scale(width * 2)
            .translate([width / 2, height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        this.svg.call(zoom);

        const g = this.svg.append('g');

        // Draw simple background
        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#1a1a2e');

        // Draw simple world outline (Mediterranean region)
        this.drawSimpleMap(g);

        // Tooltip
        const tooltip = d3.select(`#${this.tooltipId}`);

        // Group places by location to avoid overlaps
        const placesByLocation = this.groupPlacesByProximity(places);

        // Draw places
        const placeGroups = g.selectAll('.place')
            .data(placesByLocation)
            .enter()
            .append('g')
            .attr('class', 'place')
            .attr('transform', d => {
                const coords = this.projection([
                    parseFloat(d.longitude),
                    parseFloat(d.latitude)
                ]);
                return coords ? `translate(${coords[0]}, ${coords[1]})` : null;
            });

        // Add circles for places
        placeGroups.append('circle')
            .attr('r', d => Math.min(8, 3 + Math.log(d.count)))
            .attr('fill', d => this.getPlaceColor(d))
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 1)
            .attr('opacity', 0.8)
            .on('mouseover', (event, d) => {
                d3.select(event.currentTarget)
                    .attr('r', d => Math.min(12, 5 + Math.log(d.count)))
                    .attr('stroke-width', 2)
                    .attr('opacity', 1);

                const placeNames = d.places.map(p => p.displayTitle || p.kjvName || p.esvName).join(', ');
                tooltip.style('display', 'block')
                    .html(`
                        <strong>${placeNames}</strong><br>
                        Type: ${d.featureType || 'Unknown'}<br>
                        Mentions: ${d.verseCount} verses<br>
                        Coordinates: ${parseFloat(d.latitude).toFixed(2)}°, ${parseFloat(d.longitude).toFixed(2)}°
                    `);
            })
            .on('mousemove', (event) => {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', (event, d) => {
                d3.select(event.currentTarget)
                    .attr('r', d => Math.min(8, 3 + Math.log(d.count)))
                    .attr('stroke-width', 1)
                    .attr('opacity', 0.8);
                tooltip.style('display', 'none');
            });

        // Add labels for major places
        placeGroups.filter(d => d.verseCount > 50)
            .append('text')
            .attr('dx', 10)
            .attr('dy', 5)
            .attr('fill', '#00CED1')
            .attr('font-size', '10px')
            .text(d => d.places[0].displayTitle || d.places[0].kjvName || d.places[0].esvName);

        // Add title
        this.svg.append('text')
            .attr('x', width / 2)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FFD700')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text(`Biblical Places Map - ${places.length} Locations`);

        // Add legend
        this.addLegend(this.svg, width, height);

        // Add controls info
        this.svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '11px')
            .text('Scroll to zoom | Drag to pan | Hover over places for details');
    }

    drawSimpleMap(g) {
        // Draw simple Mediterranean coastlines and borders
        // This is a simplified representation - for production, use TopoJSON

        // Mediterranean Sea
        g.append('path')
            .attr('d', this.path({
                type: 'Polygon',
                coordinates: [[
                    [10, 30], [45, 30], [45, 45], [10, 45], [10, 30]
                ]]
            }))
            .attr('fill', '#2c3e50')
            .attr('stroke', '#34495e')
            .attr('opacity', 0.3);
    }

    groupPlacesByProximity(places) {
        // Group places that are very close together to avoid overlaps
        const grouped = [];
        const threshold = 0.1; // degrees

        places.forEach(place => {
            const lat = parseFloat(place.fields.latitude);
            const lon = parseFloat(place.fields.longitude);

            if (isNaN(lat) || isNaN(lon)) return;

            const existing = grouped.find(g =>
                Math.abs(g.latitude - lat) < threshold &&
                Math.abs(g.longitude - lon) < threshold
            );

            if (existing) {
                existing.places.push(place.fields);
                existing.count++;
                existing.verseCount += place.fields.verseCount || 0;
            } else {
                grouped.push({
                    latitude: lat,
                    longitude: lon,
                    featureType: place.fields.featureType,
                    places: [place.fields],
                    count: 1,
                    verseCount: place.fields.verseCount || 0
                });
            }
        });

        return grouped;
    }

    getPlaceColor(place) {
        const type = place.featureType;
        const colors = {
            'City': '#e74c3c',
            'Region': '#3498db',
            'Water': '#1abc9c',
            'Mountain': '#95a5a6',
            'River': '#16a085'
        };
        return colors[type] || '#00CED1';
    }

    addLegend(svg, width, height) {
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${height - 150})`);

        const types = [
            { type: 'City', color: '#e74c3c' },
            { type: 'Region', color: '#3498db' },
            { type: 'Water', color: '#1abc9c' },
            { type: 'Mountain', color: '#95a5a6' },
            { type: 'River', color: '#16a085' }
        ];

        const legendItems = legend.selectAll('.legend-item')
            .data(types)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('circle')
            .attr('r', 6)
            .attr('fill', d => d.color)
            .attr('stroke', '#FFD700')
            .attr('stroke-width', 1);

        legendItems.append('text')
            .attr('x', 12)
            .attr('y', 4)
            .attr('fill', '#00CED1')
            .attr('font-size', '12px')
            .text(d => d.type);
    }

    showLoading(container) {
        const width = container.node().getBoundingClientRect().width;
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', 600);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 300)
            .attr('text-anchor', 'middle')
            .attr('fill', '#00CED1')
            .attr('font-size', '18px')
            .text('Loading theographic data...');
    }

    showError(container, message) {
        const width = container.node().getBoundingClientRect().width;
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', 600);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 300)
            .attr('text-anchor', 'middle')
            .attr('fill', '#FF6B6B')
            .attr('font-size', '18px')
            .text(message);
    }

    applyFilters(filters) {
        this.render(filters);
    }
}
