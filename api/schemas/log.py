from pydantic import BaseModel
from datetime import datetime

class LogBase(BaseModel):
    user_id: int
    message: str
    request: str
    status: str
    creation_date: datetime

class LogCreate(LogBase):
    pass

class Log(LogBase):
    log_id: int

    class Config:
        orm_mode = True
