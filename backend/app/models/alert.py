from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Alert(Base, TimestampMixin):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    patient_name = Column(String(255), nullable=False)
    type = Column(String(32), nullable=False)  # 'missed_medication', 'low_hydration', 'unusual_inactivity', 'sync_issue', 'appointment_approaching'
    severity = Column(String(32), default="info", nullable=False)  # 'info', 'warning', 'critical'
    title = Column(String(255), nullable=False)
    message = Column(String(500), nullable=False)
    action_required = Column(String(500), nullable=True)
    read = Column(Boolean, default=False, nullable=False)
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    patient = relationship("Patient", back_populates="alerts")
