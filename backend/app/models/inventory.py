from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class InventoryModel(Base):
    __tablename__ = "inventory"

    id = Column(String, primary_key=True, index=True)
    pharmacy_id = Column(String, ForeignKey("pharmacies.id", ondelete="CASCADE"), index=True, nullable=False)
    medicine_id = Column(String, ForeignKey("medicines.id", ondelete="CASCADE"), index=True, nullable=False)
    medicine_name = Column(String, nullable=False)
    quantity = Column(Integer, default=0)
    status = Column(String, default="AVAILABLE") # 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK'
    price = Column(Float, default=50.0)
    last_updated = Column(String, default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
