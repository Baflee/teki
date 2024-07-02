from pydantic import BaseModel
from datetime import datetime

class CardBase(BaseModel):
    user_id: int
    expiration_date: datetime
    jwt: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int

    class Config:
        orm_mode = True
