from fastapi import FastAPI
from router import user, card, log, auth

app = FastAPI()

app.include_router(user.router, prefix="/v1/user", tags=["user"])
app.include_router(card.router, prefix="/v1/card", tags=["card"])
app.include_router(log.router, prefix="/v1/log", tags=["log"])
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}