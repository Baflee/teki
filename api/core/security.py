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
