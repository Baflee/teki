from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer
from websocket_manager import websocket_manager


from router import user, card, log, auth

app = FastAPI()




security_scheme = HTTPBearer()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

app.include_router(user.router, prefix="/v1/user", tags=["user"])
app.include_router(card.router, prefix="/v1/card", tags=["card"])
app.include_router(log.router, prefix="/v1/log", tags=["log"])
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}