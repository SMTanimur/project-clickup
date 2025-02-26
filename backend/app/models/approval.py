from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, JSON, Relationship, SQLModel


class ApprovalMetadata(SQLModel):
    """Approval metadata model."""
    leave: Optional[Dict] = None
    expense: Optional[Dict] = None
    purchase: Optional[Dict] = None
    custom: Optional[Dict] = None


class ApprovalBase(SQLModel):
    """Base Approval model with common attributes."""
    title: str
    description: Optional[str] = None
    status: str = Field(default="PENDING")  # PENDING, APPROVED, REJECTED, CANCELLED
    type: str = Field(default="CUSTOM")  # LEAVE, EXPENSE, PURCHASE, CUSTOM
    metadata: Optional[ApprovalMetadata] = Field(default_factory=ApprovalMetadata, sa_type=JSON)


class Approval(ApprovalBase, table=True):
    """Approval model for database table."""
    __tablename__ = "approvals"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    creator_id: str = Field(foreign_key="users.id")
    
    # Relationships
    steps: List["ApprovalStep"] = Relationship(
        back_populates="approval",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class ApprovalStepBase(SQLModel):
    """Base ApprovalStep model with common attributes."""
    order: int
    status: str = Field(default="PENDING")  # PENDING, APPROVED, REJECTED, CANCELLED
    comment: Optional[str] = None
    decided_at: Optional[datetime] = None


class ApprovalStep(ApprovalStepBase, table=True):
    """ApprovalStep model for database table."""
    __tablename__ = "approval_steps"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    approval_id: str = Field(foreign_key="approvals.id")
    approver_id: str = Field(foreign_key="users.id")
    
    # Relationships
    approval: Approval = Relationship(back_populates="steps")


# Schema models for API
class ApprovalCreate(ApprovalBase):
    """Schema for approval creation."""
    organization_id: str
    creator_id: str
    steps: List[Dict[str, any]]  # List of {approver_id, order}


class ApprovalRead(ApprovalBase):
    """Schema for reading approval data."""
    id: str
    organization_id: str
    creator_id: str
    created_at: datetime
    updated_at: datetime


class ApprovalUpdate(SQLModel):
    """Schema for updating approval data."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[ApprovalMetadata] = None


class ApprovalStepCreate(ApprovalStepBase):
    """Schema for approval step creation."""
    approval_id: str
    approver_id: str


class ApprovalStepRead(ApprovalStepBase):
    """Schema for reading approval step data."""
    id: str
    approval_id: str
    approver_id: str
    created_at: datetime
    updated_at: datetime


class ApprovalStepUpdate(SQLModel):
    """Schema for updating approval step data."""
    status: Optional[str] = None
    comment: Optional[str] = None
    decided_at: Optional[datetime] = None 