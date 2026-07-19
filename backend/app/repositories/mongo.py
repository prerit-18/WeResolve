import datetime
from typing import List, Optional, Any
from pymongo import MongoClient, DESCENDING
from .base import BaseRepository
from .. import schemas

class MongoUser:
    def __init__(self, data):
        self.id = data["id"]
        self.email = data["email"]
        self.hashed_password = data["hashed_password"]
        self.full_name = data["full_name"]
        self.role = data["role"]
        self.credits = data.get("credits", 0)
        self.xp = data.get("xp", 0)
        self.level = data.get("level", 1)
        self.avatar = data.get("avatar")

class MongoIssue:
    def __init__(self, data, repo):
        self.id = data["id"]
        self.citizen_id = data["citizen_id"]
        self.title = data["title"]
        self.description = data["description"]
        self.category = data["category"]
        self.priority = data["priority"]
        self.status = data["status"]
        self.latitude = data["latitude"]
        self.longitude = data["longitude"]
        self.image_url = data.get("image_url")
        self.created_at = data["created_at"]
        self.citizen = repo.get_user_by_id(self.citizen_id)

class MongoTask:
    def __init__(self, data, repo):
        self.id = data["id"]
        self.issue_id = data["issue_id"]
        self.solver_id = data["solver_id"]
        self.status = data["status"]
        self.before_image = data.get("before_image")
        self.after_image = data.get("after_image")
        self.accepted_at = data["accepted_at"]
        self.completed_at = data.get("completed_at")
        self.issue = repo.get_issue_by_id(self.issue_id)
        self.solver = repo.get_user_by_id(self.solver_id)

class MongoNotification:
    def __init__(self, data):
        self.id = data["id"]
        self.user_id = data["user_id"]
        self.title = data["title"]
        self.message = data["message"]
        self.read = data.get("read", False)
        self.created_at = data["created_at"]

class MongoAlert:
    def __init__(self, data):
        self.id = data["id"]
        self.text = data["text"]
        self.type = data["type"]
        self.time_ago = data["time_ago"]
        self.created_at = data["created_at"]

