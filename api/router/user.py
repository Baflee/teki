from fastapi import APIRouter
from v1.endpoints import user

router = APIRouter()

router.include_router(user.router, prefix="/user", tags=["user"])
