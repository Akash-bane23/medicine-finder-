from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import UserModel
from app.schemas.user import UserResponse, UserStatusUpdate
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("", response_model=List[UserResponse], summary="Get All System Users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(UserModel).order_by(UserModel.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]

@router.patch("/{user_id}/status", response_model=UserResponse, summary="Update User Account Status")
def update_user_status(user_id: str, status_req: UserStatusUpdate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.status = status_req.status
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)

@router.delete("/{user_id}", summary="Delete User Account")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"success": True, "message": "User deleted successfully"}
