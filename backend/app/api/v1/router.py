from fastapi import APIRouter
from app.api.v1.routes import (
    auth,
    patients,
    caregivers,
    healthcare,
    games,
    game_sessions,
    reminders,
    activities,
    memories,
    hydration,
    appointments,
    analytics,
    alerts,
    sync,
    ai,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(caregivers.router)
api_router.include_router(healthcare.router)
api_router.include_router(games.router)
api_router.include_router(game_sessions.router)
api_router.include_router(reminders.router)
api_router.include_router(activities.router)
api_router.include_router(memories.router)
api_router.include_router(hydration.router)
api_router.include_router(appointments.router)
api_router.include_router(analytics.router)
api_router.include_router(alerts.router)
api_router.include_router(sync.router)
api_router.include_router(ai.router)
