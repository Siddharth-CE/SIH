from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.memory_service import MemoryService
from app.schemas.memory import (
    FamilyMemoryCreate,
    FamilyMemoryUpdate,
    FamilyMemoryResponse,
)

router = APIRouter(tags=["Family Memories & Albums"])


@router.get(
    "/patients/{patient_id}/memories",
    response_model=List[FamilyMemoryResponse],
    summary="Get patient family memories",
)
def get_memories(
    patient_id: str,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    memory_service = MemoryService(db)
    return memory_service.get_memories(patient_id, category)


@router.post(
    "/memories",
    response_model=FamilyMemoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new memory card",
)
def create_memory(
    memory_in: FamilyMemoryCreate, db: Session = Depends(get_db)
):
    memory_service = MemoryService(db)
    return memory_service.create_memory(memory_in)


@router.patch(
    "/memories/{id}/favorite",
    response_model=FamilyMemoryResponse,
    summary="Toggle memory favorite status",
)
def toggle_favorite(id: str, db: Session = Depends(get_db)):
    memory_service = MemoryService(db)
    return memory_service.toggle_favorite(id)


@router.delete(
    "/memories/{id}",
    summary="Delete memory card",
)
def delete_memory(id: str, db: Session = Depends(get_db)):
    memory_service = MemoryService(db)
    success = memory_service.delete_memory(id)
    return {"success": success}
