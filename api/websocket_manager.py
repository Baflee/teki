# websocket_manager.py

from typing import List
from fastapi import WebSocket

class WebSocketManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def send_message(self, message):
        for connection in self.connections:
            await connection.send_text(message)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)

websocket_manager = WebSocketManager()
