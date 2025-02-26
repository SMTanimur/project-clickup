from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.deps import get_current_active_user
from app.db.session import get_session
from app.models.user import User, UserRead, UserUpdate
from app.services.user import UserService

router = APIRouter()


@router.get("/me", response_model=UserRead)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user information.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user information
    """
    return current_user


@router.put("/me", response_model=UserRead)
def update_current_user(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Update current user information.
    
    Args:
        user_in: User update data
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        Updated user information
    """
    updated_user = UserService.update_user(db, current_user.id, user_in)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return updated_user


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session),
) -> Any:
    """
    Get user by ID.
    
    Args:
        user_id: User ID
        current_user: Current authenticated user
        db: Database session
        
    Returns:
        User information
    """
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user 