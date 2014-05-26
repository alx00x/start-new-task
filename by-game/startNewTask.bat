@echo off

tasklist /FI "IMAGENAME eq afterfx.exe" 2>NUL | find /I /N "afterfx.exe">NUL
if "%ERRORLEVEL%"=="0" ( goto :stop ) else ( goto :run )

:run
start /WAIT afterfx.exe -r %CD%\startNewTaskScript.jsx
goto :end

:stop
echo You'll have to close all running instances of After Effects first.
echo.
echo.
pause
cls

:end
exit