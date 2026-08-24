from typing import Optional, Dict, Any
from datetime import datetime
from app.schemas.common import CamelModel


class EmergencyContact(CamelModel):
    name: str
    relation: str
    phone: str


EmergencyContactSchema = EmergencyContact


class PatientBase(CamelModel):
    name: str
    preferred_name: Optional[str] = None
    age: int
    gender: str
    region: str
    primary_language: str
    secondary_language: Optional[str] = "en"
    stage: str
    caregiver_id: Optional[str] = None
    healthcare_worker_id: Optional[str] = None
    emergency_contact: Optional[Dict[str, Any]] = None
    daily_routine_goal: int = 4
    hydration_goal_glasses: int = 6
    hydration_current_glasses: int = 0
    medication_adherence_rate: int = 90
    overall_engagement: str = "high"
    status_summary: Optional[str] = None
    current_streak_days: int = 0
    avatar_url: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(CamelModel):
    name: Optional[str] = None
    preferred_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    region: Optional[str] = None
    primary_language: Optional[str] = None
    secondary_language: Optional[str] = None
    stage: Optional[str] = None
    caregiver_id: Optional[str] = None
    healthcare_worker_id: Optional[str] = None
    emergency_contact: Optional[Dict[str, Any]] = None
    daily_routine_goal: Optional[int] = None
    hydration_goal_glasses: Optional[int] = None
    hydration_current_glasses: Optional[int] = None
    medication_adherence_rate: Optional[int] = None
    overall_engagement: Optional[str] = None
    status_summary: Optional[str] = None
    current_streak_days: Optional[int] = None
    avatar_url: Optional[str] = None


class PatientResponse(PatientBase):
    id: str
    created_at: datetime
    updated_at: datetime
