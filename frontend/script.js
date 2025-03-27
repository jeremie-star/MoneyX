document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-currencies');
    const historicalBtn = document.getElementById('historical-btn');
    const historicalDaysInput = document.getElementById('historical-days');
    const conversionResult = document.getElementById('conversion-result');
    const chartContainer = document.getElementById('chart-container');
    
    // Result elements
    const fromAmountSpan = document.getElementById('from-amount');
    const fromCurrSpan = document.getElementById('from-curr');
    const toAmountSpan = document.getElementById('to-amount');
    const toCurrSpan = document.getElementById('to-curr');
    const rateFromSpan = document.getElementById('rate-from');
    const rateToSpan = document.getElementById('rate-to');
    const rateValueSpan = document.getElementById('rate-value');
    
    let historicalChart = null;
    
    // Initialize the app
    await initApp();
    
    // Event Listeners
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    historicalBtn.addEventListener('click', showHistoricalData);
    
    // Initialize the application
    async function initApp() {
        try {
            console.log("Initializing app...");
            const apiKey = '3842e4587c7db7b02e1d0862';
            // First try to load currencies from backend
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
            
            console.log("Currency response status:", response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error fetching currencies:", errorText);
                throw new Error('Failed to fetch currencies from server');
            }
            
            const data = await response.json();
            console.log("Received currency data:", data);
            
            if (!data.currencies || data.currencies.length === 0) {
                console.warn("No currencies received, using fallback");
                data.currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD','RWF'];
            }
            
            // Clear existing options
            fromCurrencySelect.innerHTML = '';
            toCurrencySelect.innerHTML = '';
            
            // Populate currency dropdowns
            data.currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                
                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                
                fromCurrencySelect.appendChild(option1);
                toCurrencySelect.appendChild(option2);
            });
            
            // Set default values
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'EUR';
            amountInput.value = '0';
            
            console.log("App initialized successfully");
            
        } catch (error) {
            console.error('Error initializing app:', error);
            alert(`Error loading currency data: ${error.message}\nUsing default currencies.`);
            
            // Fallback UI with basic currencies
            const fallbackCurrencies = ['USD', 'EUR', 'GBP', 'RWF'];
            fallbackCurrencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                
                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                
                fromCurrencySelect.appendChild(option1);
                toCurrencySelect.appendChild(option2);
            });
            
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'EUR';
        }
    }
    
 // Convert currency
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive amount');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        alert('Please select different currencies');
        return;
    }
    
    try {
        console.log(`Converting ${amount} ${fromCurrency} to ${toCurrency}`);
        const apiKey = '3842e4587c7db7b02e1d0862';
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Conversion error response:", errorData);
            throw new Error(errorData.detail || 'Conversion failed');
        }
        
        const data = await response.json();
        console.log("Full API response:", data);  // Log the full response
        
        // Check if the conversion_result field exists and is a valid number
        if (data.conversion_result && !isNaN(data.conversion_result)) {
            // Display results
            fromAmountSpan.textContent = amount.toFixed(2);
            fromCurrSpan.textContent = fromCurrency;
            toAmountSpan.textContent = data.conversion_result.toFixed(2); // Use conversion_result here
            toCurrSpan.textContent = toCurrency;
            rateFromSpan.textContent = fromCurrency;
            rateToSpan.textContent = toCurrency;
            rateValueSpan.textContent = data.conversion_rate.toFixed(6); // Use conversion_rate here
            
            conversionResult.classList.remove('hidden');
        } else {
            console.error("Unexpected API response format:", data);
            throw new Error('Invalid conversion result');
        }
        
    } catch (error) {
        console.error('Conversion error:', error);
        alert(`Error converting currency: ${error.message}`);
    }
}

    // Swap currencies
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        
        // If we have a result displayed, convert immediately
        if (!conversionResult.classList.contains('hidden')) {
            convertCurrency();
        }
    }
    
    // Show historical data
    async function showHistoricalData() {
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const days = parseInt(historicalDaysInput.value);
        
        if (isNaN(days)) {
            alert('Please enter a valid number of days');
            return;
        }
        
        if (fromCurrency === toCurrency) {
            alert('Please select different currencies');
            return;
        }
        
        try {
            console.log(`Fetching historical data for ${fromCurrency}-${toCurrency} for ${days} days`);
            
            const response = await fetch('http://3.83.255.189:8000/historical', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from_currency: fromCurrency,
                    to_currency: toCurrency,
                    days: days
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Historical data error response:", errorData);
                throw new Error(errorData.detail || 'Failed to fetch historical data');
            }
            
            const historicalData = await response.json();
            console.log("Received historical data:", historicalData);
            
            if (Array.isArray(historicalData)) {
                const labels = historicalData.map(item => item.date);
                const rates = historicalData.map(item => item.rate);
                renderChart(labels, rates, fromCurrency, toCurrency);
            } else {
                console.error("Expected an array but received:", historicalData);
                alert("Error: No historical data available.");
            }
            
            
        } catch (error) {
            console.error('Historical data error:', error);
            alert(`Error: ${error.message}`);
        }
    }
    
    // Render chart
    function renderChart(labels, data, fromCurrency, toCurrency) {
        const ctx = document.getElementById('historical-chart').getContext('2d');
        
        // Destroy previous chart if exists
        if (historicalChart) {
            historicalChart.destroy();
        }
        
        historicalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(), // Show oldest to newest
                datasets: [{
                    label: `${fromCurrency} to ${toCurrency} Exchange Rate`,
                    data: data.reverse(),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#3498db',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Exchange Rate'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `1 ${fromCurrency} = ${context.parsed.y.toFixed(6)} ${toCurrency}`;
                            }
                        }
                    }
                }
            }
        });
        
        chartContainer.classList.remove('hidden');
    }
});