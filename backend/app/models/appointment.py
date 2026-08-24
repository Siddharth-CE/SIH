from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Appointment(Base, TimestampMixin):
    __tablename__ = "appointments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    doctor_or_center_name = Column(String(255), nullable=False)
    datetime_scheduled = Column(DateTime(timezone=True), nullable=False, index=True)
    location = Column(String(255), nullable=False)
    notes = Column(String(500), nullable=True)
    status = Column(String(32), default="upcoming", nullable=False)  # 'upcoming', 'completed', 'cancelled'

    patient = relationship("Patient", back_populates="appointments")
