from fastapi import APIRouter

router = APIRouter()

@router.get("/health", summary="Health check endpoint")
def health_check():
    return {
        "status": "ok",
        "service": "MediFind API"
    }
