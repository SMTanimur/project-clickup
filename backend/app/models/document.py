from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, JSON, Relationship, SQLModel


class DocumentPermissions(SQLModel):
    """Document permissions model."""
    public: bool = False
    roles: List[Dict] = Field(default_factory=list)
    users: List[Dict] = Field(default_factory=list)


class DocumentBase(SQLModel):
    """Base Document model with common attributes."""
    title: str
    content: str
    type: str = Field(default="DOC")  # DOC, SHEET, SLIDE, WIKI, FORM
    is_template: bool = False
    permissions: DocumentPermissions = Field(default_factory=DocumentPermissions, sa_type=JSON)


class Document(DocumentBase, table=True):
    """Document model for database table."""
    __tablename__ = "documents"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    creator_id: str = Field(foreign_key="users.id")
    parent_id: Optional[str] = Field(default=None, foreign_key="documents.id")
    
    # Relationships
    children: List["Document"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Document.id == Document.parent_id",
            "remote_side": "Document.parent_id",
        }
    )
    edits: List["DocumentEdit"] = Relationship(
        back_populates="document",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class DocumentEditChanges(SQLModel):
    """Document edit changes model."""
    type: str  # insert, delete, replace
    position: int
    content: Optional[str] = None
    length: Optional[int] = None
    metadata: Optional[Dict] = None


class DocumentEditBase(SQLModel):
    """Base DocumentEdit model with common attributes."""
    changes: List[DocumentEditChanges] = Field(sa_type=JSON)


class DocumentEdit(DocumentEditBase, table=True):
    """DocumentEdit model for database table."""
    __tablename__ = "document_edits"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    document_id: str = Field(foreign_key="documents.id")
    editor_id: str = Field(foreign_key="users.id")
    
    # Relationships
    document: Document = Relationship(back_populates="edits")


# Schema models for API
class DocumentCreate(DocumentBase):
    """Schema for document creation."""
    organization_id: str
    creator_id: str
    parent_id: Optional[str] = None


class DocumentRead(DocumentBase):
    """Schema for reading document data."""
    id: str
    organization_id: str
    creator_id: str
    parent_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class DocumentUpdate(SQLModel):
    """Schema for updating document data."""
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    is_template: Optional[bool] = None
    permissions: Optional[DocumentPermissions] = None
    parent_id: Optional[str] = None


class DocumentEditCreate(DocumentEditBase):
    """Schema for document edit creation."""
    document_id: str
    editor_id: str


class DocumentEditRead(DocumentEditBase):
    """Schema for reading document edit data."""
    id: str
    document_id: str
    editor_id: str
    created_at: datetime 