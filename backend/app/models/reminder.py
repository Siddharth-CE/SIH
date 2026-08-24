from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Boolean, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Reminder(Base, TimestampMixin):
    __tablename__ = "reminders"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(32), nullable=False)  # 'medication', 'hydration', 'activity', 'appointment', 'family'
    time = Column(String(32), nullable=False)  # '09:00 AM'
    time_of_day = Column(String(32), nullable=False)  # 'morning', 'afternoon', 'evening', 'night'
    dosage_or_instruction = Column(String(500), nullable=True)
    status = Column(String(32), default="pending", nullable=False)  # 'pending', 'completed', 'snoozed', 'missed'
    scheduled_for_date = Column(Date, default=date.today, nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    snoozed_until = Column(DateTime(timezone=True), nullable=True)

    patient = relationship("Patient", back_populates="reminders")


class Medication(Base, TimestampMixin):
    __tablename__ = "medications"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    dosage_description = Column(String(255), nullable=False)
    schedule_times = Column(String(255), nullable=False)  # e.g., '09:00 AM, 08:30 PM'
    prescribed_by = Column(String(255), nullable=True)
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
