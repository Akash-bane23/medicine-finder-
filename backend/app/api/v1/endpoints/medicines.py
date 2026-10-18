from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import time
from app.core.database import get_db
from app.models.medicine import MedicineModel
from app.models.inventory import InventoryModel
from app.models.pharmacy import PharmacyModel
from app.schemas.medicine import MedicineCreate, MedicineUpdate, MedicineResponse
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("", response_model=List[MedicineResponse], summary="Get All Medicines with Filters")
def get_medicines(
    searchQuery: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    dosageForm: Optional[str] = None,
    prescriptionRequired: Optional[str] = None,
    availability: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(MedicineModel)

    if searchQuery:
        q = f"%{searchQuery.strip()}%"
        query = query.filter(
            (MedicineModel.name.ilike(q)) |
            (MedicineModel.generic_name.ilike(q)) |
            (MedicineModel.brand_name.ilike(q)) |
            (MedicineModel.uses.ilike(q))
        )

    if category:
        query = query.filter(MedicineModel.category.ilike(f"%{category.strip()}%"))

    if brand:
        query = query.filter(MedicineModel.brand_name.ilike(f"%{brand.strip()}%"))

    if dosageForm:
        query = query.filter(MedicineModel.dosage_form.ilike(dosageForm.strip()))

    if prescriptionRequired and prescriptionRequired != "all":
        req_bool = prescriptionRequired.lower() == "yes" or prescriptionRequired.lower() == "true"
        query = query.filter(MedicineModel.prescription_required == req_bool)

    if availability and availability != "all":
        query = query.filter(MedicineModel.availability_status == availability)

    medicines = query.order_by(MedicineModel.name.asc()).all()
    return [MedicineResponse.model_validate(m) for m in medicines]

@router.get("/search", response_model=List[MedicineResponse], summary="Search Medicines")
def search_medicines(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    term = f"%{q.strip()}%"
    medicines = db.query(MedicineModel).filter(
        (MedicineModel.name.ilike(term)) |
        (MedicineModel.generic_name.ilike(term)) |
        (MedicineModel.brand_name.ilike(term)) |
        (MedicineModel.uses.ilike(term))
    ).all()
    return [MedicineResponse.model_validate(m) for m in medicines]

@router.get("/{medicine_id}", response_model=MedicineResponse, summary="Get Medicine Detail by ID")
def get_medicine_by_id(medicine_id: str, db: Session = Depends(get_db)):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return MedicineResponse.model_validate(medicine)

@router.post("", response_model=MedicineResponse, status_code=201, summary="Create New Medicine")
def create_medicine(med_data: MedicineCreate, db: Session = Depends(get_db)):
    new_id = f"med-{int(time.time() * 1000)}"
    med_dict = med_data.model_dump(by_alias=False)
    
    medicine = MedicineModel(
        id=new_id,
        name=med_dict["name"],
        generic_name=med_dict["genericName"],
        brand_name=med_dict["brandName"],
        manufacturer=med_dict["manufacturer"],
        category=med_dict["category"],
        dosage_form=med_dict["dosageForm"],
        strength=med_dict["strength"],
        uses=med_dict["uses"],
        precautions=med_dict["precautions"],
        side_effects=med_dict["sideEffects"],
        storage=med_dict["storage"],
        prescription_required=med_dict["prescriptionRequired"],
        availability_status=med_dict.get("availabilityStatus", "AVAILABLE"),
        price=med_dict.get("price", 0.0),
        description=med_dict.get("description", ""),
        drug_interactions=med_dict.get("drugInteractions", ""),
        stock_count=med_dict.get("stockCount", 100)
    )
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return MedicineResponse.model_validate(medicine)

@router.put("/{medicine_id}", response_model=MedicineResponse, summary="Update Medicine")
def update_medicine(medicine_id: str, med_data: MedicineUpdate, db: Session = Depends(get_db)):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    update_dict = med_data.model_dump(exclude_unset=True, by_alias=False)
    
    field_mapping = {
        "genericName": "generic_name",
        "brandName": "brand_name",
        "dosageForm": "dosage_form",
        "sideEffects": "side_effects",
        "prescriptionRequired": "prescription_required",
        "availabilityStatus": "availability_status",
        "drugInteractions": "drug_interactions",
        "stockCount": "stock_count"
    }

    for key, val in update_dict.items():
        db_key = field_mapping.get(key, key)
        if hasattr(medicine, db_key) and val is not None:
            setattr(medicine, db_key, val)

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.model_validate(medicine)

@router.delete("/{medicine_id}", summary="Delete Medicine")
def delete_medicine(medicine_id: str, db: Session = Depends(get_db)):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(medicine)
    db.commit()
    return {"success": True, "message": "Medicine deleted successfully"}

@router.get("/{medicine_id}/availability", summary="Get Nearby Pharmacies for specific medicine")
def get_medicine_availability(medicine_id: str, db: Session = Depends(get_db)):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    records = db.query(InventoryModel).filter(
        InventoryModel.medicine_id == medicine_id,
        InventoryModel.status == "AVAILABLE"
    ).all()

    available_pharmacies = []
    for r in records:
        pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == r.pharmacy_id).first()
        if pharmacy:
            available_pharmacies.append({
                "pharmacy_id": pharmacy.id,
                "pharmacy_name": pharmacy.name,
                "address": pharmacy.address,
                "latitude": pharmacy.latitude,
                "longitude": pharmacy.longitude,
                "quantity": r.quantity,
                "price": r.price
            })

    return {
        "medicine_id": medicine.id,
        "medicine_name": medicine.name,
        "available_pharmacies": available_pharmacies
    }
