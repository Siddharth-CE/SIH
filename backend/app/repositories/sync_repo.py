from typing import Optional
from sqlalchemy.orm import Session
from app.models.sync import SyncEvent
from app.repositories.base import BaseRepository


class SyncRepository(BaseRepository[SyncEvent]):
    def __init__(self, db: Session):
        super().__init__(SyncEvent, db)

    def get_by_client_event_id(self, client_event_id: str) -> Optional[SyncEvent]:
        return (
            self.db.query(SyncEvent)
            .filter(SyncEvent.client_event_id == client_event_id)
            .first()
        )
