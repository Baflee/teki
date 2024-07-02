from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_cards():
    return {"message": "List of cards"}
