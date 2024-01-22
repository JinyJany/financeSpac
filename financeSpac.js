const axios = require('axios');

// Function to calculate the stochasticity
function calculateStochasticity(data) {
    const closePrices = data.map(item => parseFloat(item['4. close']));
    const lowestLow = Math.min(...closePrices);
    const highestHigh = Math.max(...closePrices);
    const currentClose = closePrices[closePrices.length - 1];

    const stochasticity = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    return stochasticity.toFixed(2);
}

// Function to get historical data
async function calculateMovingAveragesAndStochasticity(symbol) {
    try {
        const apiKey = 'YOUR_API_KEY'; // Replace with your Alpha Vantage API key
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=daily&outputsize=full&apikey=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data['Time Series (Daily)'];
        const dates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
        const last200Days = dates.slice(-448);
        console.log('howtolen', last200Days.length);

        const historicalData = last200Days.map(date => ({
            date,
            ...data[date]
        }));

        const movingAverages = {
            '20-day': calculateMovingAverage(historicalData.slice(-20)),
            '60-day': calculateMovingAverage(historicalData.slice(-60)),
            '112-day': calculateMovingAverage(historicalData.slice(-112)),
            '120-day': calculateMovingAverage(historicalData.slice(-120)),
            '200-day': calculateMovingAverage(historicalData.slice(-200)),
            '224-day': calculateMovingAverage(historicalData.slice(-224)),
            '448-day': calculateMovingAverage(historicalData.slice(-448))
        };

        const latestDate = last200Days[last200Days.length - 1];
        const latestClosePrice = parseFloat(data[latestDate]['4. close']);
        // const stochasticity = ((latestClosePrice - Math.min(...historicalData.map(item => parseFloat(item['4. close'])))) / (Math.max(...historicalData.map(item => parseFloat(item['4. close']))) - Math.min(...historicalData.map(item => parseFloat(item['4. close']))))) * 100;

        const results = {
            'based Date': latestDate,
            'based Price': latestClosePrice,
            '20-day moving average': movingAverages['20-day'],
            '60-day moving average': movingAverages['60-day'],
            '112-day moving average': movingAverages['112-day'],
            '120-day moving average': movingAverages['120-day'],
            '200-day moving average': movingAverages['200-day'],
            '224-day moving average': movingAverages['224-day'],
            '448-day moving average': movingAverages['448-day'],
            '20-day moving average ratio': ((latestClosePrice / movingAverages['20-day']) * 100).toFixed(2),
            '60-day moving average ratio': ((latestClosePrice / movingAverages['60-day']) * 100).toFixed(2),
            '112-day moving average ratio': ((latestClosePrice / movingAverages['112-day']) * 100).toFixed(2),
            '120-day moving average ratio': ((latestClosePrice / movingAverages['120-day']) * 100).toFixed(2),            
            '200-day moving average ratio': ((latestClosePrice / movingAverages['200-day']) * 100).toFixed(2),            
            '224-day moving average ratio': ((latestClosePrice / movingAverages['224-day']) * 100).toFixed(2),                        
            '448-day moving average ratio': ((latestClosePrice / movingAverages['448-day']) * 100).toFixed(2)
        };

        // console.log(`Latest date of reference data: ${latestDate}`);
        // console.log('lastestClosePrice', latestClosePrice);
        console.log(`Results for ${symbol}:`, results);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function calculateMovingAverage(data) {
    const closePrices = data.map(item => parseFloat(item['4. close']));
    const sum = closePrices.reduce((total, price) => total + price, 0);
    const movingAverage = sum / closePrices.length;
    return movingAverage.toFixed(2);
}

// Usage
calculateMovingAveragesAndStochasticity('QQQ', 'daily', 'full');
