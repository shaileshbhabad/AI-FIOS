@echo off
TITLE AI-FIOS - AI Financial Intelligence Operating System
echo =====================================================================
echo  AI-FIOS: AI FINANCIAL INTELLIGENCE OPERATING SYSTEM (v2.0 PRO)
echo  8-Layer Architecture - 11 Domain Agents - Causal Knowledge Graph
echo =====================================================================
echo.
echo [1/2] Verifying Python environment...
python --version
if errorlevel 1 (
    echo Python not found! Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting AI-FIOS Unified Server (Backend API + Interactive UI)...
echo Terminal UI and API will be live at: http://127.0.0.1:8000
echo.
start "" http://127.0.0.1:8000
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
