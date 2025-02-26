#!/bin/bash

# Install Poetry if not already installed
if ! command -v poetry &> /dev/null; then
    echo "Poetry not found. Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
fi

# Configure Poetry to create virtual environments in the project directory
poetry config virtualenvs.in-project true

# Install dependencies
echo "Installing dependencies..."
poetry install

# Provide instructions for activating and using the environment
echo ""
echo "Virtual environment setup complete!"
echo ""
echo "To activate the virtual environment, run:"
echo "source $(poetry env info --path)/bin/activate"
echo ""
echo "Or use Poetry directly to run commands:"
echo "poetry run python -m app.main"
echo ""
echo "To run the application with uvicorn:"
echo "poetry run uvicorn app.main:app --reload"
echo ""
echo "To list all available Poetry commands:"
echo "poetry --help" 