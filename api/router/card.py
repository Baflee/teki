from fastapi import APIRouter
from v1.endpoints import card

router = APIRouter()

router.include_router(card.router, prefix="", tags=["card"])
