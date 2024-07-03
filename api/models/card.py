from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base

class Card(Base):
    __tablename__ = "cards"

    card_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    expiration_date = Column(DateTime)
    token = Column(String)

    user = relationship("User", back_populates="cards")
