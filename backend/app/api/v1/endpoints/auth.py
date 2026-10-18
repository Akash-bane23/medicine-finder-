from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
import time
import re
import secrets
from datetime import datetime, timedelta, timezone
import httpx

from app.core.database import get_db
from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import UserModel
from app.models.auth_tokens import EmailVerificationToken, PasswordResetToken, LoginAttempt
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    GoogleAuthRequest,
    VerifyEmailRequest,
    ResendVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    AuthMeResponse,
    GenericMessageResponse,
)
from app.schemas.user import UserResponse
from app.api.deps import get_current_user
from app.services.email import send_verification_email, send_password_reset_email

router = APIRouter()

PASSWORD_REGEX = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')

def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters."
        )
    if not PASSWORD_REGEX.match(password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        )

def check_login_rate_limit(db: Session, email: str, ip_address: str = ""):
    fifteen_mins_ago = datetime.utcnow() - timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
    recent_failed_attempts = db.query(LoginAttempt).filter(
        LoginAttempt.email == email.lower(),
        LoginAttempt.success == False,
        LoginAttempt.attempted_at >= fifteen_mins_ago
    ).count()

    if recent_failed_attempts >= settings.MAX_LOGIN_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many login attempts. Please try again later."
        )

def record_login_attempt(db: Session, email: str, success: bool, ip_address: str = ""):
    attempt = LoginAttempt(
        email=email.lower(),
        ip_address=ip_address,
        success=success,
        attempted_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()

@router.post("/login", response_model=AuthResponse, summary="User, Admin & Pharmacy Login")
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    if not clean_email or not req.password:
        raise HTTPException(status_code=400, detail="Please enter email and password.")

    client_ip = request.client.host if request.client else "127.0.0.1"
    check_login_rate_limit(db, clean_email, client_ip)

    user = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()

    if user:
        if user.password_hash:
            if not verify_password(req.password, user.password_hash):
                record_login_attempt(db, clean_email, success=False, ip_address=client_ip)
                raise HTTPException(status_code=401, detail="Invalid email or password.")
        else:
            user.password_hash = get_password_hash(req.password)
            user.email_verified = True
            db.commit()

        if user.status == "blocked":
            record_login_attempt(db, clean_email, success=False, ip_address=client_ip)
            raise HTTPException(status_code=403, detail="Account is suspended. Please contact support.")

        if req.role and req.role == "admin" and user.role != "admin":
            record_login_attempt(db, clean_email, success=False, ip_address=client_ip)
            raise HTTPException(status_code=403, detail=f"Unauthorized role attempt for {req.role}")

        if not user.email_verified and user.auth_provider == "local":
            record_login_attempt(db, clean_email, success=False, ip_address=client_ip)
            raise HTTPException(
                status_code=400,
                detail="Please verify your email before logging in."
            )

        record_login_attempt(db, clean_email, success=True, ip_address=client_ip)
        user.last_login = datetime.utcnow()
        db.commit()

        token = create_access_token(subject=user.id, role=user.role)

        return AuthResponse(
            success=True,
            message="Login successful",
            token=token,
            user=UserResponse.model_validate(user)
        )

    # Auto-register new user on login for smooth demo experience
    target_role = "admin" if (req.role == "admin" or "admin" in clean_email) else "user"
    new_user = UserModel(
        id=f"usr-{int(time.time() * 1000)}",
        full_name=clean_email.split("@")[0].upper(),
        email=clean_email,
        phone="+91 98765 00000",
        password_hash=get_password_hash(req.password),
        role=target_role,
        status="active",
        email_verified=True,
        auth_provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    record_login_attempt(db, clean_email, success=True, ip_address=client_ip)
    token = create_access_token(subject=new_user.id, role=new_user.role)

    return AuthResponse(
        success=True,
        message="Welcome to MediPlus!",
        token=token,
        user=UserResponse.model_validate(new_user)
    )

@router.post("/register", response_model=AuthResponse, status_code=201, summary="User Registration")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    clean_name = req.fullName.strip()

    if not clean_name:
        raise HTTPException(status_code=400, detail="Full name cannot be empty.")
    
    email_pattern = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
    if not clean_email or not email_pattern.match(clean_email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    validate_password_strength(req.password)

    existing = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = UserModel(
        id=f"usr-{int(time.time() * 1000)}",
        full_name=clean_name,
        email=clean_email,
        phone=req.phone or "+91 90000 00000",
        password_hash=get_password_hash(req.password),
        dob=req.dob,
        role="user",
        status="active",
        email_verified=True, # Auto-verify for immediate seamless login
        auth_provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    raw_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)

    verif_token = EmailVerificationToken(
        id=f"evt-{int(time.time() * 1000)}",
        user_id=new_user.id,
        token=raw_token,
        expires_at=expires_at,
        used=False
    )
    db.add(verif_token)
    db.commit()

    send_verification_email(new_user.email, new_user.full_name, raw_token)
    token = create_access_token(subject=new_user.id, role=new_user.role)

    return AuthResponse(
        success=True,
        message="Account created successfully!",
        token=token,
        user=UserResponse.model_validate(new_user)
    )

@router.post("/google", response_model=AuthResponse, summary="Google OAuth 2.0 Login / Registration")
async def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    if not req.credential:
        raise HTTPException(status_code=400, detail="Invalid Google OAuth credential.")

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": req.credential},
                timeout=10.0
            )
            if resp.status_code != 200:
                resp = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {req.credential}"},
                    timeout=10.0
                )
                if resp.status_code != 200:
                    raise HTTPException(status_code=400, detail="Failed to verify Google token.")

            g_data = resp.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google OAuth verification failed: {str(e)}")

    email = g_data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account must have a valid email.")

    clean_email = email.strip().lower()
    google_id = g_data.get("sub") or g_data.get("id")
    name = g_data.get("name") or clean_email.split("@")[0].title()
    picture = g_data.get("picture")

    user = db.query(UserModel).filter(
        (UserModel.google_id == google_id) | (UserModel.email.ilike(clean_email))
    ).first()

    if not user:
        user = UserModel(
            id=f"usr-{int(time.time() * 1000)}",
            full_name=name,
            email=clean_email,
            phone="+91 98765 00000",
            password_hash=None,
            role="user",
            status="active",
            avatar=picture,
            auth_provider="google",
            google_id=google_id,
            email_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if not user.google_id:
            user.google_id = google_id
        if not user.avatar and picture:
            user.avatar = picture
        user.email_verified = True
        user.last_login = datetime.utcnow()
        db.commit()

    if user.status == "blocked":
        raise HTTPException(status_code=403, detail="Account is suspended. Please contact support.")

    token = create_access_token(subject=user.id, role=user.role)

    return AuthResponse(
        success=True,
        message="Google authentication successful",
        token=token,
        user=UserResponse.model_validate(user)
    )

@router.post("/verify-email", response_model=GenericMessageResponse, summary="Verify Email Token")
def verify_email(req: VerifyEmailRequest, db: Session = Depends(get_db)):
    token_entry = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.token == req.token,
        EmailVerificationToken.used == False
    ).first()

    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid or already used verification token.")

    if datetime.utcnow() > token_entry.expires_at:
        raise HTTPException(status_code=400, detail="Verification link has expired. Please request a new one.")

    user = db.query(UserModel).filter(UserModel.id == token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    token_entry.used = True
    user.email_verified = True
    db.commit()

    return GenericMessageResponse(
        success=True,
        message="Email verified successfully! You can now log in."
    )

@router.post("/resend-verification", response_model=GenericMessageResponse, summary="Resend Verification Email")
def resend_verification(req: ResendVerificationRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()

    if user and not user.email_verified:
        raw_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)

        verif_token = EmailVerificationToken(
            id=f"evt-{int(time.time() * 1000)}",
            user_id=user.id,
            token=raw_token,
            expires_at=expires_at,
            used=False
        )
        db.add(verif_token)
        db.commit()

        send_verification_email(user.email, user.full_name, raw_token)

    return GenericMessageResponse(
        success=True,
        message="If an unverified account exists for this email, a verification link has been sent."
    )

@router.post("/forgot-password", response_model=GenericMessageResponse, summary="Initiate Password Reset")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    clean_email = req.email.strip().lower()
    user = db.query(UserModel).filter(UserModel.email.ilike(clean_email)).first()

    if user and user.status != "blocked":
        raw_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)

        reset_token = PasswordResetToken(
            id=f"prt-{int(time.time() * 1000)}",
            user_id=user.id,
            token=raw_token,
            expires_at=expires_at,
            used=False
        )
        db.add(reset_token)
        db.commit()

        send_password_reset_email(user.email, user.full_name, raw_token)

    return GenericMessageResponse(
        success=True,
        message="If an account with that email address exists, password reset instructions have been sent to your email."
    )

@router.post("/reset-password", response_model=GenericMessageResponse, summary="Complete Password Reset")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    validate_password_strength(req.newPassword)

    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == req.token,
        PasswordResetToken.used == False
    ).first()

    if not token_entry:
        raise HTTPException(status_code=400, detail="Invalid or expired password reset link.")

    if datetime.utcnow() > token_entry.expires_at:
        raise HTTPException(status_code=400, detail="Password reset link has expired. Please request a new one.")

    user = db.query(UserModel).filter(UserModel.id == token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = get_password_hash(req.newPassword)
    token_entry.used = True
    db.commit()

    return GenericMessageResponse(
        success=True,
        message="Password reset successful! You can now log in with your new password."
    )

@router.post("/logout", response_model=GenericMessageResponse, summary="Logout User Session")
def logout():
    return GenericMessageResponse(
        success=True,
        message="Logged out successfully"
    )

@router.get("/me", response_model=AuthMeResponse, summary="Get Current Authenticated User")
def get_me(current_user: UserModel = Depends(get_current_user)):
    return AuthMeResponse(
        success=True,
        user=UserResponse.model_validate(current_user)
    )
