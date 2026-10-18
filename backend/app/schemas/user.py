from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, Literal, Any

class UserBase(BaseModel):
    fullName: str = Field(..., alias="fullName")
    email: str
    phone: Optional[str] = "+91 98765 00000"
    role: Literal["user", "admin", "pharmacy"] = "user"
    status: Literal["active", "blocked", "inactive"] = "active"
    avatar: Optional[str] = None
    dob: Optional[str] = None
    emailVerified: bool = False
    authProvider: str = "local"

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class UserCreate(UserBase):
    password: Optional[str] = None

class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[Literal["user", "admin", "pharmacy"]] = None
    status: Optional[Literal["active", "blocked", "inactive"]] = None
    avatar: Optional[str] = None
    dob: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class UserStatusUpdate(BaseModel):
    status: Literal["active", "blocked", "inactive"]

class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str
    phone: Optional[str] = "+91 98765 00000"
    role: Literal["user", "admin", "pharmacy"] = "user"
    status: Literal["active", "blocked", "inactive"] = "active"
    avatar: Optional[str] = None
    dob: Optional[str] = None
    emailVerified: bool = False
    authProvider: str = "local"
    createdAt: str

    @model_validator(mode="before")
    @classmethod
    def convert_orm_attributes(cls, data: Any) -> Any:
        if hasattr(data, "__table__"):
            created_val = getattr(data, "created_at", "2026-01-01")
            if isinstance(created_val, str):
                created_str = created_val
            elif created_val:
                created_str = str(created_val).split(" ")[0]
            else:
                created_str = "2026-01-01"

            return {
                "id": str(data.id),
                "fullName": getattr(data, "full_name", str(data.email).split('@')[0]),
                "email": str(data.email),
                "phone": getattr(data, "phone", "+91 98765 00000") or "+91 98765 00000",
                "role": getattr(data, "role", "user") or "user",
                "status": getattr(data, "status", "active") or "active",
                "avatar": getattr(data, "avatar", None),
                "dob": getattr(data, "dob", None),
                "emailVerified": bool(getattr(data, "email_verified", False)),
                "authProvider": getattr(data, "auth_provider", "local") or "local",
                "createdAt": created_str
            }
        return data

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
