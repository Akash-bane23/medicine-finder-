from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from app.schemas.user import UserResponse

class LoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: Optional[bool] = False
    role: Optional[str] = "user"

class RegisterRequest(BaseModel):
    fullName: str
    email: str
    phone: Optional[str] = ""
    password: str
    dob: Optional[str] = None
    termsAccepted: Optional[bool] = True

class GoogleAuthRequest(BaseModel):
    credential: str

class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str

class AuthResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    token: Optional[str] = None
    user: Optional[UserResponse] = None
    requiresVerification: Optional[bool] = False

    model_config = ConfigDict(populate_by_name=True)

class AuthMeResponse(BaseModel):
    success: bool = True
    user: UserResponse

class GenericMessageResponse(BaseModel):
    success: bool = True
    message: str
