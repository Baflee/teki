from pydantic import BaseModel

class AuthBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    role: str
    card_token: str
    auth_token: str


class VerifyUserRequest(BaseModel):
    token: str