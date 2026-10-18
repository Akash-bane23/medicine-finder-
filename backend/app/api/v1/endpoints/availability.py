from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import time
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.inventory import InventoryModel
from app.models.pharmacy import PharmacyModel
from app.models.medicine import MedicineModel
from app.schemas.inventory import AvailabilityRecordResponse, StockUpdateRequest, AvailabilityResponse

router = APIRouter()

@router.get("", response_model=List[AvailabilityRecordResponse], summary="Get All Availability Records")
def get_all_availability_records(db: Session = Depends(get_db)):
    inventories = db.query(InventoryModel).all()
    records = []
    
    for inv in inventories:
        pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == inv.pharmacy_id).first()
        pharmacy_name = pharmacy.name if pharmacy else "Unknown Pharmacy"
        
        records.append(
            AvailabilityRecordResponse(
                id=inv.id,
                pharmacyId=inv.pharmacy_id,
                pharmacyName=pharmacy_name,
                medicineId=inv.medicine_id,
                medicineName=inv.medicine_name,
                quantity=inv.quantity,
                status=inv.status,
                lastUpdated=inv.last_updated
            )
        )

    return records

@router.put("", response_model=AvailabilityResponse, summary="Update Pharmacy Medicine Stock")
def update_stock(req: StockUpdateRequest, db: Session = Depends(get_db)):
    pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == req.pharmacyId).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")

    medicine = db.query(MedicineModel).filter(MedicineModel.id == req.medicineId).first()
    med_name = medicine.name if medicine else "Medicine"

    inventory_item = db.query(InventoryModel).filter(
        InventoryModel.pharmacy_id == req.pharmacyId,
        InventoryModel.medicine_id == req.medicineId
    ).first()

    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if inventory_item:
        inventory_item.quantity = req.quantity
        inventory_item.status = req.status
        inventory_item.last_updated = today_str
    else:
        inventory_item = InventoryModel(
            id=f"inv-{int(time.time() * 1000)}",
            pharmacy_id=req.pharmacyId,
            medicine_id=req.medicineId,
            medicine_name=med_name,
            quantity=req.quantity,
            status=req.status,
            price=medicine.price if medicine and medicine.price else 50.0,
            last_updated=today_str
        )
        db.add(inventory_item)

    db.commit()

    # Also update overall medicine availability status if needed
    if medicine:
        if req.status == "AVAILABLE" and req.quantity > 0:
            medicine.availability_status = "AVAILABLE"
        elif req.status == "LOW STOCK" or (req.quantity > 0 and req.quantity < 10):
            medicine.availability_status = "LOW STOCK"
        elif req.status == "OUT OF STOCK" or req.quantity == 0:
            medicine.availability_status = "OUT OF STOCK"
        db.commit()

    return AvailabilityResponse(success=True, message="Availability updated successfully")
