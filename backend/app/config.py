import os
from pathlib import Path

class Config:
    APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
    APP_PORT = int(os.getenv("APP_PORT", "8000"))

    JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "4320"))

    # ✅ always point to: backend/data/app.db
    BASE_DIR = Path(__file__).resolve().parent.parent   # backend/
    DB_PATH = os.getenv("DB_PATH", str(BASE_DIR / "data" / "app.db"))
