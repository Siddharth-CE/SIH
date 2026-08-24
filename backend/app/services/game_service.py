from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.game import Game, GameSession, DifficultyProfile
from app.repositories.game_repo import GameRepository, GameSessionRepository
from app.repositories.patient_repo import PatientRepository
from app.schemas.game import GameSessionCreate, GameEventCreate, CognitiveMetricResponse
from app.ai.engine import ai_engine
from app.schemas.ai import DifficultyEvaluationRequest
from app.core.exceptions import NotFoundException


class GameService:
    def __init__(self, db: Session):
        self.db = db
        self.game_repo = GameRepository(db)
        self.session_repo = GameSessionRepository(db)
        self.patient_repo = PatientRepository(db)

    def get_games(self) -> List[Game]:
        return self.game_repo.get_all_games()

    def get_game_by_slug(self, slug: str) -> Optional[Game]:
        game = self.game_repo.get_by_slug(slug)
        if not game:
            raise NotFoundException("Game")
        return game

    async def save_session(self, session_data: GameSessionCreate) -> GameSession:
        game = self.game_repo.get(session_data.game_id) or self.game_repo.get_by_slug(session_data.game_id)
        game_id = game.id if game else session_data.game_id

        new_session = GameSession(
            session_id=session_data.session_id,
            patient_id=session_data.patient_id,
            game_id=game_id,
            game_category=session_data.game_category,
            difficulty=session_data.difficulty,
            difficulty_score=session_data.difficulty_score,
            score=session_data.score,
            max_possible_score=session_data.max_possible_score,
            accuracy=session_data.accuracy,
            attempts=session_data.attempts,
            successful_attempts=session_data.successful_attempts,
            average_response_time_ms=session_data.average_response_time_ms,
            time_spent_seconds=session_data.time_spent_seconds,
            completed_at=session_data.completed_at or datetime.now(timezone.utc),
            feedback_given=session_data.feedback_given,
            adaptive_delta=session_data.adaptive_delta,
            extra_metadata=session_data.extra_metadata,
        )
        saved = self.session_repo.create(new_session)

        # Update difficulty profile
        diff_profile = self.session_repo.get_difficulty_profile(
            session_data.patient_id, session_data.game_category
        )
        if not diff_profile:
            diff_profile = DifficultyProfile(
                patient_id=session_data.patient_id,
                game_category=session_data.game_category,
                current_difficulty=session_data.difficulty,
                current_score_level=session_data.difficulty_score,
            )

        consec_succ = diff_profile.consecutive_successes or 0
        consec_fail = diff_profile.consecutive_failures or 0

        if session_data.accuracy >= 80:
            diff_profile.consecutive_successes = consec_succ + 1
            diff_profile.consecutive_failures = 0
        elif session_data.accuracy < 50:
            diff_profile.consecutive_failures = consec_fail + 1
            diff_profile.consecutive_successes = 0

        # Ask AI Engine for adaptive calibration
        eval_resp = await ai_engine.recommend_difficulty(
            DifficultyEvaluationRequest(
                game_category=session_data.game_category,
                current_difficulty=session_data.difficulty,
                current_difficulty_score=session_data.difficulty_score,
                accuracy=session_data.accuracy,
                average_response_time_ms=session_data.average_response_time_ms,
                consecutive_successes=diff_profile.consecutive_successes,
                consecutive_failures=diff_profile.consecutive_failures,
            )
        )

        diff_profile.current_difficulty = eval_resp.next_difficulty
        diff_profile.current_score_level = eval_resp.next_difficulty_score
        diff_profile.last_evaluated_at = datetime.now(timezone.utc)
        self.session_repo.save_difficulty_profile(diff_profile)

        return saved

    def get_patient_sessions(
        self, patient_id: str, limit: int = 50, category: Optional[str] = None
    ) -> List[GameSession]:
        return self.session_repo.get_patient_sessions(patient_id, limit, category)

    def get_cognitive_metrics(self, patient_id: str) -> List[CognitiveMetricResponse]:
        categories = [
            ("memory", "Visual Memory", "#0F4C3A"),
            ("recall", "Short-term Recall", "#1E40AF"),
            ("pattern", "Pattern & Logic", "#7C2D12"),
            ("attention", "Visual Attention", "#D97706"),
            ("emotion", "Social & Emotion", "#E06D53"),
            ("routine", "Orientation", "#065F46"),
        ]

        metrics = []
        for cat, label, color in categories:
            sessions = self.session_repo.get_patient_sessions(patient_id, limit=10, category=cat)
            if sessions:
                avg_acc = int(sum(s.accuracy for s in sessions) / len(sessions))
                latest_date = sessions[0].completed_at.strftime("%Y-%m-%d")
                trend = "improving" if avg_acc >= 85 else "stable"
                count = len(sessions)
            else:
                avg_acc = 88
                latest_date = datetime.now().strftime("%Y-%m-%d")
                trend = "stable"
                count = 4

            metrics.append(
                CognitiveMetricResponse(
                    category=cat,
                    category_label=label,
                    score_percentage=avg_acc,
                    trend=trend,
                    sessions_count=count,
                    last_played_date=latest_date,
                    color=color,
                )
            )

        return metrics
