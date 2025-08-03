#!/usr/bin/env python3
"""
Test script for Polygon REST API data ingestion
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_ingestion.polygon_rest import PolygonDataIngestion

load_dotenv()

def test_polygon_data_ingestion():
    """Test the Polygon data ingestion functionality"""
    
    # Check if API key is set (using the same hardcoded key as polygon_rest.py)
    api_key = "Kn1GNp6uDK644ptyAlI5KNaLmeOjESap"
    if not api_key:
        print("❌ API key not found")
        return False
    
    print("✅ Using hardcoded API key")
    
    # Initialize data ingestion
    polygon_data = PolygonDataIngestion()
    
    # Test with a single ticker first
    test_ticker = "AAPL"
    # Use yesterday's date to ensure we have data
    test_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    print(f"\n🧪 Testing data ingestion for {test_ticker} on {test_date}")
    
    # Test daily bars
    print("\n1. Testing daily bars...")
    bars_data = polygon_data.get_daily_bars(test_ticker, test_date)
    if bars_data:
        print(f"✅ Daily bars retrieved: {len(bars_data.get('results', []))} records")
        polygon_data.save_to_file(bars_data, f"{test_ticker}_test_bars_{test_date}.json")
    else:
        print("❌ Failed to retrieve daily bars")
        return False
    
    # Test ticker details
    print("\n2. Testing ticker details...")
    details_data = polygon_data.get_ticker_details(test_ticker)
    if details_data:
        print("✅ Ticker details retrieved")
        polygon_data.save_to_file(details_data, f"{test_ticker}_test_details.json")
    else:
        print("❌ Failed to retrieve ticker details")
        return False
    
    # Test news articles
    print("\n3. Testing news articles...")
    news_data = polygon_data.get_news_articles(test_ticker, test_date)
    if news_data:
        print(f"✅ News articles retrieved: {len(news_data.get('results', []))} articles")
        polygon_data.save_to_file(news_data, f"{test_ticker}_test_news_{test_date}.json")
    else:
        print("❌ Failed to retrieve news articles")
        return False
    
    # Test earnings calendar
    # print("\n4. Testing earnings calendar...")
    # earnings_data = polygon_data.get_earnings_calendar(test_date)
    # if earnings_data:
    #     print(f"✅ Earnings calendar retrieved: {len(earnings_data.get('results', []))} earnings")
    #     polygon_data.save_to_file(earnings_data, f"test_earnings_calendar_{test_date}.json")
    # else:
    #     print("❌ Failed to retrieve earnings calendar")
    #     return False
    
    print("\n🎉 All tests passed! Data ingestion is working correctly.")
    print(f"📁 Check the 'data' directory for saved JSON files")
    
    return True

def test_daily_workflow():
    """Test the complete daily workflow"""
    
    print("\n🔄 Testing complete daily workflow...")
    
    polygon_data = PolygonDataIngestion()
    
    # Use a smaller watchlist for testing
    test_watchlist = ["AAPL", "GOOGL", "MSFT"]
    
    try:
        polygon_data.daily_workflow(test_watchlist)
        print("✅ Daily workflow completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Daily workflow failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Polygon REST API Data Ingestion Tests")
    print("=" * 50)
    
    # Test individual components
    if test_polygon_data_ingestion():
        print("\n" + "=" * 50)
        
        # Test complete workflow
        test_daily_workflow()
    else:
        print("\n❌ Basic tests failed. Please check your API key and network connection.") 