function initializeScatterPlot(combinedData) {
    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = document.getElementById('scatter-plot').clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select('#scatter-plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = utils.createTooltip();

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(combinedData, d => d.search_volume)])
        .range([0, width])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(combinedData, d => d.sales_amount)])
        .range([height, 0])
        .nice();

    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', '#4b5563')
        .attr('text-anchor', 'middle')
        .text('Search Volume');

    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('fill', '#4b5563')
        .attr('text-anchor', 'middle')
        .text('Sales Amount ($)');

    // Calculate trend line
    const xValues = combinedData.map(d => d.search_volume);
    const yValues = combinedData.map(d => d.sales_amount);
    
    const regression = calculateRegression(xValues, yValues);
    const trendData = [
        { x: d3.min(xValues), y: regression.slope * d3.min(xValues) + regression.intercept },
        { x: d3.max(xValues), y: regression.slope * d3.max(xValues) + regression.intercept }
    ];

    // Add trend line
    svg.append('line')
        .attr('class', 'trend-line')
        .attr('x1', xScale(trendData[0].x))
        .attr('y1', yScale(trendData[0].y))
        .attr('x2', xScale(trendData[1].x))
        .attr('y2', yScale(trendData[1].y))
        .attr('stroke', '#9CA3AF')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    // Add scatter points
    svg.selectAll('circle')
        .data(combinedData)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => xScale(d.search_volume))
        .attr('cy', d => yScale(d.sales_amount))
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
                <div>Sales: ${utils.formatCurrency(d.sales_amount)}</div>
                <div>Search Volume: ${utils.formatNumber(d.search_volume)}</div>
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
        .attr('transform', `translate(${width - 100}, 20)`);

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
}

// Helper function to calculate linear regression
function calculateRegression(x, y) {
    const n = x.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        sumX += x[i];
        sumY += y[i];
        sumXY += x[i] * y[i];
        sumXX += x[i] * x[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}
