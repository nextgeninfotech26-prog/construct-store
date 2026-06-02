import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# smki qpje djbc zkef

load_dotenv()

EMAIL = os.getenv("EMAIL")

APP_PASSWORD = os.getenv("APP_PASSWORD")

def send_email(to_email, subject, body):

    msg = MIMEMultipart()

    msg["From"] = EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587
    )

    server.starttls()

    server.login(
        EMAIL,
        APP_PASSWORD
    )

    server.sendmail(
        EMAIL,
        to_email,
        msg.as_string()
    )

    server.quit()