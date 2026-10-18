from pydantic import BaseModel, Field, ConfigDict
from typing import Literal

class AvailabilityRecordResponse(BaseModel):
    id: str
    pharmacyId: str = Field(..., alias="pharmacyId")
    pharmacyName: str = Field(..., alias="pharmacyName")
    medicineId: str = Field(..., alias="medicineId")
    medicineName: str = Field(..., alias="medicineName")
    quantity: int
    status: Literal["AVAILABLE", "LOW STOCK", "OUT OF STOCK"]
    lastUpdated: str = Field(..., alias="lastUpdated")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class StockUpdateRequest(BaseModel):
    pharmacyId: str = Field(..., alias="pharmacyId")
    medicineId: str = Field(..., alias="medicineId")
    quantity: int
    status: Literal["AVAILABLE", "LOW STOCK", "OUT OF STOCK"]

    model_config = ConfigDict(populate_by_name=True)

class AvailabilityResponse(BaseModel):
    success: bool = True
    message: str = "Availability updated successfully"
