from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal

class PharmacyMedicineSchema(BaseModel):
    medicineId: str = Field(..., alias="medicineId")
    medicineName: str = Field(..., alias="medicineName")
    quantity: int = 0
    status: Literal["AVAILABLE", "LOW STOCK", "OUT OF STOCK"] = "AVAILABLE"
    lastUpdated: str = Field(..., alias="lastUpdated")
    price: float = 50.0

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class PharmacyBase(BaseModel):
    name: str
    ownerName: str = Field(..., alias="ownerName")
    email: str
    phone: str
    address: str
    city: str = "Pune"
    latitude: float
    longitude: float
    openingTime: str = Field("08:00 AM", alias="openingTime")
    closingTime: str = Field("10:00 PM", alias="closingTime")
    status: Literal["Open", "Closed"] = "Open"
    distance: Optional[str] = "0.5 km"
    rating: Optional[float] = 4.5

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class PharmacyCreate(PharmacyBase):
    medicines: Optional[List[PharmacyMedicineSchema]] = []

class PharmacyUpdate(BaseModel):
    name: Optional[str] = None
    ownerName: Optional[str] = Field(None, alias="ownerName")
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    openingTime: Optional[str] = Field(None, alias="openingTime")
    closingTime: Optional[str] = Field(None, alias="closingTime")
    status: Optional[Literal["Open", "Closed"]] = None
    rating: Optional[float] = None

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class PharmacyResponse(PharmacyBase):
    id: str
    placeId: Optional[str] = None
    phoneNumber: Optional[str] = None
    openNow: Optional[bool] = True
    medicines: List[PharmacyMedicineSchema] = []

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
