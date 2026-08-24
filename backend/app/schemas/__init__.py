from app.schemas.common import (
    APIErrorDetail,
    APIErrorResponse,
    PaginatedResponse,
    GenericResponse,
)
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    RegisterRequest,
    UserResponse,
)
from app.schemas.patient import (
    PatientBase,
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    EmergencyContactSchema,
)
from app.schemas.game import (
    GameResponse,
    GameSessionCreate,
    GameSessionResponse,
    GameEventCreate,
    CognitiveMetricResponse,
)
from app.schemas.reminder import (
    ReminderBase,
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse,
    MedicationResponse,
)
from app.schemas.activity import (
    DailyActivityBase,
    DailyActivityCreate,
    DailyActivityUpdate,
    DailyActivityResponse,
)
from app.schemas.mood import MoodEntryCreate, MoodEntryResponse
from app.schemas.memory import (
    FamilyMemoryBase,
    FamilyMemoryCreate,
    FamilyMemoryUpdate,
    FamilyMemoryResponse,
)
from app.schemas.alert import AlertCreate, AlertResponse
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.schemas.hydration import HydrationCreate, HydrationResponse
from app.schemas.analytics import (
    WeeklyActivityDataPoint,
    PatientAnalyticsOverview,
    HealthcareCohortOverview,
)
from app.schemas.sync import (
    SyncEventPayload,
    SyncBatchRequest,
    SyncBatchResponse,
)
from app.schemas.ai import (
    DifficultyEvaluationRequest,
    DifficultyEvaluationResponse,
    VoiceAssistantRequest,
    VoiceAssistantResponse,
    AIInsightResponse,
)

__all__ = [
    "APIErrorDetail",
    "APIErrorResponse",
    "PaginatedResponse",
    "GenericResponse",
    "LoginRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "RegisterRequest",
    "UserResponse",
    "PatientBase",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "EmergencyContactSchema",
    "GameResponse",
    "GameSessionCreate",
    "GameSessionResponse",
    "GameEventCreate",
    "CognitiveMetricResponse",
    "ReminderBase",
    "ReminderCreate",
    "ReminderUpdate",
    "ReminderResponse",
    "MedicationResponse",
    "DailyActivityBase",
    "DailyActivityCreate",
    "DailyActivityUpdate",
    "DailyActivityResponse",
    "MoodEntryCreate",
    "MoodEntryResponse",
    "FamilyMemoryBase",
    "FamilyMemoryCreate",
    "FamilyMemoryUpdate",
    "FamilyMemoryResponse",
    "AlertCreate",
    "AlertResponse",
    "AppointmentCreate",
    "AppointmentResponse",
    "HydrationCreate",
    "HydrationResponse",
    "WeeklyActivityDataPoint",
    "PatientAnalyticsOverview",
    "HealthcareCohortOverview",
    "SyncEventPayload",
    "SyncBatchRequest",
    "SyncBatchResponse",
    "DifficultyEvaluationRequest",
    "DifficultyEvaluationResponse",
    "VoiceAssistantRequest",
    "VoiceAssistantResponse",
    "AIInsightResponse",
]
