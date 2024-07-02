from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI Application"
    database_url: str

    class Config:
        env_file = ".env"

settings = Settings()
