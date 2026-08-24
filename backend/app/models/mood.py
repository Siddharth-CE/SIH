from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class MoodEntry(Base, TimestampMixin):
    __tablename__ = "mood_entries"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    mood = Column(String(32), nullable=False)  # 'happy', 'peaceful', 'thoughtful', 'tired', 'confused', 'anxious'
    note = Column(String(500), nullable=True)
    logged_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    logged_by = Column(String(32), default="patient", nullable=False)  # 'patient', 'caregiver', 'healthcare'

    patient = relationship("Patient", back_populates="mood_entries")