class MongoRepository(BaseRepository):
    def __init__(self, client: MongoClient, db_name: str):
        self.client = client
        self.db = client[db_name]

    def clear_all_data(self) -> None:
        for col_name in ["users", "issues", "tasks", "notifications", "alerts"]:
            self.db[col_name].drop()

    def _get_next_id(self, col_name: str) -> int:
        doc = self.db[col_name].find_one(sort=[("id", -1)])
        return (doc["id"] + 1) if doc else 1

    def get_user_by_email(self, email: str) -> Optional[Any]:
        data = self.db.users.find_one({"email": email})
        return MongoUser(data) if data else None

    def get_user_by_id(self, user_id: int) -> Optional[Any]:
        data = self.db.users.find_one({"id": user_id})
        return MongoUser(data) if data else None

    def create_user(self, user_in: schemas.UserCreate, avatar: str) -> Any:
        next_id = self._get_next_id("users")
        user_doc = {
            "id": next_id,
            "email": user_in.email,
            "hashed_password": user_in.password,  # Note: already hashed by calling function
            "full_name": user_in.full_name,
            "role": user_in.role,
            "credits": 0,
            "xp": 0,
            "level": 1,
            "avatar": avatar
        }
        self.db.users.insert_one(user_doc)
        return MongoUser(user_doc)

    def get_users(self, role: Optional[str] = None) -> List[Any]:
        query = {}
        if role:
            query["role"] = role
        cursor = self.db.users.find(query)
        return [MongoUser(doc) for doc in cursor]

    def update_user_profile(self, user_id: int, updates: dict) -> Any:
        self.db.users.update_one({"id": user_id}, {"$set": updates})
        return self.get_user_by_id(user_id)

    def create_issue(self, citizen_id: int, title: str, description: str, category: str, priority: str, latitude: float, longitude: float, image_url: str) -> Any:
        next_id = self._get_next_id("issues")
        issue_doc = {
            "id": next_id,
            "citizen_id": citizen_id,
            "title": title,
            "description": description,
            "category": category,
            "priority": priority,
            "status": "Pending",
            "latitude": latitude,
            "longitude": longitude,
            "image_url": image_url,
            "created_at": datetime.datetime.utcnow()
        }
        self.db.issues.insert_one(issue_doc)
        return MongoIssue(issue_doc, self)

    def get_issues(self, status: Optional[str] = None, category: Optional[str] = None, priority: Optional[str] = None) -> List[Any]:
        query = {}
        if status:
            query["status"] = status
        if category:
            query["category"] = category
        if priority:
            query["priority"] = priority
        cursor = self.db.issues.find(query).sort("created_at", DESCENDING)
        return [MongoIssue(doc, self) for doc in cursor]

    def get_issues_by_citizen(self, citizen_id: int) -> List[Any]:
        cursor = self.db.issues.find({"citizen_id": citizen_id}).sort("created_at", DESCENDING)
        return [MongoIssue(doc, self) for doc in cursor]

    def get_available_issues(self) -> List[Any]:
        cursor = self.db.issues.find({"status": "Pending"}).sort("created_at", DESCENDING)
        return [MongoIssue(doc, self) for doc in cursor]

    def get_issue_by_id(self, issue_id: int) -> Optional[Any]:
        data = self.db.issues.find_one({"id": issue_id})
        return MongoIssue(data, self) if data else None

    def get_tasks_by_solver(self, solver_id: int) -> List[Any]:
        cursor = self.db.tasks.find({"solver_id": solver_id}).sort("accepted_at", DESCENDING)
        return [MongoTask(doc, self) for doc in cursor]

    def get_task_by_id(self, task_id: int) -> Optional[Any]:
        data = self.db.tasks.find_one({"id": task_id})
        return MongoTask(data, self) if data else None

    def get_task_by_id_and_solver(self, task_id: int, solver_id: int) -> Optional[Any]:
        data = self.db.tasks.find_one({"id": task_id, "solver_id": solver_id})
        return MongoTask(data, self) if data else None

    def accept_task(self, issue_id: int, solver_id: int) -> Any:
        issue = self.get_issue_by_id(issue_id)
        if not issue:
            return None
        self.db.issues.update_one({"id": issue_id}, {"$set": {"status": "In Progress"}})
        next_id = self._get_next_id("tasks")
        task_doc = {
            "id": next_id,
            "issue_id": issue_id,
            "solver_id": solver_id,
            "status": "In Progress",
            "before_image": issue.image_url,
            "accepted_at": datetime.datetime.utcnow()
        }
        self.db.tasks.insert_one(task_doc)
        return MongoTask(task_doc, self)

    def submit_proof(self, task_id: int, solver_id: int, after_image: str) -> Any:
        task = self.get_task_by_id_and_solver(task_id, solver_id)
        if not task:
            return None
        completed_at = datetime.datetime.utcnow()
        self.db.tasks.update_one(
            {"id": task_id, "solver_id": solver_id},
            {"$set": {"after_image": after_image, "status": "Completed", "completed_at": completed_at}}
        )
        self.db.issues.update_one({"id": task.issue_id}, {"$set": {"status": "Completed"}})
        return self.get_task_by_id(task_id)

    def get_pending_verifications(self) -> List[Any]:
        cursor = self.db.tasks.find({"status": "Completed"}).sort("completed_at", DESCENDING)
        return [MongoTask(doc, self) for doc in cursor]

    def verify_task_proof(self, task_id: int, action: str) -> dict:
        task = self.get_task_by_id(task_id)
        if not task:
            return {}
        issue = task.issue
        solver = task.solver
        
        if action == "approve":
            self.db.tasks.update_one({"id": task_id}, {"$set": {"status": "Approved"}})
            self.db.issues.update_one({"id": task.issue_id}, {"$set": {"status": "Resolved"}})
            
            credit_reward = 50
            new_credits = solver.credits + credit_reward
            new_xp = solver.xp + 50
            new_level = solver.level
            if new_xp >= new_level * 100:
                new_level += 1
            self.update_user_profile(solver.id, {"credits": new_credits, "xp": new_xp, "level": new_level})
            
            self.create_notification(solver.id, "Proof Approved!", f"Your resolution proof for '{issue.title}' has been approved. You earned {credit_reward} credits and 50 XP!")
            self.create_notification(issue.citizen_id, "Issue Resolved", f"The issue you reported '{issue.title}' has been resolved and verified.")
            self.create_alert(f"Issue #UP-{issue.id} marked as resolved", "success", "Just now")
        else:
            self.db.tasks.update_one({"id": task_id}, {"$set": {"status": "Rejected"}})
            self.db.issues.update_one({"id": task.issue_id}, {"$set": {"status": "In Progress"}})
            
            self.create_notification(solver.id, "Proof Rejected", f"Your resolution proof for '{issue.title}' was rejected by the admin. Please check the site and submit again.")
            self.create_alert(f"Verification rejected for issue #{issue.id}", "danger", "Just now")
            
        updated_task = self.get_task_by_id(task_id)
        return {"status": "success", "task_status": updated_task.status, "issue_status": updated_task.issue.status}

    def get_alerts(self, limit: int = 15) -> List[Any]:
        cursor = self.db.alerts.find().sort("created_at", DESCENDING).limit(limit)
        return [MongoAlert(doc) for doc in cursor]

    def create_alert(self, text: str, type: str, time_ago: str) -> Any:
        next_id = self._get_next_id("alerts")
        alert_doc = {
            "id": next_id,
            "text": text,
            "type": type,
            "time_ago": time_ago,
            "created_at": datetime.datetime.utcnow()
        }
        self.db.alerts.insert_one(alert_doc)
        return MongoAlert(alert_doc)

    def get_notifications_by_user(self, user_id: int) -> List[Any]:
        cursor = self.db.notifications.find({"user_id": user_id}).sort("created_at", DESCENDING)
        return [MongoNotification(doc) for doc in cursor]

    def create_notification(self, user_id: int, title: str, message: str) -> Any:
        next_id = self._get_next_id("notifications")
        notif_doc = {
            "id": next_id,
            "user_id": user_id,
            "title": title,
            "message": message,
            "read": False,
            "created_at": datetime.datetime.utcnow()
        }
        self.db.notifications.insert_one(notif_doc)
        return MongoNotification(notif_doc)

    def get_admin_stats(self) -> dict:
        total = self.db.issues.count_documents({})
        in_progress = self.db.issues.count_documents({"status": "In Progress"})
        resolved = self.db.issues.count_documents({"status": "Resolved"})
        high_priority = self.db.issues.count_documents({"priority": "High"})
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

    # Seeding helpers
    def seed_user(self, email, hashed_password, full_name, role, credits, xp, level, avatar) -> int:
        next_id = self._get_next_id("users")
        user_doc = {
            "id": next_id,
            "email": email,
            "hashed_password": hashed_password,
            "full_name": full_name,
            "role": role,
            "credits": credits,
            "xp": xp,
            "level": level,
            "avatar": avatar
        }
        self.db.users.insert_one(user_doc)
        return next_id

    def seed_issue(self, id, citizen_id, title, description, category, priority, status, latitude, longitude, image_url, created_at) -> int:
        issue_doc = {
            "id": id,
            "citizen_id": citizen_id,
            "title": title,
            "description": description,
            "category": category,
            "priority": priority,
            "status": status,
            "latitude": latitude,
            "longitude": longitude,
            "image_url": image_url,
            "created_at": created_at
        }
        self.db.issues.insert_one(issue_doc)
        return id

    def seed_task(self, id, issue_id, solver_id, status, before_image, after_image, accepted_at, completed_at):
        task_doc = {
            "id": id,
            "issue_id": issue_id,
            "solver_id": solver_id,
            "status": status,
            "before_image": before_image,
            "after_image": after_image,
            "accepted_at": accepted_at,
            "completed_at": completed_at
        }
        self.db.tasks.insert_one(task_doc)

    def seed_alert(self, text, type, time_ago, created_at):
        next_id = self._get_next_id("alerts")
        alert_doc = {
            "id": next_id,
            "text": text,
            "type": type,
            "time_ago": time_ago,
            "created_at": created_at
        }
        self.db.alerts.insert_one(alert_doc)

    def seed_notification(self, user_id, title, message, read, created_at):
        next_id = self._get_next_id("notifications")
        notif_doc = {
            "id": next_id,
            "user_id": user_id,
            "title": title,
            "message": message,
            "read": read,
            "created_at": created_at
        }
        self.db.notifications.insert_one(notif_doc)
