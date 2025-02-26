from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel

from app.models.organization import OrganizationMember


class UserBase(SQLModel):
    """Base User model with common attributes."""
    email: str = Field(index=True, unique=True)
    name: str
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    phone_number: Optional[str] = None
    status: str = Field(default="ACTIVE")  # ACTIVE, INACTIVE, SUSPENDED
    timezone: str = Field(default="UTC")
    language: str = Field(default="en")


class User(UserBase, table=True):
    """User model for database table."""
    __tablename__ = "users"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    organization_memberships: List["OrganizationMember"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class UserCreate(UserBase):
    """Schema for user creation."""
    password: str


class UserRead(UserBase):
    """Schema for reading user data."""
    id: str
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    name: Optional[str] = None
    display_name: Optional[str] = None
    avatar: Optional[str] = None
    phone_number: Optional[str] = None
    status: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    password: Optional[str] = None 