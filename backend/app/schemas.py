from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    credits: int
    xp: int
    level: int
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# Issue Schemas
class IssueBase(BaseModel):
    title: str
    description: str
    category: str
    priority: str
    latitude: float
    longitude: float

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id: int
    citizen_id: int
    status: str
    image_url: Optional[str] = None
    created_at: datetime
    citizen: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Task Schemas
class TaskResponse(BaseModel):
    id: int
    issue_id: int
    solver_id: int
    status: str
    before_image: Optional[str] = None
    after_image: Optional[str] = None
    accepted_at: datetime
    completed_at: Optional[datetime] = None
    issue: Optional[IssueResponse] = None
    solver: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# Notification Schemas
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    text: str
    type: str
    time_ago: str

    class Config:
        from_attributes = True


# Admin Charts & Stats
class AdminStats(BaseModel):
    total_issues: int
    total_issues_change: str
    in_progress: int
    in_progress_change: str
    resolved: int
    resolved_change: str
    high_priority: int
    high_priority_change: str

class ChartPoint(BaseModel):
    date: str
    reported: int
    resolved: int

class CategoryData(BaseModel):
    label: str
    percentage: str
    count: int

class PriorityData(BaseModel):
    label: str
    count: int
