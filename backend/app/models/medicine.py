from sqlalchemy import Column, String, Float, Boolean, Integer, Text, DateTime
from datetime import datetime
from app.core.database import Base

class MedicineModel(Base):
    __tablename__ = "medicines"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    generic_name = Column(String, index=True, nullable=False)
    brand_name = Column(String, index=True, nullable=False)
    manufacturer = Column(String, nullable=False)
    category = Column(String, index=True, nullable=False)
    dosage_form = Column(String, nullable=False)
    strength = Column(String, nullable=False)
    uses = Column(Text, nullable=False)
    precautions = Column(Text, nullable=False)
    side_effects = Column(Text, nullable=False)
    storage = Column(Text, nullable=False)
    prescription_required = Column(Boolean, default=False)
    availability_status = Column(String, default="AVAILABLE") # 'AVAILABLE' | 'LOW STOCK' | 'OUT OF STOCK'
    price = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    drug_interactions = Column(Text, nullable=True)
    stock_count = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
