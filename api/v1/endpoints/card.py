from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.card import Card, CardCreate
from dependencies import get_current_active_admin
from models.user import User as UserModel
from models.card import Card as CardModel
from db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[Card])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cards = db.query(CardModel).offset(skip).limit(limit).all()
    return cards

@router.post("/", response_model=Card)
def create_card(card: CardCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_admin)):
    db_card = CardModel(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

@router.put("/{card_id}", response_model=Card)
def update_card(card_id: int, card: CardCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_admin)):
    db_card = db.query(CardModel).filter(CardModel.card_id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    for key, value in card.dict().items():
        setattr(db_card, key, value)
    db.commit()
    db.refresh(db_card)
    return db_card

@router.delete("/{card_id}", response_model=Card)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_active_admin)):
    db_card = db.query(CardModel).filter(CardModel.card_id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(db_card)
    db.commit()
    return db_card
