from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Currency Exchange API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ConversionRequest(BaseModel):
    from_currency: str
    to_currency: str
    amount: float

class HistoricalRateRequest(BaseModel):
    from_currency: str
    to_currency: str
    days: int = 30

# Exchange rate API configuration
EXCHANGE_API_KEY = os.getenv("EXCHANGE_API_KEY")  # Load API key from environment variable
EXCHANGE_API_BASE_URL = "https://v6.exchangerate-api.com/v6"  # Correct API base URL

# Common currencies fallback list
COMMON_CURRENCIES = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", 
    "HKD", "NZD", "SEK", "KRW", "SGD", "NOK", "MXN", "INR",
    "RUB", "ZAR", "TRY", "BRL", "TWD", "DKK", "PLN", "THB",
    "IDR", "HUF", "CZK", "ILS", "CLP", "PHP", "AED", "COP",
    "SAR", "MYR", "RON", 'RWF'
]

@app.get("/")
async def read_root():
    return {"message": "Welcome to Currency Exchange API"}

@app.post("/convert")
async def convert_currency(request: ConversionRequest):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{EXCHANGE_API_BASE_URL}/{EXCHANGE_API_KEY}/pair/{request.from_currency}/{request.to_currency}"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch exchange rate")

            data = response.json()
            print("API Response:", data)  # Debugging print

            # Ensure response contains the expected key
            if not isinstance(data, dict) or "conversion_rate" not in data:
                raise HTTPException(status_code=400, detail="Invalid response format from API")

            rate = data["conversion_rate"]

            result = request.amount * rate
            return {
                "from": request.from_currency,
                "to": request.to_currency,
                "amount": request.amount,
                "rate": rate,
                "result": result
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/historical")
async def get_historical_rates(request: HistoricalRateRequest):
    try:
        historical_data = []
        async with httpx.AsyncClient() as client:
            for days_ago in range(request.days):
                date = datetime.now() - timedelta(days=days_ago)  # Fixed this line
                date_str = date.strftime("%Y-%m-%d")

                # Correct endpoint format for historical data
                response = await client.get(
                    f"{EXCHANGE_API_BASE_URL}/{EXCHANGE_API_KEY}/historical/{date_str}",
                    params={
                        "base": request.from_currency,
                        "symbols": request.to_currency
                    }
                )

                if response.status_code == 200:
                    data = response.json()
                    if "conversion_rates" in data:
                        rate = data["conversion_rates"].get(request.to_currency)
                        if rate:
                            historical_data.append({
                                "date": date_str,
                                "rate": rate
                            })

        return historical_data if historical_data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/currencies")
async def get_available_currencies():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{EXCHANGE_API_BASE_URL}/{EXCHANGE_API_KEY}/latest",
                params={
                    "base": "USD"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if "conversion_rates" in data:
                    currencies = list(data["conversion_rates"].keys())
                    return {"currencies": currencies}
            
            # Fallback to common currencies if API fails
            return {"currencies": COMMON_CURRENCIES}
                
    except Exception as e:
        print(f"Server error: {e}")
        return {"currencies": COMMON_CURRENCIES}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
