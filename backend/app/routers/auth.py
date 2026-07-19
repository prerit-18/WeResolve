from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from ..database import get_db
from ..repositories.base import BaseRepository
from .. import schemas, auth

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user_in: schemas.UserCreate, db: BaseRepository = Depends(get_db)):
    db_user = db.get_user_by_email(user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    avatar_seed = user_in.full_name.replace(" ", "")
    avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={avatar_seed}"
    if user_in.full_name == "Arjun Kumar":
        avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
    
    hashed_password = auth.get_password_hash(user_in.password)
    
    # Wrap in schemas.UserCreate with hashed password before sending to repository
    user_data = schemas.UserCreate(
        email=user_in.email,
        password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role
    )
    new_user = db.create_user(user_data, avatar)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(login_in: schemas.LoginRequest, db: BaseRepository = Depends(get_db)):
    user = db.get_user_by_email(login_in.email)
    if not user or not auth.verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
        
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user = Depends(auth.get_current_user)):
    return current_user
