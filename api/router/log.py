from fastapi import APIRouter
from v1.endpoints import log

router = APIRouter()

router.include_router(log.router, prefix="", tags=["log"])
