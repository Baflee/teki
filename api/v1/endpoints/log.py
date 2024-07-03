from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.log import Log, LogCreate
from models.log import Log as LogModel
from db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[Log])
def read_logs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    logs = db.query(LogModel).offset(skip).limit(limit).all()
    return logs

@router.post("/", response_model=Log)
def create_log(log: LogCreate, db: Session = Depends(get_db)):
    db_log = LogModel(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.put("/{log_id}", response_model=Log)
def update_log(log_id: int, log: LogCreate, db: Session = Depends(get_db)):
    db_log = db.query(LogModel).filter(LogModel.id == log_id).first()
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    for key, value in log.dict().items():
        setattr(db_log, key, value)
    db.commit()
    db.refresh(db_log)
    return db_log

@router.delete("/{log_id}", response_model=Log)
def delete_log(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(LogModel).filter(LogModel.id == log_id).first()
    if db_log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(db_log)
    db.commit()
    return db_log
