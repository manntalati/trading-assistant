import os
from dotenv import load_dotenv

load_dotenv()

broker_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
result_backend = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
task_serializer = 'json'
accept_content = ['json']
result_serializer = 'json'
timezone = 'America/New_York'
enable_utc = True

task_routes = {
    'tasks.daily_data_task.*': {'queue': 'data_ingestion'},
    'tasks.*': {'queue': 'default'},
}

task_always_eager = False
task_eager_propagates = True

worker_prefetch_multiplier = 1
worker_max_tasks_per_child = 1000

beat_schedule = {
    'daily-data-ingestion': {
        'task': 'tasks.daily_data_task.daily_data_ingestion_task',
        'schedule': 3600.0,  # Run every hour for testing
        # 'schedule': crontab(hour=18, minute=0),  # Run at 6 PM EST daily
        'args': (),
    },
}

result_expires = 3600

worker_log_format = '[%(asctime)s: %(levelname)s/%(processName)s] %(message)s'
worker_task_log_format = '[%(asctime)s: %(levelname)s/%(processName)s] [%(task_name)s(%(task_id)s)] %(message)s' 