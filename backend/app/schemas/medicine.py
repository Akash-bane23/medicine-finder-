from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, Literal, Any

AvailabilityStatusType = Literal["AVAILABLE", "LOW STOCK", "OUT OF STOCK"]

class MedicineBase(BaseModel):
    name: str
    genericName: str = Field(..., alias="genericName")
    brandName: str = Field(..., alias="brandName")
    manufacturer: str
    category: str
    dosageForm: str = Field(..., alias="dosageForm")
    strength: str
    uses: str
    precautions: str
    sideEffects: str = Field(..., alias="sideEffects")
    storage: str
    prescriptionRequired: bool = Field(False, alias="prescriptionRequired")
    availabilityStatus: Optional[AvailabilityStatusType] = Field("AVAILABLE", alias="availabilityStatus")
    price: Optional[float] = 0.0
    description: Optional[str] = ""
    drugInteractions: Optional[str] = Field("", alias="drugInteractions")
    stockCount: Optional[int] = Field(100, alias="stockCount")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    genericName: Optional[str] = Field(None, alias="genericName")
    brandName: Optional[str] = Field(None, alias="brandName")
    manufacturer: Optional[str] = None
    category: Optional[str] = None
    dosageForm: Optional[str] = Field(None, alias="dosageForm")
    strength: Optional[str] = None
    uses: Optional[str] = None
    precautions: Optional[str] = None
    sideEffects: Optional[str] = Field(None, alias="sideEffects")
    storage: Optional[str] = None
    prescriptionRequired: Optional[bool] = Field(None, alias="prescriptionRequired")
    availabilityStatus: Optional[AvailabilityStatusType] = Field(None, alias="availabilityStatus")
    price: Optional[float] = None
    description: Optional[str] = None
    drugInteractions: Optional[str] = Field(None, alias="drugInteractions")
    stockCount: Optional[int] = Field(None, alias="stockCount")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class MedicineResponse(BaseModel):
    id: str
    name: str
    genericName: str
    brandName: str
    manufacturer: str
    category: str
    dosageForm: str
    strength: str
    uses: str
    precautions: str
    sideEffects: str
    storage: str
    prescriptionRequired: bool = False
    availabilityStatus: Optional[AvailabilityStatusType] = "AVAILABLE"
    price: Optional[float] = 0.0
    description: Optional[str] = ""
    drugInteractions: Optional[str] = ""
    stockCount: Optional[int] = 100

    @model_validator(mode="before")
    @classmethod
    def convert_orm_attributes(cls, data: Any) -> Any:
        if hasattr(data, "__table__"):
            return {
                "id": str(data.id),
                "name": str(data.name),
                "genericName": getattr(data, "generic_name", ""),
                "brandName": getattr(data, "brand_name", ""),
                "manufacturer": str(data.manufacturer),
                "category": str(data.category),
                "dosageForm": getattr(data, "dosage_form", ""),
                "strength": str(data.strength),
                "uses": str(data.uses),
                "precautions": str(data.precautions),
                "sideEffects": getattr(data, "side_effects", ""),
                "storage": str(data.storage),
                "prescriptionRequired": getattr(data, "prescription_required", False),
                "availabilityStatus": getattr(data, "availability_status", "AVAILABLE"),
                "price": getattr(data, "price", 0.0),
                "description": getattr(data, "description", ""),
                "drugInteractions": getattr(data, "drug_interactions", ""),
                "stockCount": getattr(data, "stock_count", 100),
            }
        return data

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
