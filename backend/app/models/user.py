from sqlalchemy import Column, String, DateTime, Boolean
from datetime import datetime, timezone
from app.core.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=True) # Nullable for OAuth-only users
    dob = Column(String, nullable=True)
    role = Column(String, default="user") # 'user' | 'admin' | 'pharmacy'
    status = Column(String, default="active") # 'active' | 'blocked' | 'inactive'
    avatar = Column(String, nullable=True)
    auth_provider = Column(String, default="local") # 'local' | 'google'
    google_id = Column(String, nullable=True, index=True)
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
