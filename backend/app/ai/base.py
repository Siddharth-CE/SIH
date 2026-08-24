from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.schemas.ai import (
    DifficultyEvaluationRequest,
    DifficultyEvaluationResponse,
    VoiceAssistantResponse,
)


class AIProvider(ABC):
    @abstractmethod
    async def recommend_difficulty(
        self, request: DifficultyEvaluationRequest
    ) -> DifficultyEvaluationResponse:
        pass

    @abstractmethod
    async def generate_speech_response(
        self, user_voice_text: str, patient_name: str, region: str
    ) -> VoiceAssistantResponse:
        pass

    @abstractmethod
    async def generate_patient_insight(
        self, patient_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        pass
