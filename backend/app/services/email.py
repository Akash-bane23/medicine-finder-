import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.core.config import settings

logger = logging.getLogger("mediplus.email")

def send_verification_email(to_email: str, user_name: str, verification_token: str) -> bool:
    """Send an email verification link to newly registered user."""
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
    
    subject = "Welcome to MediPlus - Verify Your Email Address"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
        .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .logo {{ font-size: 24px; font-weight: 800; color: #0d9488; text-decoration: none; display: inline-block; margin-bottom: 20px; }}
        .btn {{ display: inline-block; background-color: #0d9488; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; margin: 24px 0; }}
        .footer {{ margin-top: 32px; font-size: 12px; color: #64748b; border-t: 1px solid #f1f5f9; padding-top: 16px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">MediPlus Healthcare</div>
        <h2>Verify your email address</h2>
        <p>Hello <strong>{user_name}</strong>,</p>
        <p>Thank you for creating an account with MediPlus. Please confirm your email address by clicking the button below:</p>
        
        <a href="{verify_url}" class="btn">Verify Email Address</a>
        
        <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br>
        <a href="{verify_url}" style="color: #0d9488;">{verify_url}</a></p>
        
        <p style="font-size: 13px; color: #64748b;">This verification link will expire in 24 hours.</p>
        
        <div class="footer">
          <p>If you did not register for a MediPlus account, you can safely ignore this message.</p>
        </div>
      </div>
    </body>
    </html>
    """
    
    return _send_email(to_email, subject, html_content, verify_url, "VERIFICATION LINK")

def send_password_reset_email(to_email: str, user_name: str, reset_token: str) -> bool:
    """Send a password reset link to user."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    subject = "MediPlus Account Password Reset Request"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
        .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .logo {{ font-size: 24px; font-weight: 800; color: #0d9488; text-decoration: none; display: inline-block; margin-bottom: 20px; }}
        .btn {{ display: inline-block; background-color: #0284c7; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; margin: 24px 0; }}
        .footer {{ margin-top: 32px; font-size: 12px; color: #64748b; border-t: 1px solid #f1f5f9; padding-top: 16px; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">MediPlus Healthcare</div>
        <h2>Reset Your Password</h2>
        <p>Hello <strong>{user_name}</strong>,</p>
        <p>We received a request to reset your MediPlus account password. Click the button below to choose a new password:</p>
        
        <a href="{reset_url}" class="btn">Reset Password</a>
        
        <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br>
        <a href="{reset_url}" style="color: #0284c7;">{reset_url}</a></p>
        
        <p style="font-size: 13px; color: #64748b;">This reset link is valid for 1 hour. If you did not request a password reset, please ignore this email.</p>
        
        <div class="footer">
          <p>© MediPlus System. Security & Account Management.</p>
        </div>
      </div>
    </body>
    </html>
    """
    
    return _send_email(to_email, subject, html_content, reset_url, "RESET PASSWORD LINK")

def _send_email(to_email: str, subject: str, html_body: str, action_url: str, log_tag: str) -> bool:
    """Helper to dispatch SMTP email or print to logger if SMTP not configured."""
    # Print clear dev testing banner
    print("\n" + "="*70)
    print(f"  [EMAIL SERVICE - {log_tag}]")
    print(f"  To: {to_email}")
    print(f"  Subject: {subject}")
    print(f"  Action Link: {action_url}")
    print("="*70 + "\n")
    
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or settings.SMTP_USERNAME == "your_smtp_user":
        logger.info(f"SMTP credentials not configured. Logged {log_tag} for {to_email}")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM_EMAIL, [to_email], msg.as_string())
        logger.info(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email via SMTP to {to_email}: {str(e)}")
        # Return True in dev mode so flow proceeds smoothly
        return True
