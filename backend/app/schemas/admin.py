from pydantic import BaseModel, Field, ConfigDict
from typing import List

class DashboardStatsSchema(BaseModel):
    totalMedicines: int = Field(..., alias="totalMedicines")
    totalPharmacies: int = Field(..., alias="totalPharmacies")
    totalUsers: int = Field(..., alias="totalUsers")
    availableMedicines: int = Field(..., alias="availableMedicines")
    lowStockMedicines: int = Field(..., alias="lowStockMedicines")
    outOfStockMedicines: int = Field(..., alias="outOfStockMedicines")

    model_config = ConfigDict(populate_by_name=True)

class SearchTrendSchema(BaseModel):
    month: str
    searches: int

class CategoryStatSchema(BaseModel):
    category: str
    count: int

class UserGrowthSchema(BaseModel):
    month: str
    users: int

class AdminStatsResponse(BaseModel):
    stats: DashboardStatsSchema
    searchTrends: List[SearchTrendSchema]
    categoryStats: List[CategoryStatSchema]
    userGrowth: List[UserGrowthSchema]

    model_config = ConfigDict(populate_by_name=True)
