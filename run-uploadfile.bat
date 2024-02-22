@echo off
cd /d %~dp0
powershell node uploadfile.js
pause