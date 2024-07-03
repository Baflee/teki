import jwt
from fastapi import HTTPException


def encrypt_token(payload: dict, secret_key: str) -> str:
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decrypt_token(token: str, secret_key: str) -> dict:
    try:
        return jwt.decode(token, secret_key, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def derive_key(secret_key, user_id, iterations=100000):
    salt = str(user_id).encode()
    return hashlib.pbkdf2_hmac('sha256', secret_key.encode(), salt, iterations)