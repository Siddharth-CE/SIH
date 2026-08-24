from typing import Dict, Any
from app.ai.base import AIProvider
from app.schemas.ai import (
    DifficultyEvaluationRequest,
    DifficultyEvaluationResponse,
    VoiceAssistantResponse,
)


class RuleBasedAIProvider(AIProvider):
    async def recommend_difficulty(
        self, request: DifficultyEvaluationRequest
    ) -> DifficultyEvaluationResponse:
        current_score = request.current_difficulty_score
        accuracy = request.accuracy
        avg_rt = request.average_response_time_ms
        consec_succ = request.consecutive_successes
        consec_fail = request.consecutive_failures

        # Gentle stepping algorithm (safe, compassionate, transparent)
        if (accuracy >= 85 and avg_rt < 3500) or consec_succ >= 2:
            next_score = min(10, current_score + 1)
            delta = "increased" if next_score > current_score else "maintained"
            reason = "High sustained accuracy and steady reaction time. Gently increased challenge by 1 step."
            feedback = "Splendid job! You've matched these with wonderful focus. Let's try just a few more items."
        elif (accuracy < 50 and avg_rt > 5000) or consec_fail >= 2:
            next_score = max(1, current_score - 1)
            delta = "decreased" if next_score < current_score else "maintained"
            reason = "Extended reaction latency detected. Softening complexity to maintain comfort."
            feedback = "You are doing great! Let's take it a little gentler and focus on feeling relaxed."
        else:
            next_score = current_score
            delta = "maintained"
            reason = "Stable consistent engagement. Maintaining current gentle pace."
            feedback = "Wonderful consistency! Let's continue at this comfortable pace."

        # Map score to difficulty label
        if next_score <= 2:
            next_diff = "gentle"
            card_count = 4
            distractors = 2
        elif next_score <= 5:
            next_diff = "easy"
            card_count = 6
            distractors = 2
        elif next_score <= 8:
            next_diff = "moderate"
            card_count = 8
            distractors = 3
        else:
            next_diff = "challenging"
            card_count = 12
            distractors = 4

        return DifficultyEvaluationResponse(
            next_difficulty=next_diff,
            next_difficulty_score=next_score,
            card_count_or_item_count=card_count,
            time_limit_seconds=None,
            distractor_count=distractors,
            feedback_text=feedback,
            adjustment_reason=reason,
            delta=delta,
        )

    async def generate_speech_response(
        self, user_voice_text: str, patient_name: str, region: str
    ) -> VoiceAssistantResponse:
        query = user_voice_text.lower().strip()

        if any(w in query for w in ["medicine", "pill", "tablet", "dosage", "drug"]):
            response_text = f"Good day, {patient_name}! Your morning Telmisartan was scheduled at 9:00 AM. Remember to take it with warm water."
            action = "view_reminders"
        elif any(w in query for w in ["water", "drink", "hydrate", "hydration", "glass"]):
            response_text = f"Staying hydrated keeps your mind energized, {patient_name}. Would you like me to log a glass of water for you?"
            action = "drink_water"
        elif any(w in query for w in ["game", "play", "memory", "flower", "garden", "quiz"]):
            response_text = f"Let's play Memory Garden, {patient_name}! Matching the beautiful flowers of {region} will bring peaceful joy to your day."
            action = "start_game"
        elif any(w in query for w in ["routine", "today", "schedule", "plan", "time"]):
            response_text = f"Today's rhythm has morning tea, memory exercises, and a gentle afternoon stroll. You are doing wonderfully!"
            action = "view_routine"
        elif any(w in query for w in ["hello", "hi", "namaste", "khublei", "greetings"]):
            response_text = f"Hello, {patient_name}! I am right here with you in {region}. How may I help bring peace and clarity to your day?"
            action = None
        else:
            response_text = f"Thank you for sharing, {patient_name}. Let's take today one peaceful step at a time."
            action = None

        return VoiceAssistantResponse(
            response_text=response_text,
            suggested_action=action,
        )

    async def generate_patient_insight(
        self, patient_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        adherence = patient_data.get("medication_adherence_rate", 90)
        name = patient_data.get("preferred_name", "Patient")

        if adherence >= 90:
            title = "Outstanding Daily Rhythm & Adherence"
            summary = f"{name} has maintained a consistent {adherence}% medication adherence rate across the last 14 days."
            rec = "Continue the morning visual reminders and gentle audio harp chimes."
        else:
            title = "Gentle Hydration & Routine Reminder Suggested"
            summary = "Activity latency suggests afternoon fatigue around 3:00 PM."
            rec = "Schedule an afternoon herbal tea check-in with family members."

        return {
            "title": title,
            "summary": summary,
            "recommendation": rec,
            "confidence_score": 0.94,
            "is_clinical_flag": "routine_positive",
        }
