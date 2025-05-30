from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI Application"
    database_url: str
    secret_token_key: str

    class Config:
        env_file = ".env"

settings = Settings()
