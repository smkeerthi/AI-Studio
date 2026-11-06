@echo off
title AI Creative Studio — Launcher
color 05
cls

echo ======================================================================
echo           AI CREATIVE STUDIO - PERSONAL GENERATIVE SUITE
echo ======================================================================
echo  Zero Paid Subscriptions - Zero Mandatory Paid APIs - 100%% Free
echo  Hardware: 8 GB RAM / GT 630M (2GB VRAM Safe Mode)
echo ======================================================================
echo.

echo [1/3] Checking environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

echo [2/3] Launching FastAPI Backend (Port 8000)...
start "AI Creative Studio Backend" cmd /k "python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000"

echo [3/3] Launching React Vite Frontend (Port 5173)...
cd /d "%~dp0frontend"
start "AI Creative Studio Frontend" cmd /k "npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ======================================================================
echo  Studio is starting!
echo  Opening browser at http://localhost:5173 ...
echo ======================================================================
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo Both servers are running. Close the terminal windows to shut down.
exit /b 0
