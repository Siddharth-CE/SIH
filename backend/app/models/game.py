from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Game(Base, TimestampMixin):
    __tablename__ = "games"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    slug = Column(String(64), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(32), nullable=False, index=True)  # 'memory', 'recall', 'pattern', 'attention', 'emotion', 'routine'
    description = Column(String(500), nullable=False)
    instructions = Column(String(1000), nullable=False)
    estimated_duration_minutes = Column(Integer, default=5, nullable=False)
    icon_name = Column(String(64), nullable=True)
    cultural_tag = Column(String(128), nullable=True)
    color = Column(String(32), nullable=True)

    sessions = relationship("GameSession", back_populates="game")


class GameSession(Base, TimestampMixin):
    __tablename__ = "game_sessions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    session_id = Column(String(64), index=True, nullable=True)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    game_id = Column(String(64), ForeignKey("games.id"), nullable=False, index=True)
    game_category = Column(String(32), nullable=False, index=True)
    difficulty = Column(String(32), nullable=False)  # 'gentle', 'easy', 'moderate', 'challenging'
    difficulty_score = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    max_possible_score = Column(Integer, nullable=False)
    accuracy = Column(Integer, nullable=False)
    attempts = Column(Integer, nullable=False)
    successful_attempts = Column(Integer, nullable=False)
    average_response_time_ms = Column(Integer, nullable=False)
    time_spent_seconds = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    feedback_given = Column(String(500), nullable=True)
    adaptive_delta = Column(String(32), nullable=True)  # 'increased', 'maintained', 'decreased'
    extra_metadata = Column(JSON, nullable=True)

    patient = relationship("Patient", back_populates="game_sessions")
    game = relationship("Game", back_populates="sessions")
    events = relationship("GameEvent", back_populates="session", cascade="all, delete-orphan")


class GameEvent(Base, TimestampMixin):
    __tablename__ = "game_events"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    session_id = Column(String(64), ForeignKey("game_sessions.id"), nullable=False, index=True)
    event_type = Column(String(64), nullable=False)  # 'GAME_STARTED', 'ANSWER_CORRECT', 'ANSWER_INCORRECT', etc.
    latency_ms = Column(Integer, nullable=True)
    payload = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    session = relationship("GameSession", back_populates="events")


class DifficultyProfile(Base, TimestampMixin):
    __tablename__ = "difficulty_profiles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    game_category = Column(String(32), nullable=False, index=True)
    current_difficulty = Column(String(32), default="gentle", nullable=False)
    current_score_level = Column(Integer, default=2, nullable=False)
    consecutive_successes = Column(Integer, default=0, nullable=False)
    consecutive_failures = Column(Integer, default=0, nullable=False)
    last_evaluated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
