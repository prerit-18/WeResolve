from abc import ABC, abstractmethod
from typing import List, Optional, Any
from .. import schemas

class BaseRepository(ABC):
    @abstractmethod
    def clear_all_data(self) -> None:
        """Clears all collections/tables and prepares database."""
        pass

    # User operations
    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Any]:
        pass

    @abstractmethod
    def get_user_by_id(self, user_id: int) -> Optional[Any]:
        pass

    @abstractmethod
    def create_user(self, user_in: schemas.UserCreate, avatar: str) -> Any:
        pass

    @abstractmethod
    def get_users(self, role: Optional[str] = None) -> List[Any]:
        pass

    @abstractmethod
    def update_user_profile(self, user_id: int, updates: dict) -> Any:
        pass

    # Issue operations
    @abstractmethod
    def create_issue(self, citizen_id: int, title: str, description: str, category: str, priority: str, latitude: float, longitude: float, image_url: str) -> Any:
        pass

    @abstractmethod
    def get_issues(self, status: Optional[str] = None, category: Optional[str] = None, priority: Optional[str] = None) -> List[Any]:
        pass

    @abstractmethod
    def get_issues_by_citizen(self, citizen_id: int) -> List[Any]:
        pass

    @abstractmethod
    def get_available_issues(self) -> List[Any]:
        pass

    @abstractmethod
    def get_issue_by_id(self, issue_id: int) -> Optional[Any]:
        pass

    # Task operations
    @abstractmethod
    def get_tasks_by_solver(self, solver_id: int) -> List[Any]:
        pass

    @abstractmethod
    def get_task_by_id(self, task_id: int) -> Optional[Any]:
        pass

    @abstractmethod
    def get_task_by_id_and_solver(self, task_id: int, solver_id: int) -> Optional[Any]:
        pass

    @abstractmethod
    def accept_task(self, issue_id: int, solver_id: int) -> Any:
        pass

    @abstractmethod
    def submit_proof(self, task_id: int, solver_id: int, after_image: str) -> Any:
        pass

    @abstractmethod
    def get_pending_verifications(self) -> List[Any]:
        pass

    @abstractmethod
    def verify_task_proof(self, task_id: int, action: str) -> dict:
        pass

    # Alert & Notification operations
    @abstractmethod
    def get_alerts(self, limit: int = 15) -> List[Any]:
        pass

    @abstractmethod
    def create_alert(self, text: str, type: str, time_ago: str) -> Any:
        pass

    @abstractmethod
    def get_notifications_by_user(self, user_id: int) -> List[Any]:
        pass

    @abstractmethod
    def create_notification(self, user_id: int, title: str, message: str) -> Any:
        pass

    @abstractmethod
    def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
        pass

    @abstractmethod
    def mark_all_notifications_read(self, user_id: int) -> bool:
        pass

    # Admin Stats
    @abstractmethod
    def get_admin_stats(self) -> dict:
        pass

    # Seeding helpers
    @abstractmethod
    def seed_user(self, email, hashed_password, full_name, role, credits, xp, level, avatar) -> int:
        pass

    @abstractmethod
    def seed_issue(self, id, citizen_id, title, description, category, priority, status, latitude, longitude, image_url, created_at) -> int:
        pass

    @abstractmethod
    def seed_task(self, id, issue_id, solver_id, status, before_image, after_image, accepted_at, completed_at) -> None:
        pass

    @abstractmethod
    def seed_alert(self, text, type, time_ago, created_at) -> None:
        pass

    @abstractmethod
    def seed_notification(self, user_id, title, message, read, created_at) -> None:
        pass
