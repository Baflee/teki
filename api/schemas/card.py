from pydantic import BaseModel
from datetime import datetime

class CardBase(BaseModel):
    user_id: int
    expiration_date: datetime
    token: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    card_id: int

    class Config:
        orm_mode = True
