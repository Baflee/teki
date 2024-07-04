from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from core.security import decrypt_token, derive_key
from core.config import settings
from models.user import User as UserModel
from db.session import get_db
import jwt

SECRET_TOKEN_KEY = "ruuiheurghuhUGHEUIGZEGZGEZ654954GZGYEZFBYZEGFygfzeyfgzfeufhzufhzGFZYEGFYEF5"
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        # Decode the token
        derived_key = derive_key(SECRET_TOKEN_KEY, user_id)  # Assume you have a way to get the user_id from the token
        decoded_token = decrypt_token(token, derived_key)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Retrieve the user from the database
    user_id = decoded_token.get("user_id")
    db_user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return db_user

def get_current_active_admin(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        # Decode the token without knowing the user_id initially
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded_token.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        derived_key = derive_key("ruuiheurghuhUGHEUIGZEGZGEZ654954GZGYEZFBYZEGFygfzeyfgzfeufhzufhzGFZYEGFYEF5", user_id)  
        decoded_token = decrypt_token(token, derived_key)

        db_user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
        if db_user is None or db_user.role != "Admin":
            raise HTTPException(status_code=401, detail="Unauthorized")

        return db_user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")