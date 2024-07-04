import secrets
import random
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from models.card import Card as CardModel
from models.user import User as UserModel
from schemas.card import CardBase
from schemas.auth import AuthBase, VerifyUserRequest
from db.session import get_db
from core.security import decrypt_token, encrypt_token, derive_key
from core.config import settings

router = APIRouter()

SECRET_TOKEN_KEY = settings.secret_token_key

active_connections: dict = {}

@router.post("/verify-user", response_model=AuthBase)
def verify_user(request: VerifyUserRequest, db: Session = Depends(get_db)):
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
    token_first_name = decoded_token["first_name"]
    token_last_name = decoded_token["last_name"]
    token_email = decoded_token["email"]

    if token_first_name is None or token_last_name is None or token_email is None:
        raise HTTPException(status_code=400, detail="Invalid token payload")

    # Retrieve the user from the database using the user_id from the card
    db_user = db.query(UserModel).filter(UserModel.user_id == db_card.user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify that the user information matches
    if db_user.first_name != token_first_name or db_user.last_name != token_last_name or db_user.email != token_email:
        raise HTTPException(status_code=403, detail="User information does not match")

    # Create a new token with the updated expiration date and a random number
    new_payload = {
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "email": db_user.email,
        "card_token": secrets.token_hex(random.randint(1, 4)),
    }

    new_card_token = encrypt_token(new_payload, derived_key)

    # Update the card with the new token
    db_card.token = new_card_token
    db.commit()
    db.refresh(db_card)

    # Update the user's token as well
    db_user.token = new_card_token
    db.commit()
    db.refresh(db_user)

    auth_token_payload = {
        "user_id": db_user.user_id,
        "exp": datetime.utcnow() + timedelta(hours=5)  # Token expiration time
    }
    new_auth_token = encrypt_token(auth_token_payload, derived_key)

    for connection_id, websocket in active_connections.items():
        try:
             websocket.send_json({
                "type": "navigate_to_dashboard",
                "message": "User verified. Redirecting to dashboard..."
            })
        except WebSocketDisconnect:
            # Handle disconnect if necessary
            pass

    return {
        "user_id": db_user.user_id,
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "role": db_user.role,
        #"card_token": new_card_token,
        "card_token": token,
        "auth_token": new_auth_token
    }
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connection_id = secrets.token_urlsafe(32)
    active_connections[connection_id] = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        del active_connections[connection_id]