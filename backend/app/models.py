import datetime
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False) # "citizen", "solver", "admin"
    credits = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    avatar = Column(String, nullable=True)

    issues = relationship("Issue", back_populates="citizen")
    tasks = relationship("Task", back_populates="solver")
    notifications = relationship("Notification", back_populates="user")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    priority = Column(String, nullable=False) # "High", "Medium", "Low"
    status = Column(String, default="Pending") # "Pending", "In Progress", "Completed", "Resolved"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    citizen = relationship("User", back_populates="issues")
    tasks = relationship("Task", back_populates="issue")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=False)
    solver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="In Progress") # "In Progress", "Completed", "Approved", "Rejected"
    before_image = Column(String, nullable=True)
    after_image = Column(String, nullable=True)
    accepted_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    issue = relationship("Issue", back_populates="tasks")
    solver = relationship("User", back_populates="tasks")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    type = Column(String, default="info") # "info", "warning", "success", "alert"
    time_ago = Column(String, nullable=False) # Text like "10 mins ago"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
