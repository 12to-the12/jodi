class DataLoader {
    constructor() {
        this.states = [
            { name: 'California', lat: 36.7783, lng: -119.4179 },
            { name: 'Texas', lat: 31.9686, lng: -99.9018 },
            { name: 'Florida', lat: 27.6648, lng: -81.5158 },
            // Add more states as needed
        ];
        
        this.categories = ['Sneakers', 'Boots', 'Sandals'];
        this.prices = {
            'Sneakers': 50,
            'Boots': 80,
            'Sandals': 30
        };
    }

    generateRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    generateSalesData() {
        const startDate = new Date('2023-10-01');
        const endDate = new Date('2023-10-30');
        const salesData = [];

        for (let i = 0; i < 100; i++) {
            const state = this.states[Math.floor(Math.random() * this.states.length)];
            const category = this.categories[Math.floor(Math.random() * this.categories.length)];
            const units = Math.floor(Math.random() * (200 - 50 + 1)) + 50; // 50 to 200 units

            salesData.push({
                product_id: `SKU${10000 + i}`,
                product_name: category,
                category: category,
                units_sold: units,
                sales_amount: units * this.prices[category],
                date: this.generateRandomDate(startDate, endDate).toISOString().split('T')[0],
                state: state.name,
                latitude: state.lat,
                longitude: state.lng
            });
        }

        return salesData;
    }

    generateSearchData() {
        const startDate = new Date('2023-10-01');
        const endDate = new Date('2023-10-30');
        const searchData = [];

        for (let i = 0; i < 100; i++) {
            const state = this.states[Math.floor(Math.random() * this.states.length)];
            const category = this.categories[Math.floor(Math.random() * this.categories.length)];

            searchData.push({
                search_term: category,
                category: category,
                search_volume: Math.floor(Math.random() * (7000 - 1000 + 1)) + 1000, // 1000 to 7000 searches
                date: this.generateRandomDate(startDate, endDate).toISOString().split('T')[0],
                state: state.name,
                latitude: state.lat,
                longitude: state.lng
            });
        }

        return searchData;
    }

    async loadData() {
        // In a real application, this would fetch from JSON files
        // For demo purposes, we'll generate the data
        const salesData = this.generateSalesData();
        const searchData = this.generateSearchData();

        // Combine data for scatter plot
        const combinedData = this.combineData(salesData, searchData);

        return {
            salesData,
            searchData,
            combinedData
        };
    }

    combineData(salesData, searchData) {
        // Group data by date and state for comparison
        const combined = [];
        
        salesData.forEach(sale => {
            const matchingSearch = searchData.find(search => 
                search.date === sale.date && 
                search.state === sale.state &&
                search.category === sale.category
            );

            if (matchingSearch) {
                combined.push({
                    date: sale.date,
                    state: sale.state,
                    category: sale.category,
                    sales_amount: sale.sales_amount,
                    units_sold: sale.units_sold,
                    search_volume: matchingSearch.search_volume
                });
            }
        });

        return combined;
    }
}

// Export the DataLoader instance
const dataLoader = new DataLoader();
