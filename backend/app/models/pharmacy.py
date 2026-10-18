from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from app.core.database import Base

class PharmacyModel(Base):
    __tablename__ = "pharmacies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    owner_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, default="Pune")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    opening_time = Column(String, default="08:00 AM")
    closing_time = Column(String, default="10:00 PM")
    status = Column(String, default="Open") # 'Open' | 'Closed'
    distance = Column(String, nullable=True)
    rating = Column(Float, default=4.5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
