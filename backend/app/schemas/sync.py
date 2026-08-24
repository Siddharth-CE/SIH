from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.common import CamelModel


class SyncEventPayload(CamelModel):
    id: str  # client-side generated UUID (client_event_id)
    entity_type: str  # 'reminder', 'activity', 'game_session', 'mood', 'hydration', 'memory'
    action: str  # 'create', 'update', 'delete'
    payload: Dict[str, Any]
    timestamp: datetime
    device_id: Optional[str] = None


class SyncBatchRequest(CamelModel):
    device_id: Optional[str] = None
    last_synced_timestamp: Optional[datetime] = None
    events: List[SyncEventPayload]


class SyncBatchResponse(CamelModel):
    success: bool
    synced_events_count: int
    failed_events_count: int
    duplicate_events_ignored: int
    last_synced_timestamp: datetime
    conflicts: List[Dict[str, Any]] = []
