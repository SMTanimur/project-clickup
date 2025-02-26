from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class TaskListBase(SQLModel):
    """Base TaskList model with common attributes."""
    name: str
    order: int = 0
    color: Optional[str] = None


class TaskList(TaskListBase, table=True):
    """TaskList model for database table."""
    __tablename__ = "task_lists"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    
    # Relationships
    tasks: List["Task"] = Relationship(
        back_populates="list",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class TaskBase(SQLModel):
    """Base Task model with common attributes."""
    title: str
    description: Optional[str] = None
    status: str = Field(default="TODO")  # TODO, IN_PROGRESS, COMPLETED, CANCELLED
    priority: str = Field(default="NORMAL")  # URGENT, HIGH, NORMAL, LOW
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class Task(TaskBase, table=True):
    """Task model for database table."""
    __tablename__ = "tasks"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    list_id: str = Field(foreign_key="task_lists.id")
    creator_id: str = Field(foreign_key="users.id")
    assignee_id: Optional[str] = Field(default=None, foreign_key="users.id")
    
    # Relationships
    list: TaskList = Relationship(back_populates="tasks")


# Schema models for API
class TaskListCreate(TaskListBase):
    """Schema for task list creation."""
    organization_id: str


class TaskListRead(TaskListBase):
    """Schema for reading task list data."""
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime


class TaskListUpdate(SQLModel):
    """Schema for updating task list data."""
    name: Optional[str] = None
    order: Optional[int] = None
    color: Optional[str] = None


class TaskCreate(TaskBase):
    """Schema for task creation."""
    list_id: str
    creator_id: str
    assignee_id: Optional[str] = None


class TaskRead(TaskBase):
    """Schema for reading task data."""
    id: str
    list_id: str
    creator_id: str
    assignee_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class TaskUpdate(SQLModel):
    """Schema for updating task data."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    list_id: Optional[str] = None
    assignee_id: Optional[str] = None 