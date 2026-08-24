from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.game import Game, GameSession, GameEvent, DifficultyProfile
from app.repositories.base import BaseRepository


class GameRepository(BaseRepository[Game]):
    def __init__(self, db: Session):
        super().__init__(Game, db)

    def get_by_slug(self, slug: str) -> Optional[Game]:
        return self.db.query(Game).filter(Game.slug == slug).first()

    def get_all_games(self) -> List[Game]:
        return self.db.query(Game).all()


class GameSessionRepository(BaseRepository[GameSession]):
    def __init__(self, db: Session):
        super().__init__(GameSession, db)

    def get_patient_sessions(
        self, patient_id: str, limit: int = 50, category: Optional[str] = None
    ) -> List[GameSession]:
        query = self.db.query(GameSession).filter(GameSession.patient_id == patient_id)
        if category:
            query = query.filter(GameSession.game_category == category)
        return query.order_by(GameSession.completed_at.desc()).limit(limit).all()

    def get_latest_session(
        self, patient_id: str, category: Optional[str] = None
    ) -> Optional[GameSession]:
        query = self.db.query(GameSession).filter(GameSession.patient_id == patient_id)
        if category:
            query = query.filter(GameSession.game_category == category)
        return query.order_by(GameSession.completed_at.desc()).first()

    def create_event(self, session_id: str, event_type: str, latency_ms: Optional[int] = None, payload: Optional[dict] = None) -> GameEvent:
        event = GameEvent(
            session_id=session_id,
            event_type=event_type,
            latency_ms=latency_ms,
            payload=payload,
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_difficulty_profile(self, patient_id: str, game_category: str) -> Optional[DifficultyProfile]:
        return self.db.query(DifficultyProfile).filter(
            DifficultyProfile.patient_id == patient_id,
            DifficultyProfile.game_category == game_category,
        ).first()

    def save_difficulty_profile(self, profile: DifficultyProfile) -> DifficultyProfile:
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile
