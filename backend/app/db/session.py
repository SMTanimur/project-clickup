from typing import Generator

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# Convert PostgreSQL URL to SQLAlchemy format
# Replace postgresql:// with postgresql+psycopg2:// for synchronous operations
SQLALCHEMY_DATABASE_URL = str(settings.DATABASE_URL).replace(
    "postgresql://", "postgresql+psycopg2://"
)

# Create engine with connection pool settings
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
)


def get_session() -> Generator[Session, None, None]:
    """
    Get a SQLModel session for database operations.
    Yields a session and ensures it's closed after use.
    """
    with Session(engine) as session:
        yield session


def create_db_and_tables() -> None:
    """
    Create all tables defined in SQLModel models.
    This is used for development and testing.
    In production, use Alembic migrations instead.
    """
    SQLModel.metadata.create_all(engine) 