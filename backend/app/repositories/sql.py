from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional, Any
from .base import BaseRepository
from .. import models, schemas
from ..database import engine, Base
import datetime

class SQLAlchemyRepository(BaseRepository):
    def __init__(self, db: Session):
        self.db = db

    def clear_all_data(self) -> None:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def get_user_by_email(self, email: str) -> Optional[Any]:
        return self.db.query(models.User).filter(models.User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[Any]:
        return self.db.query(models.User).filter(models.User.id == user_id).first()

    def create_user(self, user_in: schemas.UserCreate, avatar: str) -> Any:
        db_user = models.User(
            email=user_in.email,
            hashed_password=user_in.password,  # Note: already hashed by signup/auth router
            full_name=user_in.full_name,
            role=user_in.role,
            avatar=avatar,
            credits=0,
            xp=0,
            level=1
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_users(self, role: Optional[str] = None) -> List[Any]:
        query = self.db.query(models.User)
        if role:
            query = query.filter(models.User.role == role)
        return query.all()

    def update_user_profile(self, user_id: int, updates: dict) -> Any:
        user = self.get_user_by_id(user_id)
        if user:
            for key, val in updates.items():
                setattr(user, key, val)
            self.db.commit()
            self.db.refresh(user)
        return user

    def create_issue(self, citizen_id: int, title: str, description: str, category: str, priority: str, latitude: float, longitude: float, image_url: str) -> Any:
        new_issue = models.Issue(
            citizen_id=citizen_id,
            title=title,
            description=description,
            category=category,
            priority=priority,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url,
            status="Pending"
        )
        self.db.add(new_issue)
        self.db.commit()
        self.db.refresh(new_issue)
        return new_issue

    def get_issues(self, status: Optional[str] = None, category: Optional[str] = None, priority: Optional[str] = None) -> List[Any]:
        query = self.db.query(models.Issue)
        if status:
            query = query.filter(models.Issue.status == status)
        if category:
            query = query.filter(models.Issue.category == category)
        if priority:
            query = query.filter(models.Issue.priority == priority)
        return query.order_by(desc(models.Issue.created_at)).all()

    def get_issues_by_citizen(self, citizen_id: int) -> List[Any]:
        return self.db.query(models.Issue).filter(models.Issue.citizen_id == citizen_id).order_by(desc(models.Issue.created_at)).all()

    def get_available_issues(self) -> List[Any]:
        return self.db.query(models.Issue).filter(models.Issue.status == "Pending").order_by(desc(models.Issue.created_at)).all()

    def get_issue_by_id(self, issue_id: int) -> Optional[Any]:
        return self.db.query(models.Issue).filter(models.Issue.id == issue_id).first()

    def get_tasks_by_solver(self, solver_id: int) -> List[Any]:
        return self.db.query(models.Task).filter(models.Task.solver_id == solver_id).order_by(desc(models.Task.accepted_at)).all()

    def get_task_by_id(self, task_id: int) -> Optional[Any]:
        return self.db.query(models.Task).filter(models.Task.id == task_id).first()

    def get_task_by_id_and_solver(self, task_id: int, solver_id: int) -> Optional[Any]:
        return self.db.query(models.Task).filter(models.Task.id == task_id, models.Task.solver_id == solver_id).first()

    def accept_task(self, issue_id: int, solver_id: int) -> Any:
        issue = self.get_issue_by_id(issue_id)
        if not issue:
            return None
        issue.status = "In Progress"
        
        new_task = models.Task(
            issue_id=issue.id,
            solver_id=solver_id,
            status="In Progress",
            before_image=issue.image_url
        )
        self.db.add(new_task)
        self.db.commit()
        self.db.refresh(new_task)
        return new_task

    def submit_proof(self, task_id: int, solver_id: int, after_image: str) -> Any:
        task = self.get_task_by_id_and_solver(task_id, solver_id)
        if not task:
            return None
        task.after_image = after_image
        task.status = "Completed"
        task.completed_at = datetime.datetime.utcnow()
        task.issue.status = "Completed"
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_pending_verifications(self) -> List[Any]:
        return self.db.query(models.Task).filter(models.Task.status == "Completed").order_by(desc(models.Task.completed_at)).all()

    def verify_task_proof(self, task_id: int, action: str) -> dict:
        task = self.get_task_by_id(task_id)
        if not task:
            return {}
        
        issue = task.issue
        solver = task.solver
        
        if action == "approve":
            task.status = "Approved"
            issue.status = "Resolved"
            
            credit_reward = 50
            solver.credits += credit_reward
            solver.xp += 50
            if solver.xp >= solver.level * 100:
                solver.level += 1
                
            self.create_notification(solver.id, "Proof Approved!", f"Your resolution proof for '{issue.title}' has been approved. You earned {credit_reward} credits and 50 XP!")
            self.create_notification(issue.citizen_id, "Issue Resolved", f"The issue you reported '{issue.title}' has been resolved and verified.")
            self.create_alert(f"Issue #UP-{issue.id} marked as resolved", "success", "Just now")
        else:
            task.status = "Rejected"
            issue.status = "In Progress"
            
            self.create_notification(solver.id, "Proof Rejected", f"Your resolution proof for '{issue.title}' was rejected by the admin. Please check the site and submit again.")
            self.create_alert(f"Verification rejected for issue #{issue.id}", "danger", "Just now")
            
        self.db.commit()
        self.db.refresh(task)
        return {"status": "success", "task_status": task.status, "issue_status": issue.status}

    def get_alerts(self, limit: int = 15) -> List[Any]:
        return self.db.query(models.Alert).order_by(desc(models.Alert.created_at)).limit(limit).all()

    def create_alert(self, text: str, type: str, time_ago: str) -> Any:
        alert = models.Alert(text=text, type=type, time_ago=time_ago)
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def get_notifications_by_user(self, user_id: int) -> List[Any]:
        return self.db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(desc(models.Notification.created_at)).all()

    def create_notification(self, user_id: int, title: str, message: str) -> Any:
        notification = models.Notification(user_id=user_id, title=title, message=message)
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
        n = self.db.query(models.Notification).filter(models.Notification.id == notification_id, models.Notification.user_id == user_id).first()
        if n:
            n.read = True
            self.db.commit()
            return True
        return False

    def mark_all_notifications_read(self, user_id: int) -> bool:
        self.db.query(models.Notification).filter(models.Notification.user_id == user_id).update({"read": True})
        self.db.commit()
        return True

    def get_admin_stats(self) -> dict:
        total = self.db.query(models.Issue).count()
        in_progress = self.db.query(models.Issue).filter(models.Issue.status == "In Progress").count()
        resolved = self.db.query(models.Issue).filter(models.Issue.status == "Resolved").count()
        high_priority = self.db.query(models.Issue).filter(models.Issue.priority == "High").count()
        
        return {
            "total_issues": total,
            "total_issues_change": "+12.5% from last week",
            "in_progress": in_progress,
            "in_progress_change": "+8.3% from last week",
            "resolved": resolved,
            "resolved_change": "+15.7% from last week",
            "high_priority": high_priority,
            "high_priority_change": "-3.2% from last week"
        }

    def seed_user(self, email, hashed_password, full_name, role, credits, xp, level, avatar) -> int:
        user = models.User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            role=role,
            credits=credits,
            xp=xp,
            level=level,
            avatar=avatar
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user.id

    def seed_issue(self, id, citizen_id, title, description, category, priority, status, latitude, longitude, image_url, created_at) -> int:
        issue = models.Issue(
            id=id,
            citizen_id=citizen_id,
            title=title,
            description=description,
            category=category,
            priority=priority,
            status=status,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url,
            created_at=created_at
        )
        self.db.add(issue)
        self.db.commit()
        self.db.refresh(issue)
        return issue.id

    def seed_task(self, id, issue_id, solver_id, status, before_image, after_image, accepted_at, completed_at) -> None:
        task = models.Task(
            id=id,
            issue_id=issue_id,
            solver_id=solver_id,
            status=status,
            before_image=before_image,
            after_image=after_image,
            accepted_at=accepted_at,
            completed_at=completed_at
        )
        self.db.add(task)
        self.db.commit()

    def seed_alert(self, text, type, time_ago, created_at) -> None:
        alert = models.Alert(
            text=text,
            type=type,
            time_ago=time_ago,
            created_at=created_at
        )
        self.db.add(alert)
        self.db.commit()

    def seed_notification(self, user_id, title, message, read, created_at) -> None:
        notification = models.Notification(
            user_id=user_id,
            title=title,
            message=message,
            read=read,
            created_at=created_at
        )
        self.db.add(notification)
        self.db.commit()
