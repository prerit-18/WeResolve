from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List
from ..database import get_db
from ..repositories.base import BaseRepository
from .. import schemas, auth, upload

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/my-tasks", response_model=List[schemas.TaskResponse])
def get_my_tasks(
    current_user = Depends(auth.get_current_active_role(["solver"])),
    db: BaseRepository = Depends(get_db)
):
    return db.get_tasks_by_solver(current_user.id)

@router.post("/{issue_id}/accept", response_model=schemas.TaskResponse)
def accept_task(
    issue_id: int,
    current_user = Depends(auth.get_current_active_role(["solver"])),
    db: BaseRepository = Depends(get_db)
):
    issue = db.get_issue_by_id(issue_id)
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
        
    new_task = db.accept_task(issue_id, current_user.id)
    
    # Create notification for solver
    db.create_notification(
        user_id=current_user.id,
        title="Task Accepted",
        message=f"You have accepted the task: '{issue.title}'. Please upload proof of resolution when done.",
    )
    
    # Create notification for citizen
    db.create_notification(
        user_id=issue.citizen_id,
        title="Issue Work Started",
        message=f"A solver has accepted to work on your reported issue: '{issue.title}'.",
    )
    
    refetched = db.get_task_by_id(new_task.id)
    return refetched

@router.post("/{task_id}/submit", response_model=schemas.TaskResponse)
async def submit_proof(
    task_id: int,
    image: UploadFile = File(...),
    current_user = Depends(auth.get_current_active_role(["solver"])),
    db: BaseRepository = Depends(get_db)
):
    task = db.get_task_by_id_and_solver(task_id, current_user.id)
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
    updated_task = db.submit_proof(task_id, current_user.id, after_url)
    
    # Create notification
    db.create_notification(
        user_id=current_user.id,
        title="Verification Submitted",
        message=f"Your proof of work for '{updated_task.issue.title}' has been submitted for admin approval.",
    )
    
    # Create admin alert
    db.create_alert(
        text=f"Solver submitted verification for issue #UP-{updated_task.issue.id}",
        type="success",
        time_ago="Just now"
    )
    
    refetched = db.get_task_by_id(task_id)
    return refetched
