from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlmodel import Session

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token
from app.db.session import get_session
from app.models.user import User, UserCreate, UserRead
from app.schemas.auth import Login, RefreshToken, Token, TokenPayload
from app.services.user import UserService

router = APIRouter()


@router.post("/login", response_model=Token)
def login(
    login_data: Login,
    db: Session = Depends(get_session),
) -> Any:
    """
    Login endpoint.
    
    Args:
        login_data: Login credentials
        db: Database session
        
    Returns:
        Access and refresh tokens
    """
    user = UserService.authenticate(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )
    
    # Create access and refresh tokens
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/signup", response_model=UserRead)
def signup(
    user_in: UserCreate,
    db: Session = Depends(get_session),
) -> Any:
    """
    Signup endpoint.
    
    Args:
        user_in: User creation data
        db: Database session
        
    Returns:
        Created user
    """
    # Check if user already exists
    existing_user = UserService.get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    # Create new user
    user = UserService.create_user(db, user_in)
    return user


@router.post("/refresh", response_model=Token)
def refresh_token(
    refresh_token_data: RefreshToken,
    db: Session = Depends(get_session),
) -> Any:
    """
    Refresh token endpoint.
    
    Args:
        refresh_token_data: Refresh token
        db: Database session
        
    Returns:
        New access and refresh tokens
    """
    try:
        # Decode refresh token
        payload = jwt.decode(
            refresh_token_data.refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        token_data = TokenPayload(**payload)
        
        # Check if token is a refresh token
        if token_data.type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from token
        user = UserService.get_user(db, token_data.sub)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if user.status != "ACTIVE":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user account",
            )
        
        # Create new access and refresh tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        ) 