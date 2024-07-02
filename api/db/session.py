from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.config import settings

SQL_DATABASE_URL = settings.database_url

engine = create_engine(SQL_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()