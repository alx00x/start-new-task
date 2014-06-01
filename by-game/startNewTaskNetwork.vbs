Dim fso, GameName, TaskName, CreateShortcut
Set fso = CreateObject("Scripting.FileSystemObject")
Set objArgs = WScript.Arguments

GameName = objArgs(0)
TaskName = objArgs(1)
CreateShortcut = objArgs(2)

Dim objXMLDoc, NodeList
Dim SelectedNode, FolderName, NodePath, PathArray
Dim NetworkPath, GamePath, TaskPath

Set objXMLDoc = CreateObject("Microsoft.XMLDOM")
objXMLDoc.async = False
objXMLDoc.load("startNewTaskStructure.xml")

Set RootNode = objXMLDoc.documentElement.selectSingleNode("//root")
NetworkPath = RootNode.getAttribute("network")
GamePath = NetworkPath & "\" & GameName
TaskPath = GamePath & "\" & TaskName

Set NodeList = objXMLDoc.getElementsByTagName("dir")
PathArray = array()
For Each Elem In NodeList
    Set SelectedNode = Elem
    Do Until SelectedNode.nodeName = "root"
        FolderName = "\" & SelectedNode.getAttribute("name")
        NodePath = FolderName & NodePath
        Set SelectedNode = SelectedNode.parentNode
    Loop
    ReDim Preserve PathArray(UBound(PathArray) + 1)
    PathArray(UBound(PathArray)) = TaskPath & NodePath
    NodePath = ""
Next

If Not fso.FolderExists(GamePath) Then
    Set GameFolder = fso.CreateFolder(GamePath) 
End If

If fso.FolderExists(TaskPath) Then
    MsgBox("Conflict: This task has already been created on the network location.")
    WScript.Quit
Else
    Set TaskFolder = fso.CreateFolder(TaskPath)
    For Each Path In PathArray
        fso.CreateFolder(Path)
    Next
End If

If CreateShortcut = "true" Then
    MsgBox("true")
End If