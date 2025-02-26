from datetime import datetime
from typing import Dict, List, Optional

from sqlmodel import Field, JSON, Relationship, SQLModel


class MessageMetadata(SQLModel):
    """Message metadata model."""
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None  # For audio/video
    dimensions: Optional[Dict] = None
    reactions: Optional[List[Dict]] = None


class ChatBase(SQLModel):
    """Base Chat model with common attributes."""
    type: str = Field(default="GROUP")  # DIRECT, GROUP, CHANNEL
    name: Optional[str] = None
    avatar: Optional[str] = None


class Chat(ChatBase, table=True):
    """Chat model for database table."""
    __tablename__ = "chats"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    organization_id: str = Field(foreign_key="organizations.id")
    
    # Relationships
    members: List["ChatMember"] = Relationship(
        back_populates="chat",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    messages: List["Message"] = Relationship(
        back_populates="chat",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class ChatMemberBase(SQLModel):
    """Base ChatMember model with common attributes."""
    role: str = Field(default="MEMBER")  # OWNER, ADMIN, MEMBER


class ChatMember(ChatMemberBase, table=True):
    """ChatMember model for database table."""
    __tablename__ = "chat_members"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    last_read: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign keys
    chat_id: str = Field(foreign_key="chats.id")
    user_id: str = Field(foreign_key="users.id")
    
    # Relationships
    chat: Chat = Relationship(back_populates="members")


class MessageBase(SQLModel):
    """Base Message model with common attributes."""
    content: str
    type: str = Field(default="TEXT")  # TEXT, IMAGE, FILE, AUDIO, VIDEO, SYSTEM
    metadata: Optional[MessageMetadata] = Field(default_factory=MessageMetadata, sa_type=JSON)


class Message(MessageBase, table=True):
    """Message model for database table."""
    __tablename__ = "messages"
    
    id: Optional[str] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None
    
    # Foreign keys
    chat_id: str = Field(foreign_key="chats.id")
    sender_id: str = Field(foreign_key="users.id")
    reply_to_id: Optional[str] = Field(default=None, foreign_key="messages.id")
    
    # Relationships
    chat: Chat = Relationship(back_populates="messages")
    replies: List["Message"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Message.id == Message.reply_to_id",
            "remote_side": "Message.reply_to_id",
        }
    )


# Schema models for API
class ChatCreate(ChatBase):
    """Schema for chat creation."""
    organization_id: str
    member_ids: List[str]


class ChatRead(ChatBase):
    """Schema for reading chat data."""
    id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime


class ChatUpdate(SQLModel):
    """Schema for updating chat data."""
    name: Optional[str] = None
    avatar: Optional[str] = None


class ChatMemberCreate(ChatMemberBase):
    """Schema for chat member creation."""
    user_id: str


class ChatMemberRead(ChatMemberBase):
    """Schema for reading chat member data."""
    id: str
    chat_id: str
    user_id: str
    joined_at: datetime
    last_read: datetime


class MessageCreate(MessageBase):
    """Schema for message creation."""
    chat_id: str
    sender_id: str
    reply_to_id: Optional[str] = None


class MessageRead(MessageBase):
    """Schema for reading message data."""
    id: str
    chat_id: str
    sender_id: str
    reply_to_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None


class MessageUpdate(SQLModel):
    """Schema for updating message data."""
    content: Optional[str] = None
    metadata: Optional[MessageMetadata] = None
    deleted_at: Optional[datetime] = None 