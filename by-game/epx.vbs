Set fso = CreateObject("Scripting.FileSystemObject")
Dim objShell, currentDir, epxPath
Set objShell = CreateObject("Shell.Application")
currentDir = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".")
epxPath = currentDir & "\epx\"

If Not fso.FolderExists("D:\epx") Then
    fso.CreateFolder "D:\epx"
End If

objFSO.CopyFile epxPath & "startNewTask.bat", "D:\epx\", OverwriteExisting
objFSO.CopyFile epxPath & "startNewTaskNetwork.vbs", "D:\epx\", OverwriteExisting
objFSO.CopyFile epxPath & "startNewTaskScript.jsx", "D:\epx\", OverwriteExisting
objFSO.CopyFile epxPath & "startNewTaskStructure.xml", "D:\epx\", OverwriteExisting

WScript.Quit()