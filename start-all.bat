@echo off
title Public Utility Status - Full-Stack Launcher
echo ======================================================================
echo    PUBLIC UTILITY STATUS - FULL-STACK CIVIC PORTAL
echo    Course: Essentials of Web Programming (EWP) Lab Examination
echo ======================================================================
echo.
echo Starting Express.js Backend Server on port 3000...
start "Express Backend (Port 3000)" cmd /k "cd backend && npm start"

echo Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak > nul

echo Starting Angular Frontend Server on port 4200...
start "Angular Frontend (Port 4200)" cmd /k "cd frontend && npm start"

echo.
echo ======================================================================
echo Servers launched!
echo - Backend API:     http://localhost:3000/api/utilities
echo - Angular Web App: http://localhost:4200/
echo - Standalone JS:   http://localhost:4200/javascript-demo.html
echo ======================================================================
echo.
pause
