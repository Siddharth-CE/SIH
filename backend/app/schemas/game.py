from typing import Optional, Dict, Any
from datetime import datetime
from app.schemas.common import CamelModel


class GameBase(CamelModel):
    slug: str
    title: str
    category: str
    description: str
    instructions: str
    estimated_duration_minutes: int = 4
    cultural_tag: Optional[str] = None
    color: str = "#0F4C3A"


class GameCreate(GameBase):
    pass


class GameResponse(GameBase):
    id: str


class GameSessionCreate(CamelModel):
    session_id: Optional[str] = None
    patient_id: str
    game_id: str
    game_category: str
    difficulty: str
    difficulty_score: int
    score: int
    max_possible_score: int
    accuracy: int
    attempts: int
    successful_attempts: int
    average_response_time_ms: int
    time_spent_seconds: int
    completed_at: Optional[datetime] = None
    feedback_given: Optional[str] = None
    adaptive_delta: Optional[str] = "maintained"
    extra_metadata: Optional[Dict[str, Any]] = None


class GameSessionResponse(GameSessionCreate):
    id: str


class GameEventCreate(CamelModel):
    session_id: str
    event_type: str
    event_payload: Optional[Dict[str, Any]] = None
    timestamp: Optional[datetime] = None


class CognitiveMetricResponse(CamelModel):
    category: str
    category_label: str
    score_percentage: int
    trend: str
    sessions_count: int
    last_played_date: str
    color: str
