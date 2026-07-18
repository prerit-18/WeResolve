from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas, auth, upload

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
    current_user: models.User = Depends(auth.get_current_active_role(["citizen"])),
    db: Session = Depends(get_db)
):
    image_url = await upload.upload_image(image)
    
    new_issue = models.Issue(
        citizen_id=current_user.id,
        title=title,
        description=description,
        category=category,
        priority=priority,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
        status="Pending"
    )
    db.add(new_issue)
    
    # Award 10 credits to citizen for reporting a problem
    current_user.credits += 10
    
    # Create notification
    notification = models.Notification(
        user_id=current_user.id,
        title="Issue Reported Successfully",
        message=f"Your report for '{title}' has been submitted and is pending verification.",
    )
    db.add(notification)
    
    # Create admin alert
    alert = models.Alert(
        text=f"New issue reported in {title.split('on')[-1].strip() if 'on' in title else 'the city'}",
        type="warning",
        time_ago="Just now"
    )
    db.add(alert)
    
    db.commit()
    db.refresh(new_issue)
    return new_issue

@router.get("/", response_model=List[schemas.IssueResponse])
def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)
    if status:
        query = query.filter(models.Issue.status == status)
    if category:
        query = query.filter(models.Issue.category == category)
    if priority:
        query = query.filter(models.Issue.priority == priority)
    return query.order_by(models.Issue.created_at.desc()).all()

@router.get("/my-reports", response_model=List[schemas.IssueResponse])
def get_my_reports(
    current_user: models.User = Depends(auth.get_current_active_role(["citizen"])),
    db: Session = Depends(get_db)
):
    return db.query(models.Issue).filter(models.Issue.citizen_id == current_user.id).order_by(models.Issue.created_at.desc()).all()

@router.get("/available", response_model=List[schemas.IssueResponse])
def get_available_issues(
    current_user: models.User = Depends(auth.get_current_active_role(["solver"])),
    db: Session = Depends(get_db)
):
    # Solver can see reported issues (status: Pending/reported) that are not accepted yet
    return db.query(models.Issue).filter(models.Issue.status == "Pending").order_by(models.Issue.created_at.desc()).all()
