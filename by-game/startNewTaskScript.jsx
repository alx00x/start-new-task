// startNewTask.jsx
// 
// Name: startNewTask
// Author: Aleksandar Kocic
//
// Note: Builds structure by game.
// 

(function startNewTask(thisObj)
{
    var scriptpath = Folder(new File($.fileName)).parent;

    // Globals
    var aepFolderName = "after";

    var gamename; //game
    var taskname; //task

    var projectpath;
    var projectfile;
    var projectfolder;

    var startNewTask = new Object(); // Store globals in an object
    startNewTask.scriptNameShort = "SNT by game";
    startNewTask.scriptName = "Start New Task";
    startNewTask.scriptVersion = "1.4";
    startNewTask.scriptTitle = startNewTask.scriptName + " v" + startNewTask.scriptVersion;

    startNewTask.strGameName = {en: "Game Name"};
    startNewTask.strTaskName = {en: "Task Name"};

    startNewTask.strExecute = {en: "OK"};
    startNewTask.strCancel = {en: "Cancel"};

    startNewTask.strGameNameError = {en: "Please specify game name."};
    startNewTask.strTaskNameError = {en: "Please specify task name."};
    startNewTask.strSpacesError = {en: "You better not use spaces!"};
    startNewTask.strProjectError = {en: "This project already exists! Choose a different name."};

    startNewTask.strNetFolders = {en: "Create Network Folders"};
    startNewTask.strNetShortcut = {en: "Create Network Shortcut"};

    startNewTask.strHelp = {en: "?"};
    startNewTask.strHelpTitle = {en: "Help"};
    startNewTask.strHelpText = 
    {
        en: "This script creates an after effects project and a folder structure specified in folderList.txt\n" +
        "\n" +
        "Names:\n" +
        " - Game Name should be a proper abbreviation.\n" +
        " - Task Name is specified in a project spreadsheet.\n" +
        "\n"
    };

    // Localize
    function startNewTask_localize(strVar)
    {
        return strVar["en"];
    }

    // Build UI
    function startNewTask_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("dialog", startNewTask.scriptTitle, undefined, {resizeable:true});
        
        if (pal !== null)
        {
            var res =
            "group { \
                orientation:'column', alignment:['fill','fill'], \
                header: Group { \
                    alignment:['fill','top'], \
                    title: StaticText { text:'" + startNewTask.scriptNameShort + "', alignment:['fill','center'] }, \
                    help: Button { text:'" + startNewTask_localize(startNewTask.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
                }, \
                opts: Panel { \
                    getGameName: Group { \
                        alignment:['fill','top'], \
                        gameNameText: StaticText { text:'" + startNewTask_localize(startNewTask.strGameName) + "', preferredSize:[100,20] }, \
                        gameNameInput: EditText { alignment:['fill','center'], preferredSize:[200,20] }, \
                    }, \
                    getTaskName: Group { \
                        alignment:['fill','top'], \
                        taskNameText: StaticText { text:'" + startNewTask_localize(startNewTask.strTaskName) + "', preferredSize:[100,20] }, \
                        taskNameInput: EditText { alignment:['fill','center'], preferredSize:[200,20] },  \
                    }, \
                    sepr: Group { \
                        orientation:'row', alignment:['fill','top'], \
                        rule: Panel { height: 2, alignment:['fill','center'] }, \
                    }, \
                    getNetOpts: Group { \
                        alignment:['fill','top'], \
                        netFolders: Checkbox { text:'" + startNewTask_localize(startNewTask.strNetFolders) + "', alignment:['fill','top'] }, \
                        netShortcut: Checkbox { text:'" + startNewTask_localize(startNewTask.strNetShortcut) + "', alignment:['fill','top'] }, \
                    }, \
                }, \
                cmds: Group { \
                    alignment:['fill','bottom'], \
                    executeBtn: Button { text:'" + startNewTask_localize(startNewTask.strExecute) + "', alignment:['center','bottom'], preferredSize:[-1,20] }, \
                    cancelBtn: Button { text:'" + startNewTask_localize(startNewTask.strCancel) + "', alignment:['center','bottom'], preferredSize:[-1,20] }, \
                }, \
            }";
            pal.grp = pal.add(res);
            
            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function () {this.layout.resize();}
            
            pal.grp.header.help.onClick = function () {alert(startNewTask.scriptTitle + "\n" + "\n" + startNewTask_localize(startNewTask.strHelpText), startNewTask_localize(startNewTask.strHelpTitle));}
            pal.grp.cmds.executeBtn.onClick = startNewTask_doExecute;
            pal.grp.cmds.cancelBtn.onClick = startNewTask_doCancel;
        }
        
        return pal;
    }

    // Functions:
    //
    function startNewTask_getInfo() {
        gamename = sntPal.grp.opts.getGameName.gameNameInput.text;
        taskname = sntPal.grp.opts.getTaskName.taskNameInput.text;

        projectfile = scriptpath.fsName + "\\" + gamename + "\\" + taskname + "\\" + aepFolderName + "\\" + taskname + "_v001";
        projectfolder = new Folder(scriptpath.fsName + "\\" + gamename + "\\" + taskname);
    }

    function startNewTask_checkProject() {
        var checkProject = true;
        if (projectfolder.exists) {
            checkProject = true;
        } else {
            checkProject = false;
        }
        return checkProject;
    }

    function startNewTask_main() {

        //system objects
        //
        //define arrays
        var folderList = [];
        var pathArray = [];

        //parse xml file
        var xmlFile = new File("startNewTaskStructure.xml");
        xmlFile.open("r");
        var xmlString = xmlFile.read();
        var myXML = new XML(xmlString);
        xmlFile.close();

        var nodeList = myXML.xpath("//*[@name]");
        for (var i = 0; i < nodeList.length(); i++) {
            var nodePath = "\\" + nodeList[i].@name.toString();
            var parentNode = nodeList[i].parent();
            while (parentNode.name() != "root") {
                var folderName =  "\\" + parentNode.@name.toString();
                nodePath = folderName.concat(nodePath);
                parentNode = parentNode.parent();
            }
            pathArray.push(nodePath);
        };

        Array.prototype.contains = function(obj) {
            var i = this.length;
            while (i--) {
                if (this[i] === obj) {
                    return true;
                }
            }
            return false;
        }

        //add aepFolderName if its not in pathArray array
        if (pathArray.contains(aepFolderName) == false) {
            pathArray.push(aepFolderName);
        }

        //create directory structure
        gamefolder = new Folder(scriptpath.fsName + "\\" + gamename);

        if (gamefolder.exists == false) {
            var makeGameDir = "mkdir " + scriptpath.fsName + "\\" + gamename + "\"";
            system.callSystem("cmd /c \"" + makeGameDir + "\"");
        }

        var makeProjectDir = "mkdir " + scriptpath.fsName + "\\" + gamename + "\\" + taskname + "\"";
        system.callSystem("cmd /c \"" + makeProjectDir + "\"");

        for (var i = 0; i < pathArray.length; i++) {
            var cmdLineToExecute = "mkdir " + gamename + "\\" + taskname + "\\" + pathArray[i] + "\"";
            system.callSystem("cmd /c \"" + cmdLineToExecute + "\"");
        };

        //network objects
        //
        //
        if (sntPal.grp.opts.getNetOpts.netFolders.value == true) {

            var vbsArgument0 = gamename;
            var vbsArgument1 = taskname;
            var vbsArgument2 = "false";

            if (sntPal.grp.opts.getNetOpts.netShortcut.value == true) {
                vbsArgument2 = "true";
            }

            var vbsCommand = scriptpath.fsName + "\\" + "startNewTaskNetwork.vbs " + vbsArgument0 + " " + vbsArgument1 + " " + vbsArgument2;
            system.callSystem("cmd /c \"" + vbsCommand + "\"");
        }

        //aftereffects objects
        //
        //prototype function to remove unnecessary items from an array
        Array.prototype.removeByValue = function(val) {
            for(var i=0; i<this.length; i++) {
                if(this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        }

        //populate folderList
        var firstLevel = myXML.children();
        for (var i = 0; i < firstLevel.length(); i++) {
            var nodeName = firstLevel[i].@name.toString();
            folderList.push(nodeName);
        };

        //add aepFolderName if its not in folderList array
        if (folderList.contains(aepFolderName) == false) {
            folderList.push(aepFolderName);
        }
     
        //create folder structure
        for (var i = 0; i < folderList.length; i++) {
            app.project.items.addFolder(folderList[i])
        };
    
        function projectItem(name) {
            var items = app.project.items;
            i = 1;
            while (i <= items.length) {
                if (items[i].name == name) {
                    return app.project.item(i);
                    break;
                }
                i++;
            }
        }
    
        var renderFolder = projectItem(aepFolderName).items.addFolder("_render");
    
        //create comps and set label colors
        var projectComp = projectItem(aepFolderName).items.addComp(taskname, 1024, 512, 1, 20, 25);
        var renderComp = projectItem(aepFolderName).items.addComp("render_comp", 1024, 512, 1, 20, 25);
        var mainComp = projectItem(aepFolderName).items.addComp("main_comp", 1024, 512, 1, 20, 25);
    
        projectComp.parentFolder = renderFolder;
      
        projectComp.layers.add(renderComp);
        renderComp.layers.add(mainComp);
      
        for (var i = 1; i<app.project.numItems; i++) {
            if (app.project.item(i).name == "render_comp") {
                app.project.item(i).label = 1;
            }
        }
      
        for (var i = 1; i<app.project.numItems; i++) {
            if (app.project.item(i).name == "main_comp") {
                app.project.item(i).label = 8;
            }
        }
      
        //deselect everything (preventive)
        app.project.items[i].selected = false; 
      
        //select main comp
        var selectedComp = new Array();
        for (var i = 1; i <= app.project.items.length; i++) {
            if ((app.project.items[i] instanceof CompItem)&&(app.project.items[i].name == "main_comp")) {
                app.project.items[i].selected = true;
            }
        }
      
        //create background solid and open main comp in viewer
        mainComp.layers.addSolid([0.5,0.5,0.5], "main_comp_bg", 1024, 512, 1);
        mainComp.openInViewer();

        var projectfilesave = new File(projectfile);
        app.project.save(projectfilesave);
        app.project.close(CloseOptions.SAVE_CHANGES);
        app.quit()

    }

    // Buttons:
    //
    function startNewTask_doExecute() {
        startNewTask_getInfo();
        if (gamename == "") {
            alert(startNewTask_localize(startNewTask.strGameNameError));
        } else if (taskname == "") {
            alert(startNewTask_localize(startNewTask.strTaskNameError));
        } else if (hasWhiteSpace(gamename) == true) {
            alert(startNewTask_localize(startNewTask.strSpacesError));
        } else if (hasWhiteSpace(taskname) == true) {
            alert(startNewTask_localize(startNewTask.strSpacesError));
        } else {
            if (startNewTask_checkProject() == true) {
                alert(startNewTask_localize(startNewTask.strProjectError));
            } else {
                startNewTask_main();
                sntPal.close();
            } 
        }
    }

    function startNewTask_doCancel() {
        sntPal.close();
    }

    // Helper functions:
    //
    function hasWhiteSpace(string) {
        return string.indexOf(' ') >= 0;
    }

    // Main code:
    //
    // Build and show the floating palette
    var sntPal = startNewTask_buildUI(thisObj);
    if (sntPal !== null) {
        if (sntPal instanceof Window) {
            // Show the palette
            sntPal.center();
            sntPal.show();
        } else {
            sntPal.layout.layout(true);
        }
    }
})(this);