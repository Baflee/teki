from fastapi import APIRouter
from v1.endpoints import auth

router = APIRouter()

router.include_router(auth.router, prefix="", tags=["auth"])