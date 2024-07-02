from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_logs():
    return {"message": "List of logs"}
