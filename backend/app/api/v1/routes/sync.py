from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.sync_service import SyncService
from app.schemas.sync import SyncBatchRequest, SyncBatchResponse

router = APIRouter(prefix="/sync", tags=["Offline Synchronization & Idempotency"])


@router.post(
    "",
    response_model=SyncBatchResponse,
    summary="Batch synchronize offline queued events with idempotency",
)
async def sync_offline_events(
    batch: SyncBatchRequest, db: Session = Depends(get_db)
):
    sync_service = SyncService(db)
    return await sync_service.process_batch(batch)
