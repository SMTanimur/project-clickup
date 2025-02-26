# ClickUp Clone Backend

A FastAPI backend for a ClickUp clone application with PostgreSQL database, JWT authentication, and Docker support.

## Features

- User authentication with JWT tokens
- Organization and team management
- Task management
- Document management
- Chat functionality
- Event and meeting scheduling
- Approval workflows

## Tech Stack

- FastAPI - Modern, fast web framework for building APIs
- SQLModel - ORM for SQL databases based on Pydantic and SQLAlchemy
- PostgreSQL - Relational database
- Alembic - Database migration tool
- Poetry - Dependency management
- Docker - Containerization
- JWT - Authentication
- Bcrypt - Password hashing

## Getting Started

### Using Docker

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command:

```bash
docker-compose up -d
```

This will start the backend API and PostgreSQL database.

### Manual Setup

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
poetry install
```

4. Set up environment variables (copy .env.example to .env and fill in the values)
5. Run the database migrations:

```bash
poetry run alembic upgrade head
```

6. Start the development server:

```bash
poetry run uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/clickup
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Project Structure

```
backend/
├── app/
│   ├── api/            # API endpoints
│   ├── core/           # Core functionality (config, security)
│   ├── db/             # Database setup and session management
│   ├── models/         # SQLModel models
│   ├── schemas/        # Pydantic schemas for request/response
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── alembic/            # Database migrations
├── tests/              # Test cases
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── pyproject.toml      # Poetry configuration
└── README.md           # Project documentation
```
