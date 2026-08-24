from typing import List, Optional, Dict, Any
from app.core.logging import logger


class NotificationService:
    async def send_in_app_notification(
        self, user_id: str, title: str, body: str, data: Optional[Dict[str, Any]] = None
    ) -> bool:
        logger.info(f"Dispatching in-app notification to {user_id}: {title} - {body}")
        return True

    async def send_reminder_alert(
        self, patient_name: str, reminder_title: str, scheduled_time: str
    ) -> bool:
        logger.info(f"Reminder prompt: {reminder_title} for {patient_name} at {scheduled_time}")
        return True


notification_service = NotificationService()
