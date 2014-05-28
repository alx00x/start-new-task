Set objArgs = WScript.Arguments
Dim AfterFolderName, GameName, TaskName, CreateShortcut

AfterFolderName = objArgs(0)
GameName = objArgs(1)
TaskName = objArgs(2)
CreateShortcut = objArgs(3)

Const ForReading = 1
Set fso = CreateObject("Scripting.FileSystemObject")
Set textFile = fso.OpenTextFile("startNewTaskList.txt", ForReading)
Set folderNames = CreateObject("System.Collections.ArrayList")
Do Until textFile.AtEndOfStream
    folderNames.Add textFile.ReadLine
Loop
textFile.Close

folderNames.Add AfterFolderName

for each x in folderNames
    msgbox x
next



If CreateShortcut = "true" Then
    MsgBox "true"
End If
