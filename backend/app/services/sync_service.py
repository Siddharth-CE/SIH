from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.sync import SyncEvent
from app.models.reminder import Reminder
from app.models.activity import DailyActivity
from app.models.hydration import HydrationLog
from app.models.mood import MoodEntry
from app.models.memory import FamilyMemory
from app.repositories.sync_repo import SyncRepository
from app.repositories.reminder_repo import ReminderRepository
from app.repositories.activity_repo import ActivityRepository
from app.repositories.hydration_repo import HydrationRepository
from app.repositories.mood_repo import MoodRepository
from app.repositories.memory_repo import MemoryRepository
from app.repositories.game_repo import GameSessionRepository
from app.models.game import GameSession
from app.schemas.sync import SyncBatchRequest, SyncBatchResponse, SyncEventPayload


class SyncService:
    def __init__(self, db: Session):
        self.db = db
        self.sync_repo = SyncRepository(db)
        self.reminder_repo = ReminderRepository(db)
        self.activity_repo = ActivityRepository(db)
        self.hydration_repo = HydrationRepository(db)
        self.mood_repo = MoodRepository(db)
        self.memory_repo = MemoryRepository(db)
        self.session_repo = GameSessionRepository(db)

    async def process_batch(self, request: SyncBatchRequest) -> SyncBatchResponse:
        synced_count = 0
        duplicate_count = 0
        failed_count = 0
        conflicts = []

        for event in request.events:
            # 1. Check idempotency (unique client_event_id)
            existing = self.sync_repo.get_by_client_event_id(event.id)
            if existing:
                duplicate_count += 1
                continue

            try:
                # 2. Dispatch event processing
                self._apply_event(event)

                # 3. Record sync log
                sync_record = SyncEvent(
                    client_event_id=event.id,
                    device_id=request.device_id or event.device_id,
                    entity_type=event.entity_type,
                    action=event.action,
                    payload=event.payload,
                    client_timestamp=event.timestamp,
                    server_timestamp=datetime.now(timezone.utc),
                    status="synced",
                )
                self.sync_repo.create(sync_record)
                synced_count += 1
            except Exception as e:
                failed_count += 1
                conflicts.append({
                    "event_id": event.id,
                    "entity_type": event.entity_type,
                    "error": str(e),
                })

        return SyncBatchResponse(
            success=failed_count == 0,
            synced_events_count=synced_count,
            failed_events_count=failed_count,
            duplicate_events_ignored=duplicate_count,
            last_synced_timestamp=datetime.now(timezone.utc),
            conflicts=conflicts,
        )

    def _apply_event(self, event: SyncEventPayload):
        p = event.payload
        entity = event.entity_type
        action = event.action

        if entity == "reminder":
            if action in ["update", "create"]:
                rem_id = p.get("id")
                rem = self.reminder_repo.get(rem_id) if rem_id else None
                if rem:
                    if "status" in p:
                        rem.status = p["status"]
                    if p.get("status") == "completed" and not rem.completed_at:
                        rem.completed_at = event.timestamp
                    self.db.commit()
                else:
                    new_rem = Reminder(
                        id=rem_id,
                        patient_id=p["patient_id"] if "patient_id" in p else p.get("patientId"),
                        title=p.get("title", "Reminder"),
                        type=p.get("type", "medication"),
                        time=p.get("time", "09:00 AM"),
                        time_of_day=p.get("time_of_day", p.get("timeOfDay", "morning")),
                        dosage_or_instruction=p.get("dosage_or_instruction", p.get("dosageOrInstruction")),
                        status=p.get("status", "pending"),
                    )
                    self.reminder_repo.create(new_rem)

        elif entity == "activity":
            act_id = p.get("id")
            act = self.activity_repo.get(act_id) if act_id else None
            if act:
                if "completed" in p:
                    act.completed = p["completed"]
                self.db.commit()

        elif entity == "game_session":
            if action == "create":
                new_session = GameSession(
                    id=p.get("id"),
                    session_id=p.get("session_id", p.get("sessionId")),
                    patient_id=p.get("patient_id", p.get("patientId")),
                    game_id=p.get("game_id", p.get("gameId")),
                    game_category=p.get("game_category", p.get("gameCategory")),
                    difficulty=p.get("difficulty", "gentle"),
                    difficulty_score=p.get("difficulty_score", p.get("difficultyScore", 2)),
                    score=p.get("score", 0),
                    max_possible_score=p.get("max_possible_score", p.get("maxPossibleScore", 100)),
                    accuracy=p.get("accuracy", 100),
                    attempts=p.get("attempts", 1),
                    successful_attempts=p.get("successful_attempts", p.get("successfulAttempts", 1)),
                    average_response_time_ms=p.get("average_response_time_ms", p.get("averageResponseTimeMs", 2000)),
                    time_spent_seconds=p.get("time_spent_seconds", p.get("timeSpentSeconds", 30)),
                    completed_at=event.timestamp,
                )
                self.session_repo.create(new_session)

        elif entity == "hydration":
            log = HydrationLog(
                patient_id=p.get("patient_id", p.get("patientId")),
                amount_glasses=p.get("amount_glasses", p.get("amountGlasses", 1)),
                timestamp=event.timestamp,
                source=p.get("source", "patient"),
            )
            self.hydration_repo.create(log)

        elif entity == "mood":
            mood = MoodEntry(
                patient_id=p.get("patient_id", p.get("patientId")),
                mood=p.get("mood", "peaceful"),
                note=p.get("note"),
                logged_at=event.timestamp,
                logged_by=p.get("logged_by", p.get("loggedBy", "patient")),
            )
            self.mood_repo.create(mood)

        elif entity == "memory":
            if action == "delete":
                mem_id = p.get("id")
                if mem_id:
                    self.memory_repo.delete(mem_id)
            elif action in ["create", "update"]:
                mem_id = p.get("id")
                mem = self.memory_repo.get(mem_id) if mem_id else None
                if mem:
                    if "favorite" in p:
                        mem.favorite = p["favorite"]
                    self.db.commit()
                else:
                    new_mem = FamilyMemory(
                        id=mem_id,
                        patient_id=p.get("patient_id", p.get("patientId")),
                        title=p.get("title", "Memory"),
                        relationship_or_place=p.get("relationship_or_place", p.get("relationshipOrPlace", "Place")),
                        category=p.get("category", "people"),
                        description=p.get("description", ""),
                        tags=p.get("tags", []),
                        favorite=p.get("favorite", False),
                    )
                    self.memory_repo.create(new_mem)
