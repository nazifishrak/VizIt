# app/config.py

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Possible environment variables
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    # Default to "openai" if not set
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")

settings = Settings()
