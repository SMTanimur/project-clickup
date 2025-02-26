from fastapi import APIRouter

from app.api import auth, organizations, tasks, users

# Main API router
api_router = APIRouter()

# Include all API endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"]) 