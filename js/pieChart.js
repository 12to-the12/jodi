function initializePieCharts(salesData, searchData) {
    // Set up dimensions
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    function createPieChart(data, containerId, valueKey) {
        // Create SVG
        const svg = d3.select(containerId)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Create tooltip
        const tooltip = utils.createTooltip();

        // Aggregate data by category
        const aggregatedData = d3.rollup(
            data,
            v => d3.sum(v, d => d[valueKey]),
            d => d.category
        );

        // Convert Map to array of objects
        const pieData = Array.from(aggregatedData, ([category, value]) => ({
            category,
            value
        }));

        // Create pie layout
        const pie = d3.pie()
            .value(d => d.value)
            .sort(null);

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius - 10);

        // Create pie slices
        const slices = svg.selectAll('path')
            .data(pie(pieData))
            .enter()
            .append('path')
            .attr('class', 'pie-slice')
            .attr('d', arc)
            .attr('fill', d => utils.colors[d.data.category.toLowerCase()])
            .on('mouseover', function(event, d) {
                const percentage = (d.data.value / d3.sum(pieData, d => d.value) * 100).toFixed(1);
                const html = `
                    <div class="font-bold">${d.data.category}</div>
                    <div>${valueKey === 'sales_amount' 
                        ? utils.formatCurrency(d.data.value)
                        : utils.formatNumber(d.data.value)}</div>
                    <div>${percentage}%</div>
                `;
                utils.showTooltip(tooltip, html, event);
            })
            .on('mouseout', () => utils.hideTooltip(tooltip));

        // Add labels
        const labelArc = d3.arc()
            .innerRadius(radius - 40)
            .outerRadius(radius - 40);

        svg.selectAll('text')
            .data(pie(pieData))
            .enter()
            .append('text')
            .attr('transform', d => `translate(${labelArc.centroid(d)})`)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#4b5563')
            .attr('font-size', '12px')
            .text(d => {
                const percentage = (d.data.value / d3.sum(pieData, d => d.value) * 100).toFixed(0);
                return percentage > 5 ? `${percentage}%` : '';
            });
    }

    // Create both pie charts
    createPieChart(salesData, '#sales-pie-chart', 'sales_amount');
    createPieChart(searchData, '#trends-pie-chart', 'search_volume');
}
