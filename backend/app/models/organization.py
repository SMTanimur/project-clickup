from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, JSON, Relationship, SQLModel


class OrganizationSettings(SQLModel):
    """Organization settings model."""
    allow_public_projects: bool = False
    default_timezone: str = "UTC"
    default_language: str = "en"
    security_settings: Optional[Dict] = None
    branding: Optional[Dict] = None


class OrganizationBase(SQLModel):
    """Base Organization model with common attributes."""
    name: str
    domain: Optional[str] = None
    logo: Optional[str] = None
    settings: Optional[OrganizationSettings] = Field(default_factory=OrganizationSettings, sa_type=JSON)


class Organization(OrganizationBase, table=True):
    """Organization model for database table."""
    __tablename__ = "organizations"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    members: List["OrganizationMember"] = Relationship(
        back_populates="organization",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    teams: List["Team"] = Relationship(
        back_populates="organization",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class OrganizationMemberBase(SQLModel):
    """Base OrganizationMember model with common attributes."""
    role: str = Field(default="MEMBER")  # OWNER, ADMIN, MEMBER, GUEST
    department: Optional[str] = None
    title: Optional[str] = None


class OrganizationMember(OrganizationMemberBase, table=True):
    """OrganizationMember model for database table."""
    __tablename__ = "organization_members"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    user_id: str = Field(foreign_key="users.id")
    
    # Relationships
    organization: Organization = Relationship(back_populates="members")
    user: "User" = Relationship(back_populates="organization_memberships")
    team_memberships: List["TeamMember"] = Relationship(
        back_populates="org_member",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class TeamBase(SQLModel):
    """Base Team model with common attributes."""
    name: str
    description: Optional[str] = None


class Team(TeamBase, table=True):
    """Team model for database table."""
    __tablename__ = "teams"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    
    # Relationships
    organization: Organization = Relationship(back_populates="teams")
    members: List["TeamMember"] = Relationship(
        back_populates="team",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class TeamMemberBase(SQLModel):
    """Base TeamMember model with common attributes."""
    role: str = Field(default="MEMBER")  # LEADER, MEMBER


class TeamMember(TeamMemberBase, table=True):
    """TeamMember model for database table."""
    __tablename__ = "team_members"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    team_id: str = Field(foreign_key="teams.id")
    org_member_id: str = Field(foreign_key="organization_members.id")
    
    # Relationships
    team: Team = Relationship(back_populates="members")
    org_member: OrganizationMember = Relationship(back_populates="team_memberships")


# Schema models for API
class OrganizationCreate(OrganizationBase):
    """Schema for organization creation."""
    pass


class OrganizationRead(OrganizationBase):
    """Schema for reading organization data."""
    id: str
    created_at: datetime
    updated_at: datetime


class OrganizationUpdate(SQLModel):
    """Schema for updating organization data."""
    name: Optional[str] = None
    domain: Optional[str] = None
    logo: Optional[str] = None
    settings: Optional[OrganizationSettings] = None


class TeamCreate(TeamBase):
    """Schema for team creation."""
    organization_id: str


class TeamRead(TeamBase):
    """Schema for reading team data."""
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime


class TeamUpdate(SQLModel):
    """Schema for updating team data."""
    name: Optional[str] = None
    description: Optional[str] = None 