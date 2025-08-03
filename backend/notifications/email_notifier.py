import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class EmailNotifier:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.sender_email = os.getenv('SENDER_EMAIL')
        self.sender_password = os.getenv('SENDER_PASSWORD')
        self.recipient_email = os.getenv('RECIPIENT_EMAIL')
    
    def send_email(self, subject, body, is_html=False):
        msg = MIMEMultipart('alternative')
        msg['From'] = self.sender_email
        msg['To'] = self.recipient_email
        msg['Subject'] = subject
        
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(self.smtp_server, self.smtp_port)
        server.starttls()
        server.login(self.sender_email, self.sender_password)
        server.send_message(msg)
        server.quit()
        return True
    
    def task_started(self, task_name, task_id):
        subject = f"🚀 Trading Assistant: {task_name} Started"
        body = f"""
        <html>
        <body>
            <h2>Task Started</h2>
            <p><strong>Task:</strong> {task_name}</p>
            <p><strong>Task ID:</strong> {task_id}</p>
            <p><strong>Start Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p><strong>Status:</strong> 🟡 Running</p>
        </body>
        </html>
        """
        return self.send_email(subject, body, is_html=True)
    
    def task_completed(self, task_name, task_id, result, duration):
        subject = f"✅ Trading Assistant: {task_name} Completed"
        duration_str = f"{duration:.1f} seconds"
        
        body = f"""
        <html>
        <body>
            <h2>Task Completed Successfully</h2>
            <p><strong>Task:</strong> {task_name}</p>
            <p><strong>Task ID:</strong> {task_id}</p>
            <p><strong>Completion Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p><strong>Duration:</strong> {duration_str}</p>
            <p><strong>Status:</strong> 🟢 Success</p>
            
            <h3>Results:</h3>
            <ul>
                <li>Date processed: {result.get('date', 'Unknown')}</li>
                <li>Tickers processed: {result.get('tickers_processed', 0)}</li>
                <li>Status: {result.get('status', 'Unknown')}</li>
            </ul>
        </body>
        </html>
        """
        return self.send_email(subject, body, is_html=True)
    
    def task_failed(self, task_name, task_id, error_msg):
        subject = f"❌ Trading Assistant: {task_name} Failed"
        body = f"""
        <html>
        <body>
            <h2>Task Failed</h2>
            <p><strong>Task:</strong> {task_name}</p>
            <p><strong>Task ID:</strong> {task_id}</p>
            <p><strong>Failure Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p><strong>Status:</strong> 🔴 Failed</p>
            
            <h3>Error Details:</h3>
            <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">{error_msg}</pre>
        </body>
        </html>
        """
        return self.send_email(subject, body, is_html=True)
    
    def daily_summary(self, executions, errors):
        subject = f"📊 Trading Assistant: Daily Summary - {datetime.now().strftime('%Y-%m-%d')}"
        today = datetime.now().date()
        today_executions = [e for e in executions if datetime.fromisoformat(e['timestamp']).date() == today]
        today_errors = [e for e in errors if datetime.fromisoformat(e['timestamp']).date() == today]
        body = f"""
        <html>
        <body>
            <h2>Daily Task Summary</h2>
            <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d')}</p>
            
            <h3>Today's Activity:</h3>
            <ul>
                <li>✅ Successful executions: {len(today_executions)}</li>
                <li>❌ Errors: {len(today_errors)}</li>
            </ul>
            
            <h3>Recent Executions:</h3>
            <ul>
        """
        for execution in today_executions[-3:]:
            result = execution['result']
            timestamp = execution['timestamp']
            body += f"""
                <li>{timestamp} - {result.get('tickers_processed', 0)} tickers processed 
                     ({result.get('duration_seconds', 0):.1f}s)</li>
            """
        body += """
            </ul>
        </body>
        </html>
        """
        return self.send_email(subject, body, is_html=True) 