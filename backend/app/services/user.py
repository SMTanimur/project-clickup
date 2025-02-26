from typing import Optional
from uuid import uuid4

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models.user import User, UserCreate, UserUpdate


class UserService:
    """Service for user-related operations."""
    
    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        """
        Create a new user.
        
        Args:
            db: Database session
            user_in: User creation data
            
        Returns:
            Created user
        """
        db_user = User(
            id=str(uuid4()),
            email=user_in.email,
            name=user_in.name,
            display_name=user_in.display_name,
            password=get_password_hash(user_in.password),
            avatar=user_in.avatar,
            phone_number=user_in.phone_number,
            status=user_in.status,
            timezone=user_in.timezone,
            language=user_in.language,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_user(db: Session, user_id: str) -> Optional[User]:
        """
        Get a user by ID.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User if found, None otherwise
        """
        return db.get(User, user_id)
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Get a user by email.
        
        Args:
            db: Database session
            email: User email
            
        Returns:
            User if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        return db.exec(statement).first()
    
    @staticmethod
    def update_user(db: Session, user_id: str, user_in: UserUpdate) -> Optional[User]:
        """
        Update a user.
        
        Args:
            db: Database session
            user_id: User ID
            user_in: User update data
            
        Returns:
            Updated user if found, None otherwise
        """
        db_user = UserService.get_user(db, user_id)
        if not db_user:
            return None
        
        user_data = user_in.model_dump(exclude_unset=True)
        
        # Hash password if provided
        if "password" in user_data and user_data["password"]:
            user_data["password"] = get_password_hash(user_data["password"])
        
        for key, value in user_data.items():
            setattr(db_user, key, value)
        
        db_user.updated_at = db.update_now()
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """
        Delete a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            True if deleted, False if not found
        """
        db_user = UserService.get_user(db, user_id)
        if not db_user:
            return False
        
        db.delete(db_user)
        db.commit()
        return True
    
    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user.
        
        Args:
            db: Database session
            email: User email
            password: User password
            
        Returns:
            User if authenticated, None otherwise
        """
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user 