import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas, auth, upload

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/my-tasks", response_model=List[schemas.TaskResponse])
def get_my_tasks(
    current_user: models.User = Depends(auth.get_current_active_role(["solver"])),
    db: Session = Depends(get_db)
):
    return db.query(models.Task).filter(models.Task.solver_id == current_user.id).order_by(models.Task.accepted_at.desc()).all()

@router.post("/{issue_id}/accept", response_model=schemas.TaskResponse)
def accept_task(
    issue_id: int,
    current_user: models.User = Depends(auth.get_current_active_role(["solver"])),
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Issue not found"
        )
    if issue.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Issue has already been accepted or resolved"
        )
        
    issue.status = "In Progress"
    new_task = models.Task(
        issue_id=issue.id,
        solver_id=current_user.id,
        status="In Progress",
        before_image=issue.image_url,
    )
    db.add(new_task)
    
    # Create notification for solver
    notification = models.Notification(
        user_id=current_user.id,
        title="Task Accepted",
        message=f"You have accepted the task: '{issue.title}'. Please upload proof of resolution when done.",
    )
    db.add(notification)
    
    # Create notification for citizen
    citizen_notification = models.Notification(
        user_id=issue.citizen_id,
        title="Issue Work Started",
        message=f"A solver has accepted to work on your reported issue: '{issue.title}'.",
    )
    db.add(citizen_notification)
    
    db.commit()
    db.refresh(new_task)
    return new_task

@router.post("/{task_id}/submit", response_model=schemas.TaskResponse)
async def submit_proof(
    task_id: int,
    image: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_active_role(["solver"])),
    db: Session = Depends(get_db)
):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.solver_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active task not found for the current solver"
        )
    if task.status != "In Progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task proof has already been submitted or approved"
        )
        
    after_url = await upload.upload_image(image)
    task.after_image = after_url
    task.status = "Completed"
    task.completed_at = datetime.datetime.utcnow()
    
    # Update issue status
    task.issue.status = "Completed"
    
    # Create notification
    notification = models.Notification(
        user_id=current_user.id,
        title="Verification Submitted",
        message=f"Your proof of work for '{task.issue.title}' has been submitted for admin approval.",
    )
    db.add(notification)
    
    # Create admin alert
    alert = models.Alert(
        text=f"Solver submitted verification for issue #{task.issue.id or 'UP-' + str(task.issue.id)}",
        type="success",
        time_ago="Just now"
    )
    db.add(alert)
    
    db.commit()
    db.refresh(task)
    return task
