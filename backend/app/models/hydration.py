from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class HydrationLog(Base, TimestampMixin):
    __tablename__ = "hydration_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    amount_glasses = Column(Integer, default=1, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    date_logged = Column(Date, default=date.today, nullable=False, index=True)
    source = Column(String(32), default="patient", nullable=False)  # 'patient', 'voice', 'caregiver'

    patient = relationship("Patient", back_populates="hydration_logs")
