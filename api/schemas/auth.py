from pydantic import BaseModel

class AuthBase(BaseModel):
    first_name: str
    last_name: str
    role: str
    token: str


class VerifyUserRequest(BaseModel):
    token: str