from sqlalchemy import Column, String, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base

class SearchHistoryModel(Base):
    __tablename__ = "search_history"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True, index=True)
    query = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
