from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.game_service import GameService
from app.schemas.game import (
    GameSessionCreate,
    GameSessionResponse,
    CognitiveMetricResponse,
)

router = APIRouter(tags=["Game Sessions & Telemetry"])


@router.post(
    "/games/sessions",
    response_model=GameSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Save game session and update adaptive difficulty",
)
async def save_game_session(
    session_in: GameSessionCreate, db: Session = Depends(get_db)
):
    game_service = GameService(db)
    return await game_service.save_session(session_in)


@router.get(
    "/patients/{patient_id}/game-sessions",
    response_model=List[GameSessionResponse],
    summary="Get patient game sessions",
)
def get_patient_sessions(
    patient_id: str,
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    game_service = GameService(db)
    return game_service.get_patient_sessions(patient_id, limit, category)


@router.get(
    "/patients/{patient_id}/metrics",
    response_model=List[CognitiveMetricResponse],
    summary="Get patient longitudinal cognitive metrics",
)
def get_patient_metrics(patient_id: str, db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.get_cognitive_metrics(patient_id)
