from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Token payload schema."""
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None


class Login(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str


class RefreshToken(BaseModel):
    """Refresh token request schema."""
    refresh_token: str 