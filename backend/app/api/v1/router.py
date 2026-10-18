from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, medicines, pharmacies, availability, admin, health

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(medicines.router, prefix="/medicines", tags=["Medicines"])
api_router.include_router(pharmacies.router, prefix="/pharmacies", tags=["Pharmacies"])
api_router.include_router(availability.router, prefix="/availability", tags=["Availability"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])
