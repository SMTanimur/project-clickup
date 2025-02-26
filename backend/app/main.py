from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.api import api_router
from app.core.config import settings
from app.db.session import create_db_and_tables

# Create FastAPI app
app = FastAPI(
    title="ClickUp Clone API",
    description="API for ClickUp clone application",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_PREFIX)


# Create database tables on startup in development mode
@app.on_event("startup")
def on_startup():
    if settings.ENVIRONMENT == "development":
        create_db_and_tables()


# Health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return JSONResponse(
        status_code=200,
        content={"status": "ok", "message": "API is running"},
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    ) 