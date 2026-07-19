from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
from ..database import get_db
from ..repositories.base import BaseRepository
from .. import schemas, auth, upload

router = APIRouter(prefix="/issues", tags=["issues"])

@router.post("/", response_model=schemas.IssueResponse)
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    priority: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(...),
    current_user = Depends(auth.get_current_active_role(["citizen"])),
    db: BaseRepository = Depends(get_db)
):
    image_url = await upload.upload_image(image)
    
    new_issue = db.create_issue(
        citizen_id=current_user.id,
        title=title,
        description=description,
        category=category,
        priority=priority,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url
    )
    
    # Award 10 credits to citizen for reporting a problem
    db.update_user_profile(current_user.id, {"credits": current_user.credits + 10})
    
    # Create notification
    db.create_notification(
        user_id=current_user.id,
        title="Issue Reported Successfully",
        message=f"Your report for '{title}' has been submitted and is pending verification.",
    )
    
    # Create admin alert
    alert_text = f"New issue reported in {title.split('on')[-1].strip() if 'on' in title else 'the city'}"
    db.create_alert(
        text=alert_text,
        type="warning",
        time_ago="Just now"
    )
    
    # Refetch the issue to ensure loaded relationships are populated correctly
    refetched = db.get_issue_by_id(new_issue.id)
    return refetched

@router.get("/", response_model=List[schemas.IssueResponse])
def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    db: BaseRepository = Depends(get_db)
):
    return db.get_issues(status=status, category=category, priority=priority)

@router.get("/my-reports", response_model=List[schemas.IssueResponse])
def get_my_reports(
    current_user = Depends(auth.get_current_active_role(["citizen"])),
    db: BaseRepository = Depends(get_db)
):
    return db.get_issues_by_citizen(current_user.id)

@router.get("/available", response_model=List[schemas.IssueResponse])
def get_available_issues(
    current_user = Depends(auth.get_current_active_role(["solver"])),
    db: BaseRepository = Depends(get_db)
):
    return db.get_available_issues()
