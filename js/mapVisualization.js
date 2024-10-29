function initializeMap(salesData, searchData) {
    // Set up dimensions
    const width = document.getElementById('map-visualization').clientWidth;
    const height = 400;
    
    // Create SVG
    const svg = d3.select('#map-visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create tooltip
    const tooltip = utils.createTooltip();

    // Create projection
    const projection = d3.geoAlbersUsa()
        .scale(width)
        .translate([width / 2, height / 2]);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Load US map data
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
        .then(us => {
            // Draw base map
            svg.append('g')
                .selectAll('path')
                .data(topojson.feature(us, us.objects.states).features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'state')
                .attr('fill', '#f3f4f6')
                .attr('stroke', '#d1d5db')
                .attr('stroke-width', 0.5);

            // Plot sales data
            svg.selectAll('.sales-point')
                .data(salesData)
                .enter()
                .append('circle')
                .attr('class', 'data-point sales-point')
                .attr('cx', d => projection([d.longitude, d.latitude])[0])
                .attr('cy', d => projection([d.longitude, d.latitude])[1])
                .attr('r', 5)
                .attr('fill', d => utils.colors[d.category.toLowerCase()])
                .attr('opacity', 0.7)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .attr('opacity', 1)
                        .attr('r', 8);

                    const html = `
                        <div class="font-bold">${d.category}</div>
                        <div>State: ${d.state}</div>
                        <div>Units Sold: ${utils.formatNumber(d.units_sold)}</div>
                        <div>Sales: ${utils.formatCurrency(d.sales_amount)}</div>
                        <div>Date: ${d.date}</div>
                    `;
                    utils.showTooltip(tooltip, html, event);
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .attr('opacity', 0.7)
                        .attr('r', 5);
                    utils.hideTooltip(tooltip);
                });

            // Add legend
            const legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(${width - 120}, 20)`);

            Object.entries(utils.colors).forEach(([category, color], i) => {
                const legendRow = legend.append('g')
                    .attr('transform', `translate(0, ${i * 20})`);

                legendRow.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 5)
                    .attr('fill', color);

                legendRow.append('text')
                    .attr('x', 10)
                    .attr('y', 4)
                    .text(category.charAt(0).toUpperCase() + category.slice(1))
                    .attr('font-size', '12px')
                    .attr('fill', '#4b5563');
            });
        });
}
