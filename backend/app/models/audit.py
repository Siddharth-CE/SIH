from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, JSON
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), index=True, nullable=True)
    action = Column(String(64), nullable=False)  # 'LOGIN', 'PATIENT_PROFILE_UPDATE', 'REMINDER_STATUS', etc.
    resource_type = Column(String(64), nullable=False)
    resource_id = Column(String(64), nullable=True)
    ip_address = Column(String(64), nullable=True)
    user_agent = Column(String(255), nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
