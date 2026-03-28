@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
echo Waiting 3 seconds...
timeout /t 3
echo Starting fresh backend server...
cd /d "%~dp0"
cd backend
node server.js
pause
