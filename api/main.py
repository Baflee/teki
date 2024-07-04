from fastapi import FastAPI, WebSocket
from fastapi.security import HTTPBearer



from router import user, card, log, auth

app = FastAPI()




security_scheme = HTTPBearer()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message received from client: {data}")

app.include_router(user.router, prefix="/v1/user", tags=["user"])
app.include_router(card.router, prefix="/v1/card", tags=["card"])
app.include_router(log.router, prefix="/v1/log", tags=["log"])
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}