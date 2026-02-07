@echo off
REM Start Flask server script for Windows

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    echo Please install Python 3.7 or higher and try again.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
set VENV_CREATED=false
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
    set VENV_CREATED=true
)

REM Activate virtual environment
call .venv\Scripts\activate

REM Install dependencies only if virtual environment was just created
if "%VENV_CREATED%"=="true" (
    echo Installing dependencies...
    pip install -r requirements.txt
)

REM Start Flask server
echo Starting Flask server...
python app.py

pause