from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class DailyActivity(Base, TimestampMixin):
    __tablename__ = "daily_activities"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    time = Column(String(32), nullable=False)  # '07:30 AM'
    time_of_day = Column(String(32), nullable=False)  # 'morning', 'afternoon', 'evening', 'night'
    type = Column(String(32), nullable=False)  # 'morning_wake', 'meal', 'medication', 'game', 'social', 'sleep', 'general'
    default_title = Column(String(255), nullable=False)
    custom_title = Column(String(255), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    scheduled_for_date = Column(Date, default=date.today, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=True)
    notes = Column(String(500), nullable=True)

    patient = relationship("Patient", back_populates="activities")
