import os
import sys
from datetime import datetime, timedelta
from celery import Celery
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_ingestion.polygon_rest import PolygonDataIngestion

load_dotenv()

celery_app = Celery('trading_assistant')
celery_app.config_from_object('celeryconfig')

@celery_app.task
def daily_data_ingestion_task(date: str = None):
    """
    Daily data ingestion task that runs automatically
    
    Args:
        date (str): Date in YYYY-MM-DD format. If None, uses today's date.
    """
    print(f"Starting daily data ingestion task for date: {date}")
    
    polygon_data = PolygonDataIngestion()
    
    watchlist = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]

    polygon_data.daily_workflow(watchlist, date)
    
    print("Daily data ingestion task completed successfully!")
    return {"status": "success", "date": date, "tickers_processed": len(watchlist)}
        
@celery_app.task
def historical_data_backfill_task(start_date: str, end_date: str, tickers: list = None):
    """
    Backfill historical data for a date range
    
    Args:
        start_date (str): Start date in YYYY-MM-DD format
        end_date (str): End date in YYYY-MM-DD format
        tickers (list): List of tickers to backfill. If None, uses default watchlist
    """
    print(f"Starting historical data backfill from {start_date} to {end_date}")
    
    polygon_data = PolygonDataIngestion()
    
    if tickers is None:
        tickers = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]

    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    
    current_dt = start_dt
    while current_dt <= end_dt:
        current_date = current_dt.strftime("%Y-%m-%d")
        print(f"Processing date: {current_date}")
        
        polygon_data.daily_workflow(tickers, current_date)
        
        current_dt += timedelta(days=1)
    
    print("Historical data backfill completed successfully!")
    return {"status": "success", "start_date": start_date, "end_date": end_date}

@celery_app.task
def schedule_daily_data_ingestion():
    """Schedule the daily data ingestion task"""
    return daily_data_ingestion_task.delay()

if __name__ == "__main__":
    result = daily_data_ingestion_task()
    print(f"Task result: {result}") 