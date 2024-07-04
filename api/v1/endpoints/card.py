from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.card import Card, CardCreate
from dependencies import get_current_active_admin
from models.user import User as UserModel
from models.card import Card as CardModel
from db.session import get_db
from core.security import encrypt_token, derive_key
from core.config import settings
import secrets
import random

router = APIRouter()

SECRET_TOKEN_KEY = settings.secret_token_key

@router.get("/", response_model=List[Card])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cards = db.query(CardModel).offset(skip).limit(limit).all()
    return cards

@router.post("/", response_model=Card)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    db_card = CardModel(**card.dict())

    # Fetch the user related to the card
    db_user = db.query(UserModel).filter(UserModel.user_id == db_card.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create the token payload
    new_payload = {
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email,
        "card_token": secrets.token_hex(random.randint(10, 30)),
    }
    #Get the derived key
    derived_key = derive_key(SECRET_TOKEN_KEY, db_user.user_id)

    new_token = encrypt_token(new_payload, derived_key)

    # Update the card with the generated token
    db_card.token = new_token
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
