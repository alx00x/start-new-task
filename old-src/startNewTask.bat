@echo off

setlocal EnableDelayedExpansion

for /F "skip=1 tokens=1-6" %%A in ('WMIC Path Win32_LocalTime Get Day^,Hour^,Minute^,Month^,Second^,Year /Format:table') do (
    if "%%B" NEQ "" (
        set /A FDATE=%%F*10000+%%D*100+%%A
        set /A FTIME=%%B*10000+%%C*100+%%E
        set FDATEshort=!FDATE:~2,6!
    )
)

set taskdate=!FDATEshort!

set i=0
for /F %%a in (files\folderList.txt) do (
   set /A i+=1
   set array[!i!]=%%a
)
set n=%i%

:definedirs
set /P gamename= Game Name: 
set /P taskname= Task Name: 

set foldername=!taskdate!_!gamename!_!taskname!
set projectname=!gamename!_!taskname!

if exist !foldername! ( goto :error ) else ( goto :makedirs )

:error
echo -------------------------------------------------------------
echo Project already exists, please choose another name.
echo -------------------------------------------------------------
goto :definedirs

:makedirs
mkdir !foldername!
cd !foldername!
for /L %%i in (1,1,%n%) do mkdir !array[%%i]!
set projectpath=%CD%\aep\!projectname!_v001.aep
cd..

:start
tasklist /FI "IMAGENAME eq afterfx.exe" 2>NUL | find /I /N "afterfx.exe">NUL
if "%ERRORLEVEL%"=="0" ( goto :stop ) else ( goto :run )

:run
start /B afterfx.exe
echo Please Wait
ping 192.0.2.2 -n 1 -w 20000 > nul

set projectpath=!projectpath:\=/!
set aesendprojectpath=var projectFile = new File ("!projectpath!")
set aesendprojectname=var projectName = "!projectname!"
set aesendtaskname=var taskName = "!taskname!"

afterfx.exe -s !aesendprojectpath!
afterfx.exe -s !aesendprojectname!
afterfx.exe -s !aesendtaskname!
afterfx -r %CD%\files\startNewTask.jsx
goto :finish

:stop
echo -------------------------------------------------------------
echo The program is running, please close After Effects.
echo -------------------------------------------------------------
pause
cls

echo.
echo  Please Wait
echo  ---------------------------------------
echo  []                              =   0 ]
echo  ---------------------------------------
ping 192.0.2.2 -n 1 -w 2000 > nul
cls
echo.
echo  Please Wait
echo  ---------------------------------------
echo  [][][]                          =  25 ]
echo  ---------------------------------------
ping 192.0.2.2 -n 1 -w 2000 > nul
cls
echo.
echo  Please Wait
echo  ---------------------------------------
echo  [][][][][][][][]                =  50 ]
echo  ---------------------------------------
ping 192.0.2.2 -n 1 -w 2000 > nul
cls
echo.
echo  Please Wait
echo  ---------------------------------------
echo  [][][][][][][][][][][][]        =  75 ]
echo  ---------------------------------------
ping 192.0.2.2 -n 1 -w 2000 > nul
cls
echo.
echo  Please Wait
echo  ---------------------------------------
echo  [][][][][][][][][][][][][][][][]= 100 ]
echo  ---------------------------------------
ping 192.0.2.2 -n 1 -w 2000 > nul
cls

goto :start

:finish
cls
cmd /K "C: & cd C:\"