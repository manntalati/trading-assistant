import os
import requests
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import List, Dict, Optional
import json
import time

load_dotenv()

class PolygonDataIngestion:
    def __init__(self):
        self.api_key = "Kn1GNp6uDK644ptyAlI5KNaLmeOjESap"
        self.base_url = "https://api.polygon.io"
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        })
    
    def get_daily_bars(self, ticker: str, date: str) -> Optional[Dict]:
        """Get daily OHLCV data for a specific date"""
        url = f"{self.base_url}/v2/aggs/ticker/{ticker}/range/1/day/{date}/{date}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_ticker_details(self, ticker: str) -> Optional[Dict]:
        """Get ticker details and metadata"""
        url = f"{self.base_url}/v3/reference/tickers/{ticker}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def get_news_articles(self, ticker: str, date: str) -> Optional[Dict]:
        """Get news articles for a ticker on a specific date"""
        url = f"{self.base_url}/v2/reference/news"
        params = {
            "ticker": ticker,
            "published_utc.gte": f"{date}T00:00:00Z",
            "published_utc.lte": f"{date}T23:59:59Z",
            "limit": 50
        }
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    # def get_earnings_calendar(self, date: str) -> Optional[Dict]:
    #     """Get earnings calendar for a specific date"""
    #     url = f"{self.base_url}/v3/reference/earnings"
    #     params = {
    #         "date": date,
    #         "limit": 100
    #     }
    #     response = self.session.get(url, params=params)
    #     response.raise_for_status()
    #     return response.json()
        
    
    def save_to_file(self, data: Dict, filename: str, directory: str = "data"):
        """Save data to a JSON file"""
        os.makedirs(directory, exist_ok=True)
        filepath = os.path.join(directory, filename)
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Data saved to {filepath}")
    
    def daily_workflow(self, tickers: List[str], date: str = None):
        """Run daily data ingestion workflow"""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        # Validate date is not in the future
        try:
            request_date = datetime.strptime(date, "%Y-%m-%d")
            today = datetime.now() - timedelta(days=1)
            if request_date > today:
                print(f"⚠️  Warning: Requested date {date} is in the future. Using yesterday's date instead.")
                date = (today - timedelta(days=1)).strftime("%Y-%m-%d")
        except ValueError:
            print(f"⚠️  Invalid date format: {date}. Using today's date.")
            date = datetime.now().strftime("%Y-%m-%d")
        
        print(f"Starting daily workflow for {date}")
        
        for ticker in tickers:
            print(f"Fetching daily bars for {ticker}...")
            bars_data = self.get_daily_bars(ticker, date)
            if bars_data:
                self.save_to_file(bars_data, f"{ticker}_daily_bars_{date}.json")
            
            time.sleep(0.1)
        
        for ticker in tickers:
            print(f"Fetching ticker details for {ticker}...")
            details_data = self.get_ticker_details(ticker)
            if details_data:
                self.save_to_file(details_data, f"{ticker}_details.json")
            
            time.sleep(0.1)
        
        for ticker in tickers:
            print(f"Fetching news for {ticker}...")
            news_data = self.get_news_articles(ticker, date)
            if news_data:
                self.save_to_file(news_data, f"{ticker}_news_{date}.json")
            
            time.sleep(0.1)
        
        print(f"Fetching earnings calendar for {date}...")
        earnings_data = self.get_earnings_calendar(date)
        if earnings_data:
            self.save_to_file(earnings_data, f"earnings_calendar_{date}.json")
        
        print("Daily workflow completed!")

if __name__ == "__main__":
    polygon_data = PolygonDataIngestion()
    watchlist = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]
    polygon_data.daily_workflow(watchlist) 