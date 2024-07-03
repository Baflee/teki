from pydantic import BaseModel

class LogBase(BaseModel):
    user_id: int
    message: str
    request: str
    status: str

class LogCreate(LogBase):
    pass

class Log(LogBase):
    id: int

    class Config:
        orm_mode = True
