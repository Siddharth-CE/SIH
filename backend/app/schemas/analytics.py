from typing import List, Dict, Any, Optional
from app.schemas.common import CamelModel
from app.schemas.game import CognitiveMetricResponse


class WeeklyActivityDataPoint(CamelModel):
    day: str
    date: str
    sessions: int
    completion_rate: int


class PatientAnalyticsOverview(CamelModel):
    patient_id: str
    total_sessions: int
    average_accuracy: int
    average_response_time_ms: int
    medication_adherence_rate: int
    current_streak_days: int
    weekly_activity: List[WeeklyActivityDataPoint]
    cognitive_metrics: List[CognitiveMetricResponse]


class HealthcareCohortOverview(CamelModel):
    total_patients: int
    high_adherence_count: int
    needs_attention_count: int
    average_engagement_percentage: int
    regional_distribution: List[Dict[str, Any]]
