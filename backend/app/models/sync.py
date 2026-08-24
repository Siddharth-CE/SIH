from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, JSON
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class SyncEvent(Base, TimestampMixin):
    __tablename__ = "sync_events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    client_event_id = Column(String(128), unique=True, index=True, nullable=False)  # Idempotency token
    device_id = Column(String(128), nullable=True)
    entity_type = Column(String(32), nullable=False)  # 'game_session', 'reminder', 'hydration', 'mood', 'memory', 'activity'
    action = Column(String(32), nullable=False)  # 'create', 'update', 'delete'
    payload = Column(JSON, nullable=False)
    client_timestamp = Column(DateTime(timezone=True), nullable=False)
    server_timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String(32), default="synced", nullable=False)  # 'synced', 'conflict', 'rejected'
    conflict_details = Column(JSON, nullable=True)
