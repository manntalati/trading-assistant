import os
import sys
import json
from datetime import datetime, timedelta
from celery import Celery
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_ingestion.polygon_rest import PolygonDataIngestion
from notifications.email_notifier import EmailNotifier

load_dotenv()

celery_app = Celery('trading_assistant')
celery_app.config_from_object('celeryconfig')

@celery_app.task
def daily_data_ingestion_task(date: str = None):
    email_notifier = EmailNotifier()
    task_name = "Daily Data Ingestion"
    task_id = daily_data_ingestion_task.request.id if hasattr(daily_data_ingestion_task, 'request') else "manual"
    email_notifier.task_started(task_name, task_id)
    start_time = datetime.now()    
    
    polygon_data = PolygonDataIngestion()
    watchlist = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]
    polygon_data.daily_workflow(watchlist)
    end_time = datetime.now()
    duration = end_time - start_time
    result = {
        "status": "success", 
        "date": datetime.now().date().strftime("%Y-%m-%d"), 
        "tickers_processed": len(watchlist),
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "duration_seconds": duration.total_seconds()
    }

    email_notifier.task_completed(task_name, task_id, result, duration.total_seconds())
    return result
        
@celery_app.task
def historical_data_backfill_task(start_date: str, end_date: str, tickers: list = None):
    polygon_data = PolygonDataIngestion()
    if tickers is None:
        tickers = ["DE", "APPL", "AMD", "DELL", "FIG", "UBER", "MRVL", "CSCO", "VICI", "PUBM", "AVD", "PDSB", "QQQ", "VOO"]
    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
    current_dt = start_dt
    while current_dt <= end_dt:
        current_date = current_dt.strftime("%Y-%m-%d")
        polygon_data.daily_workflow(tickers, current_date)
        current_dt += timedelta(days=1)
    return {"status": "success", "start_date": start_date, "end_date": end_date}

@celery_app.task
def schedule_daily_data_ingestion():
    return daily_data_ingestion_task.delay()

@celery_app.task
def send_daily_summary():
    email_notifier = EmailNotifier()
    log_dir = "logs"
    executions = []
    errors = []
    
    if os.path.exists(os.path.join(log_dir, "task_executions.json")):
        try:
            with open(os.path.join(log_dir, "task_executions.json"), 'r') as f:
                executions = json.load(f)
        except:
            executions = []
    
    if os.path.exists(os.path.join(log_dir, "task_errors.json")):
        try:
            with open(os.path.join(log_dir, "task_errors.json"), 'r') as f:
                errors = json.load(f)
        except:
            errors = []
    
    email_notifier.daily_summary(executions, errors)
    return {"status": "success", "summary_sent": True}

if __name__ == "__main__":
    result = daily_data_ingestion_task()
    print(f"Task result: {result}") 