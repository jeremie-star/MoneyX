# **Money-X (Currency Exchange Rate Tracker)**

This is a currency exchange rate tracker application that fetches real-time exchange rates from an API and displays the historical exchange rates in a graphical chart. The app automatically identifies the most frequently traded currency pair and displays its historical data.

## **Features**
- Fetches exchange rates from an external API.
- Automatically identifies the most frequently traded currency pair.
- Displays the historical exchange rate for the most frequently traded currency pair over a specified number of days.
- Visualizes the historical data using a chart.

## **Tech Stack**
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: python
- **API**: RESTful API to fetch exchange rates and historical data

## **Installation**

### **Frontend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/jeremie-star/Money-X.git
   ```

2. Navigate to the project directory:
   ```bash
   cd frontend
   ```

3. Open `index.html` in a browser or use a local server to view the app.

### **Backend Setup (Optional)**
If you want to run the backend locally to serve exchange rate data:

1. Clone the backend repository (if separate) or navigate to your backend folder.
2. Install the required packages:
   ```bash
   npm install
   ```

3. Run the backend server:
   ```bash
   python3 main.py
   ```

4. The backend should be running on `http://localhost:8000`.

## **How It Works**

1. **Fetching Exchange Rates**:  
   The app fetches data from an external API that provides real-time exchange rates for various currencies.

2. **Identifying the Most Traded Currency Pair**:  
   The app analyzes the exchange rate data and identifies the most frequently traded currency pair based on the dataset.

3. **Displaying Historical Data**:  
   The app fetches and displays the historical exchange rates of the most traded currency pair. Users can specify the number of days for which they want to view the historical data.

4. **Rendering the Chart**:  
   The historical data is displayed using **Chart.js**, which allows users to visually analyze exchange rate trends over time.

## **API Endpoints**
The app communicates with the following API endpoints:

### `GET /exchange-rates`
- **Description**: Fetches the current exchange rates for all supported currencies.
- **Response**:  
   ```json
   [
     {
       "from_currency": "USD",
       "to_currency": "EUR",
       "rate": 0.84
     },
     {
       "from_currency": "GBP",
       "to_currency": "USD",
       "rate": 1.36
     }
   ]
   ```

### `POST /historical`
- **Description**: Fetches historical exchange rates for a specific currency pair over a set number of days.
- **Body**:
   ```json
   {
     "from_currency": "USD",
     "to_currency": "EUR",
     "days": 7
   }
   ```
- **Response**:  
   ```json
   [
     {
       "date": "2025-03-17",
       "rate": 0.84
     },
     {
       "date": "2025-03-16",
       "rate": 0.83
     }
   ]
   ```

## **Contributing**
Contributions are welcome! If you'd like to improve this project, feel free to fork the repository and create a pull request. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add your changes'`.
5. Push to your branch: `git push origin feature/your-feature-name`.
6. Create a pull request.

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **Acknowledgements**
- [Chart.js](https://www.chartjs.org/) for chart rendering.
- External currency exchange rate API used for real-time data.

---

You can replace the placeholders like "yourusername" with the actual GitHub username and adjust any other project-specific details. Let me know if you’d like to customize it further!
