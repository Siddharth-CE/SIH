from typing import Optional, Dict, Any
from datetime import datetime
from app.schemas.common import CamelModel


class DifficultyEvaluationRequest(CamelModel):
    game_category: str
    current_difficulty: str
    current_difficulty_score: int
    accuracy: int
    average_response_time_ms: int
    consecutive_successes: int = 0
    consecutive_failures: int = 0
    patient_age: int = 70


class DifficultyEvaluationResponse(CamelModel):
    next_difficulty: str
    next_difficulty_score: int
    card_count_or_item_count: int
    time_limit_seconds: Optional[int] = None
    distractor_count: int = 2
    feedback_text: str
    adjustment_reason: str
    delta: str  # 'increased', 'maintained', 'decreased'


class VoiceAssistantRequest(CamelModel):
    user_voice_text: str
    patient_name: Optional[str] = "Asha"
    region: Optional[str] = "Assam"


class VoiceAssistantResponse(CamelModel):
    response_text: str
    suggested_action: Optional[str] = None


class AIInsightResponse(CamelModel):
    id: str
    patient_id: str
    title: str
    summary: str
    recommendation: str
    confidence_score: float = 0.92
    generated_at: datetime
    is_clinical_flag: str = "routine_positive"
