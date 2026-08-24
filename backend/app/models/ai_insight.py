from datetime import datetime, timezone
from sqlalchemy import Column, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class AIInsight(Base, TimestampMixin):
    __tablename__ = "ai_insights"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(String(1000), nullable=False)
    recommendation = Column(String(1000), nullable=False)
    confidence_score = Column(Float, default=0.92, nullable=False)
    generated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    is_clinical_flag = Column(String(32), default="routine_positive", nullable=False)

    patient = relationship("Patient", back_populates="ai_insights")
