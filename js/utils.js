const utils = {
    // Color schemes for different categories
    colors: {
        sneakers: '#3B82F6', // blue
        boots: '#EF4444',    // red
        sandals: '#10B981'   // green
    },

    // Format numbers with commas
    formatNumber: (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    },

    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Create tooltip
    createTooltip: () => {
        return d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    },

    // Show tooltip
    showTooltip: (tooltip, html, event) => {
        tooltip
            .html(html)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    },

    // Hide tooltip
    hideTooltip: (tooltip) => {
        tooltip
            .transition()
            .duration(200)
            .style('opacity', 0);
    }
};
