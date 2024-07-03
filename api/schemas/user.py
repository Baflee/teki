from pydantic import BaseModel
from datetime import datetime
from typing import List

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    role: str
    expiration_date: datetime

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
