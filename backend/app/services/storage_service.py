import os
import uuid
from typing import Optional
from app.core.config import settings


class StorageService:
    def __init__(self):
        self.provider = settings.STORAGE_PROVIDER
        self.local_dir = settings.STORAGE_LOCAL_DIR
        if self.provider == "local":
            os.makedirs(self.local_dir, exist_ok=True)

    async def upload_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        ext = os.path.splitext(filename)[1]
        unique_name = f"{uuid.uuid4()}{ext}"

        if self.provider == "local":
            file_path = os.path.join(self.local_dir, unique_name)
            with open(file_path, "wb") as f:
                f.write(file_bytes)
            return f"/uploads/{unique_name}"

        return f"/uploads/{unique_name}"

    def get_signed_url(self, file_path: str) -> str:
        return file_path


storage_service = StorageService()
