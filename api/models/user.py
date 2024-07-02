from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from api.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    first_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    expiration_date = Column(DateTime)

    cards = relationship("Card", back_populates="user")
    logs = relationship("Log", back_populates="user")
