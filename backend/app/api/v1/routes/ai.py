from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.ai.engine import ai_engine
from app.schemas.ai import (
    DifficultyEvaluationRequest,
    DifficultyEvaluationResponse,
    VoiceAssistantRequest,
    VoiceAssistantResponse,
    AIInsightResponse,
)
from app.repositories.ai_repo import AIInsightRepository

router = APIRouter(prefix="/ai", tags=["AI & Voice Companion"])


@router.post(
    "/evaluate-difficulty",
    response_model=DifficultyEvaluationResponse,
    summary="Evaluate adaptive difficulty progression",
)
async def evaluate_difficulty(request: DifficultyEvaluationRequest):
    return await ai_engine.recommend_difficulty(request)


@router.post(
    "/voice-assist",
    response_model=VoiceAssistantResponse,
    summary="Natural speech companion response generator",
)
async def voice_assistant(request: VoiceAssistantRequest):
    return await ai_engine.generate_speech_response(
        user_voice_text=request.user_voice_text,
        patient_name=request.patient_name or "Asha",
        region=request.region or "Assam",
    )


@router.get(
    "/patients/{patient_id}/insights",
    response_model=List[AIInsightResponse],
    summary="Get AI-generated engagement insights for patient",
)
def get_insights(patient_id: str, db: Session = Depends(get_db)):
    ai_repo = AIInsightRepository(db)
    return ai_repo.get_by_patient(patient_id)
