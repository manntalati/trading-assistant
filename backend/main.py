from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import os
from datetime import datetime, timedelta
import glob

app = FastAPI(title="Trading Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockPrice(BaseModel):
    ticker: str
    open: float
    close: float
    high: float
    low: float
    volume: int
    date: str
    change: float
    change_percent: float

class StockDetails(BaseModel):
    ticker: str
    name: str
    market_cap: float
    description: str
    sector: str
    employees: int
    website: str

class WatchlistResponse(BaseModel):
    stocks: List[StockPrice]
    last_updated: str

@app.get("/")
async def root():
    return {"message": "Trading Assistant API"}

@app.get("/api/watchlist")
async def get_watchlist():
    """Get current watchlist with latest prices"""
    data_dir = "data"
    watchlist = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]
    
    stocks = []
    
    for ticker in watchlist:
        pattern = f"{data_dir}/{ticker}_daily_bars_*.json"
        files = glob.glob(pattern)
        
        if not files:
            continue
            
        latest_file = max(files, key=os.path.getctime)
        
        try:
            with open(latest_file, 'r') as f:
                data = json.load(f)
                
            if data.get("results") and len(data["results"]) > 0:
                result = data["results"][0]
                
                change = 0.0
                change_percent = 0.0
                
                stock = StockPrice(
                    ticker=ticker,
                    open=result["o"],
                    close=result["c"],
                    high=result["h"],
                    low=result["l"],
                    volume=result["v"],
                    date=datetime.fromtimestamp(result["t"] / 1000).strftime("%Y-%m-%d"),
                    change=change,
                    change_percent=change_percent
                )
                stocks.append(stock)
                
        except Exception as e:
            print(f"Error processing {ticker}: {e}")
            continue
    
    return WatchlistResponse(
        stocks=stocks,
        last_updated=datetime.now().isoformat()
    )

@app.get("/api/stock/{ticker}")
async def get_stock_details(ticker: str):
    """Get detailed information for a specific stock"""
    data_dir = "data"
    
    details_file = f"{data_dir}/{ticker}_details.json"
    if not os.path.exists(details_file):
        raise HTTPException(status_code=404, detail="Stock details not found")
    
    try:
        with open(details_file, 'r') as f:
            details_data = json.load(f)
            
        results = details_data.get("results", {})
        
        stock_details = StockDetails(
            ticker=ticker,
            name=results.get("name", ticker),
            market_cap=results.get("market_cap", 0),
            description=results.get("description", ""),
            sector=results.get("sic_description", ""),
            employees=results.get("total_employees", 0),
            website=results.get("homepage_url", "")
        )
        
        return stock_details
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading stock details: {str(e)}")

@app.get("/api/stock/{ticker}/chart")
async def get_stock_chart(ticker: str, period: str = "1m"):
    """Get chart data for a specific stock and time period"""
    data_dir = "data"
    
    period_patterns = {
        "5d": f"{ticker}_daily_bars_*.json",
        "1m": f"{ticker}_daily_bars_*.json",
        "3m": f"{ticker}_daily_bars_*.json",
        "6m": f"{ticker}_daily_bars_*.json",
        "1y": f"{ticker}_daily_bars_*.json"
    }
    
    pattern = period_patterns.get(period, f"{ticker}_daily_bars_*.json")
    files = glob.glob(f"{data_dir}/{pattern}")
    
    if not files:
        raise HTTPException(status_code=404, detail="No chart data found")
    
    files.sort(key=os.path.getctime, reverse=True)
    
    chart_data = []
    
    for file_path in files[:30]:
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                
            if data.get("results") and len(data["results"]) > 0:
                result = data["results"][0]
                
                chart_data.append({
                    "date": datetime.fromtimestamp(result["t"] / 1000).strftime("%Y-%m-%d"),
                    "open": result["o"],
                    "close": result["c"],
                    "high": result["h"],
                    "low": result["l"],
                    "volume": result["v"]
                })
                
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            continue
    
    return {
        "ticker": ticker,
        "period": period,
        "data": chart_data
    }

@app.post("/api/watchlist/add")
async def add_to_watchlist(ticker: str):
    """Add a new stock to the watchlist"""
    # This would update the backend watchlist
    # For now, just return success
    return {"message": f"Added {ticker} to watchlist", "ticker": ticker}

@app.delete("/api/watchlist/{ticker}")
async def remove_from_watchlist(ticker: str):
    """Remove a stock from the watchlist"""
    # This would update the backend watchlist
    return {"message": f"Removed {ticker} from watchlist", "ticker": ticker}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
