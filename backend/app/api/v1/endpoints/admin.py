from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.medicine import MedicineModel
from app.models.pharmacy import PharmacyModel
from app.models.user import UserModel
from app.schemas.admin import AdminStatsResponse, DashboardStatsSchema, SearchTrendSchema, CategoryStatSchema, UserGrowthSchema

router = APIRouter()

@router.get("/stats", response_model=AdminStatsResponse, summary="Get Admin Dashboard Statistics")
def get_admin_dashboard_stats(db: Session = Depends(get_db)):
    total_medicines = db.query(MedicineModel).count()
    total_pharmacies = db.query(PharmacyModel).count()
    total_users = db.query(UserModel).count()

    available_meds = db.query(MedicineModel).filter(MedicineModel.availability_status == "AVAILABLE").count()
    low_stock_meds = db.query(MedicineModel).filter(MedicineModel.availability_status == "LOW STOCK").count()
    out_of_stock_meds = db.query(MedicineModel).filter(MedicineModel.availability_status == "OUT OF STOCK").count()

    stats = DashboardStatsSchema(
        totalMedicines=total_medicines,
        totalPharmacies=total_pharmacies,
        totalUsers=total_users,
        availableMedicines=available_meds,
        lowStockMedicines=low_stock_meds,
        outOfStockMedicines=out_of_stock_meds
    )

    search_trends = [
        SearchTrendSchema(month="Apr", searches=1200),
        SearchTrendSchema(month="May", searches=1850),
        SearchTrendSchema(month="Jun", searches=2400),
        SearchTrendSchema(month="Jul", searches=3100),
        SearchTrendSchema(month="Aug", searches=4500),
        SearchTrendSchema(month="Sep", searches=5800)
    ]

    category_stats = [
        CategoryStatSchema(category="Analgesic & Antipyretic", count=340),
        CategoryStatSchema(category="Antibiotic", count=280),
        CategoryStatSchema(category="Anti-Diabetic", count=210),
        CategoryStatSchema(category="Cardiovascular", count=190),
        CategoryStatSchema(category="Gastrointestinal", count=150),
        CategoryStatSchema(category="Antihistamine / Allergy", count=80)
    ]

    user_growth = [
        UserGrowthSchema(month="Apr", users=800),
        UserGrowthSchema(month="May", users=1400),
        UserGrowthSchema(month="Jun", users=2100),
        UserGrowthSchema(month="Jul", users=2900),
        UserGrowthSchema(month="Aug", users=3600),
        UserGrowthSchema(month="Sep", users=total_users if total_users > 4000 else 4250)
    ]

    return AdminStatsResponse(
        stats=stats,
        searchTrends=search_trends,
        categoryStats=category_stats,
        userGrowth=user_growth
    )
