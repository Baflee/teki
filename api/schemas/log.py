from pydantic import BaseModel

class LogBase(BaseModel):
    message: str
    request: str
    status: str
    user_id: int

class LogCreate(LogBase):
    pass

class Log(LogBase):
    id: int

    class Config:
        orm_mode = True
