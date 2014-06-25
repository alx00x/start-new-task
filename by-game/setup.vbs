Set fso = CreateObject("Scripting.FileSystemObject")
Dim objShell, currentDir, epxPath
Set objShell = CreateObject("Shell.Application")
currentDir = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".")
epxPath = currentDir & "\epx\"

If Not fso.FolderExists("D:\epx") Then
    fso.CreateFolder "D:\epx"
End If

fso.CopyFile epxPath & "startNewTask.bat", "D:\epx\", true
fso.CopyFile epxPath & "startNewTaskNetwork.vbs", "D:\epx\", true
fso.CopyFile epxPath & "startNewTaskScript.jsx", "D:\epx\", true
fso.CopyFile epxPath & "startNewTaskStructure.xml", "D:\epx\", true

msg = MsgBox("Setup finished.", 0, "setup.vbs")

WScript.Quit()