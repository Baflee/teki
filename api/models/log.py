from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from db.base import Base

class Log(Base):
    __tablename__ = "logs"

    log_id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    request = Column(String)
    status = Column(String)
    creation_date = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.user_id"))

    user = relationship("User", back_populates="logs")
