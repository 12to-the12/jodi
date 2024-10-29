async function initializeApp() {
    try {
        // Load data
        const { salesData, searchData, combinedData } = await dataLoader.loadData();

        // Initialize visualizations
        initializeMap(salesData, searchData);
        initializePieCharts(salesData, searchData);
        initializeScatterPlot(combinedData);

    } catch (error) {
        console.error('Error initializing application:', error);
        // In a production app, we'd want to show a user-friendly error message
    }
}

// Start the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
