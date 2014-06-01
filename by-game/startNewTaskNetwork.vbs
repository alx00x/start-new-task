Set objArgs = WScript.Arguments
Dim GameName, TaskName, CreateShortcut

GameName = objArgs(0)
TaskName = objArgs(1)
CreateShortcut = objArgs(2)

Const ForReading = 1
Set fso = CreateObject("Scripting.FileSystemObject")
Set textFile = fso.OpenTextFile("startNewTaskList.txt", ForReading)
Set folderNames = CreateObject("System.Collections.ArrayList")
Do Until textFile.AtEndOfStream
    folderNames.Add textFile.ReadLine
Loop
textFile.Close

for each x in folderNames
    msgbox x
next


If CreateShortcut = "true" Then
    MsgBox "true"
End If
