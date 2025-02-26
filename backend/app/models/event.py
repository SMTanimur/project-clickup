from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, JSON, Relationship, SQLModel


class EventRecurrence(SQLModel):
    """Event recurrence model."""
    frequency: str  # DAILY, WEEKLY, MONTHLY, YEARLY
    interval: Optional[int] = 1
    end_date: Optional[datetime] = None
    end_count: Optional[int] = None
    days_of_week: Optional[List[int]] = None
    month_day: Optional[int] = None
    week_number: Optional[int] = None


class EventBase(SQLModel):
    """Base Event model with common attributes."""
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: datetime
    end_time: datetime
    is_all_day: bool = False
    recurrence: Optional[EventRecurrence] = Field(default=None, sa_type=JSON)


class Event(EventBase, table=True):
    """Event model for database table."""
    __tablename__ = "events"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    creator_id: str = Field(foreign_key="users.id")
    
    # Relationships
    attendees: List["EventAttendee"] = Relationship(
        back_populates="event",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class EventAttendeeBase(SQLModel):
    """Base EventAttendee model with common attributes."""
    status: str = Field(default="PENDING")  # PENDING, ACCEPTED, DECLINED, TENTATIVE


class EventAttendee(EventAttendeeBase, table=True):
    """EventAttendee model for database table."""
    __tablename__ = "event_attendees"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    event_id: str = Field(foreign_key="events.id")
    user_id: str = Field(foreign_key="users.id")
    
    # Relationships
    event: Event = Relationship(back_populates="attendees")


class MeetingBase(SQLModel):
    """Base Meeting model with common attributes."""
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    meeting_url: Optional[str] = None
    recording_url: Optional[str] = None


class Meeting(MeetingBase, table=True):
    """Meeting model for database table."""
    __tablename__ = "meetings"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organizer_id: str = Field(foreign_key="users.id")
    
    # Relationships
    attendees: List["MeetingAttendee"] = Relationship(
        back_populates="meeting",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class MeetingAttendeeBase(SQLModel):
    """Base MeetingAttendee model with common attributes."""
    status: str = Field(default="PENDING")  # PENDING, ACCEPTED, DECLINED, TENTATIVE
    joined_at: Optional[datetime] = None
    left_at: Optional[datetime] = None


class MeetingAttendee(MeetingAttendeeBase, table=True):
    """MeetingAttendee model for database table."""
    __tablename__ = "meeting_attendees"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    
    # Foreign keys
    meeting_id: str = Field(foreign_key="meetings.id")
    user_id: str = Field(foreign_key="users.id")
    
    # Relationships
    meeting: Meeting = Relationship(back_populates="attendees")


# Schema models for API
class EventCreate(EventBase):
    """Schema for event creation."""
    organization_id: str
    creator_id: str
    attendee_ids: Optional[List[str]] = None


class EventRead(EventBase):
    """Schema for reading event data."""
    id: str
    organization_id: str
    creator_id: str
    created_at: datetime
    updated_at: datetime


class EventUpdate(SQLModel):
    """Schema for updating event data."""
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    is_all_day: Optional[bool] = None
    recurrence: Optional[EventRecurrence] = None


class EventAttendeeCreate(EventAttendeeBase):
    """Schema for event attendee creation."""
    user_id: str


class EventAttendeeRead(EventAttendeeBase):
    """Schema for reading event attendee data."""
    id: str
    event_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class EventAttendeeUpdate(SQLModel):
    """Schema for updating event attendee data."""
    status: Optional[str] = None


class MeetingCreate(MeetingBase):
    """Schema for meeting creation."""
    organizer_id: str
    attendee_ids: Optional[List[str]] = None


class MeetingRead(MeetingBase):
    """Schema for reading meeting data."""
    id: str
    organizer_id: str
    created_at: datetime
    updated_at: datetime


class MeetingUpdate(SQLModel):
    """Schema for updating meeting data."""
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    meeting_url: Optional[str] = None
    recording_url: Optional[str] = None


class MeetingAttendeeCreate(MeetingAttendeeBase):
    """Schema for meeting attendee creation."""
    user_id: str


class MeetingAttendeeRead(MeetingAttendeeBase):
    """Schema for reading meeting attendee data."""
    id: str
    meeting_id: str
    user_id: str


class MeetingAttendeeUpdate(SQLModel):
    """Schema for updating meeting attendee data."""
    status: Optional[str] = None
    joined_at: Optional[datetime] = None
    left_at: Optional[datetime] = None 