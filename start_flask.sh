#!/bin/bash
# Start Flask server script for Linux/Mac

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH."
    echo "Please install Python 3.7 or higher and try again."
    exit 1
fi

# Create virtual environment if it doesn't exist
VENV_CREATED=false
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    VENV_CREATED=true
fi

# Activate virtual environment
source .venv/bin/activate

# Install dependencies only if virtual environment was just created
if [ "$VENV_CREATED" = true ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Start Flask server
echo "Starting Flask server..."
python app.py
