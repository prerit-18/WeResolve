from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ..database import get_db
from ..repositories.base import BaseRepository
from .. import schemas, auth

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[schemas.NotificationResponse])
def get_user_notifications(
    current_user = Depends(auth.get_current_user),
    db: BaseRepository = Depends(get_db)
):
    return db.get_notifications_by_user(current_user.id)

@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user = Depends(auth.get_current_user),
    db: BaseRepository = Depends(get_db)
):
    success = db.mark_notification_read(notification_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}

@router.post("/read-all")
def mark_all_read(
    current_user = Depends(auth.get_current_user),
    db: BaseRepository = Depends(get_db)
):
    db.mark_all_notifications_read(current_user.id)
    return {"status": "success"}
