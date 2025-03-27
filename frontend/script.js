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
        
    }
});