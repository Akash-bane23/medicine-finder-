from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
import time
from app.core.database import get_db
from app.models.pharmacy import PharmacyModel
from app.models.inventory import InventoryModel
from app.schemas.pharmacy import PharmacyCreate, PharmacyUpdate, PharmacyResponse, PharmacyMedicineSchema
from app.services.location_service import calculate_haversine_distance
from app.api.deps import get_current_admin_user

router = APIRouter()

def build_pharmacy_response(pharmacy: PharmacyModel, db: Session, user_lat: Optional[float] = None, user_lng: Optional[float] = None) -> PharmacyResponse:
    inventory_items = db.query(InventoryModel).filter(InventoryModel.pharmacy_id == pharmacy.id).all()
    
    meds = [
        PharmacyMedicineSchema(
            medicineId=item.medicine_id,
            medicineName=item.medicine_name,
            quantity=item.quantity,
            status=item.status,
            lastUpdated=item.last_updated,
            price=item.price
        )
        for item in inventory_items
    ]

    calc_distance = pharmacy.distance
    if user_lat is not None and user_lng is not None:
        dist = calculate_haversine_distance(user_lat, user_lng, pharmacy.latitude, pharmacy.longitude)
        calc_distance = f"{dist} km"

    return PharmacyResponse(
        id=pharmacy.id,
        name=pharmacy.name,
        ownerName=pharmacy.owner_name,
        email=pharmacy.email,
        phone=pharmacy.phone,
        address=pharmacy.address,
        city=pharmacy.city,
        latitude=pharmacy.latitude,
        longitude=pharmacy.longitude,
        openingTime=pharmacy.opening_time,
        closingTime=pharmacy.closing_time,
        status=pharmacy.status,
        distance=calc_distance,
        rating=pharmacy.rating,
        placeId=pharmacy.id,
        phoneNumber=pharmacy.phone,
        openNow=pharmacy.status == "Open",
        medicines=meds
    )

@router.get("", response_model=List[PharmacyResponse], summary="Get All Pharmacies")
def get_pharmacies(db: Session = Depends(get_db)):
    pharmacies = db.query(PharmacyModel).order_by(PharmacyModel.name.asc()).all()
    return [build_pharmacy_response(p, db) for p in pharmacies]

@router.get("/nearby", response_model=List[PharmacyResponse], summary="Get Nearby Pharmacies by GPS")
def get_nearby_pharmacies(
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius: Optional[float] = 10.0,
    db: Session = Depends(get_db)
):
    target_lat = lat if lat is not None else latitude
    target_lng = lng if lng is not None else longitude
    
    # Default Pune / Sinhagad Road coordinates if none provided
    if target_lat is None or target_lng is None:
        target_lat = 18.4752
        target_lng = 73.8324

    pharmacies = db.query(PharmacyModel).all()
    results = []

    for p in pharmacies:
        dist_km = calculate_haversine_distance(target_lat, target_lng, p.latitude, p.longitude)
        if radius is None or dist_km <= radius:
            res = build_pharmacy_response(p, db, target_lat, target_lng)
            results.append((dist_km, res))

    results.sort(key=lambda x: x[0])
    return [r[1] for r in results]

@router.get("/{pharmacy_id}", response_model=PharmacyResponse, summary="Get Pharmacy Detail by ID")
def get_pharmacy_by_id(pharmacy_id: str, db: Session = Depends(get_db)):
    pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")
    return build_pharmacy_response(pharmacy, db)

@router.post("", response_model=PharmacyResponse, status_code=201, summary="Create New Pharmacy")
def create_pharmacy(pharm_data: PharmacyCreate, db: Session = Depends(get_db)):
    new_id = f"pharm-{int(time.time() * 1000)}"
    data = pharm_data.model_dump(by_alias=False)

    pharmacy = PharmacyModel(
        id=new_id,
        name=data["name"],
        owner_name=data["ownerName"],
        email=data["email"],
        phone=data["phone"],
        address=data["address"],
        city=data.get("city", "Pune"),
        latitude=data["latitude"],
        longitude=data["longitude"],
        opening_time=data.get("openingTime", "08:00 AM"),
        closing_time=data.get("closingTime", "10:00 PM"),
        status=data.get("status", "Open"),
        distance=data.get("distance", "0.5 km"),
        rating=data.get("rating", 4.5)
    )
    db.add(pharmacy)
    db.commit()
    db.refresh(pharmacy)

    if pharm_data.medicines:
        for m in pharm_data.medicines:
            inv = InventoryModel(
                id=f"inv-{int(time.time() * 1000)}-{m.medicineId}",
                pharmacy_id=new_id,
                medicine_id=m.medicineId,
                medicine_name=m.medicineName,
                quantity=m.quantity,
                status=m.status,
                price=m.price,
                last_updated=m.lastUpdated
            )
            db.add(inv)
        db.commit()

    return build_pharmacy_response(pharmacy, db)

@router.put("/{pharmacy_id}", response_model=PharmacyResponse, summary="Update Pharmacy Details")
def update_pharmacy(pharmacy_id: str, pharm_data: PharmacyUpdate, db: Session = Depends(get_db)):
    pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")

    update_dict = pharm_data.model_dump(exclude_unset=True, by_alias=False)
    
    field_mapping = {
        "ownerName": "owner_name",
        "openingTime": "opening_time",
        "closingTime": "closing_time"
    }

    for key, val in update_dict.items():
        db_key = field_mapping.get(key, key)
        if hasattr(pharmacy, db_key) and val is not None:
            setattr(pharmacy, db_key, val)

    db.commit()
    db.refresh(pharmacy)
    return build_pharmacy_response(pharmacy, db)

@router.delete("/{pharmacy_id}", summary="Delete Pharmacy")
def delete_pharmacy(pharmacy_id: str, db: Session = Depends(get_db)):
    pharmacy = db.query(PharmacyModel).filter(PharmacyModel.id == pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Pharmacy not found")

    db.delete(pharmacy)
    db.commit()
    return {"success": True, "message": "Pharmacy deleted successfully"}
