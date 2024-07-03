import os
import random
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import jwt

from models.card import Card as CardModel
from models.user import User as UserModel
from schemas.card import CardBase
from db.session import get_db
from core.security import decrypt_token, encrypt_token, derive_key

router = APIRouter()

SECRET_TOKEN_KEY = os.getenv("SECRET_TOKEN_KEY")

@router.post("/verify-user", response_model=CardBase)
def verify_user(request: str, db: Session = Depends(get_db)):
    token = request.token

    # Check if the token exists in the cards table
    db_card = db.query(CardModel).filter(CardModel.token == token).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    #Get user token
    derived_key = derive_key(SECRET_TOKEN_KEY, db_card.user_id)


    # Decode the JWT
    decoded_token = decrypt_token(token, derived_key)

    # Extract user information from the token
    token_name = decoded_token.get("name")
    token_surname = decoded_token.get("surname")
    token_email = decoded_token.get("email")

    if token_name is None or token_surname is None or token_email is None:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    # Retrieve the user from the database using the user_id from the card
    db_user = db.query(UserModel).filter(UserModel.user_id == db_card.user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify that the user information matches
    if db_user.name != token_name or db_user.surname != token_surname or db_user.email != token_email:
        raise HTTPException(status_code=403, detail="User information does not match")

    # Create a new token with the updated expiration date and a random number
    new_payload = {
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email,
        "random": random.randint(1, 100000),
    }

    new_token = encrypt_token(new_payload, derived_key)

    # Update the card with the new token
    db_card.token = new_token
    db.commit()
    db.refresh(db_card)

    # Update the user's token as well
    db_user.token = new_token
    db.commit()
    db.refresh(db_user)

    return {
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "role": db_user.role,
        "new_token": new_token,
    }
