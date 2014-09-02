// startNewTask.jsx
// 
// Name: startNewTask
// Version: 1.9
// Author: Aleksandar Kocic
//
// Note: Builds structure by game.
// 

(function startNewTask(thisObj)
{
    var scriptpath = Folder(new File($.fileName)).parent;

    // Globals
    var aepFolderName = "after";
    var aepInfoFolder = "info";

    var gamename; //game
    var taskname; //task

    var projectpath;
    var projectfile;
    var projectfolder;

    var startNewTask = new Object(); // Store globals in an object
    startNewTask.scriptNameShort = "SNT by game";
    startNewTask.scriptName = "Start New Task";
    startNewTask.scriptVersion = "1.9";
    startNewTask.scriptTitle = startNewTask.scriptName + " v" + startNewTask.scriptVersion;

    startNewTask.strIsAnimaticTask = {en: "This is Animatic Task"};

    startNewTask.strGameName = {en: "Game Name"};
    startNewTask.strTaskName = {en: "Task Name"};
    startNewTask.strTaskRes = {en: "Resolution"};

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
        en: "This script creates an after effects project and a standardized folder structure\n" +
        "\n" +
        "Rules:\n" +
        " - Game Name should be a proper abbreviation.\n" +
        " - Task Name is specified in a project spreadsheet.\n" +
        "\n"
    };

    // Localize
    function startNewTask_localize(strVar)
    {
        return strVar["en"];
    }

    //parse xml file
    var xmlFile = new File("startNewTaskStructure.xml");
    xmlFile.open("r");
    var xmlString = xmlFile.read();
    var myXML = new XML(xmlString);
    xmlFile.close();

    //resolution
    var resolutionNodes = myXML.xpath("resolution/res");
    var resDict = [];
    for (var i = 0; i < resolutionNodes.length(); i++) {
        var resElement = {};
        resElement.name = resolutionNodes[i].@name.toString();
        resElement.width = resolutionNodes[i].@width.toString();
        resElement.height = resolutionNodes[i].@height.toString();
        resDict.push(resElement);
    }

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

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
                    getTaskRes: Group { \
                        alignment:['fill','top'], \
                        taskResText: StaticText { text:'" + startNewTask_localize(startNewTask.strTaskRes) + "', preferredSize:[100,20] }, \
                        taskResDropdown: DropDownList { alignment:['fill','top'], alignment:['fill','top'], preferredSize:[-1,20] }, \
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
                    isAnimaticTask: Group { \
                        alignment:['fill','top'], \
                        box1: Checkbox { text:'" + startNewTask_localize(startNewTask.strIsAnimaticTask) + "', alignment:['fill','top'] }, \
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

            for (var i = 0; i < Object.size(resDict); i++) {
                pal.grp.opts.getTaskRes.taskResDropdown.add("item", "[" + resDict[i]["width"] + "x" + resDict[i]["height"] + "] " + resDict[i]["name"]);
            }
            pal.grp.opts.getTaskRes.taskResDropdown.selection = 0;

            pal.grp.opts.isAnimaticTask.box1.value = false;

            pal.grp.opts.getNetOpts.netShortcut.enabled = false;
            pal.grp.opts.getNetOpts.netFolders.onClick = function () {sntPal.grp.opts.getNetOpts.netShortcut.enabled = true;}
            
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

        if (sntPal.grp.opts.isAnimaticTask.box1.value == true) {
            projectfile = scriptpath.fsName + "\\" + gamename + "\\" + taskname + "\\" + aepInfoFolder + "\\" + taskname + "_v001";
        } else {
            projectfile = scriptpath.fsName + "\\" + gamename + "\\" + taskname + "\\" + aepFolderName + "\\" + taskname + "_v001";
        }

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

        //structure
        var nodeList = myXML.xpath("//dir]");
        for (var i = 0; i < nodeList.length(); i++) {
            var nodePath = "\\" + nodeList[i].@name.toString();
            var parentNode = nodeList[i].parent();
            while (parentNode.name() != "structure") {
                var folderName =  "\\" + parentNode.@name.toString();
                nodePath = folderName.concat(nodePath);
                parentNode = parentNode.parent();
            }
            pathArray.push(nodePath);
        }

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

        //add aepInfoFolder if its not in pathArray array
        if (pathArray.contains(aepInfoFolder) == false) {
            pathArray.push(aepInfoFolder);
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
        }

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

        var selectedNodes = myXML.xpath("structure/dir]");
    
        //create an after effects folder structure
        for (var i = 0; i < selectedNodes.length(); i++) {
            createFolderFromNode(selectedNodes[i], app.project);
        }

        //function to create folders respecting XML structure
        function createFolderFromNode(node, parent) {
            var nodeFolder = parent.items.addFolder(node.@name.toString());
            if (node.elements().length() > 0) {
                var selectedChildNodes = node.elements();
                for (var i = 0; i < selectedChildNodes.length(); i++) {
                    createFolderFromNode(selectedChildNodes[i], nodeFolder)
                }
            }
        }

        //get project item by name
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

        //resolution choice
        var resolutionChoice = sntPal.grp.opts.getTaskRes.taskResDropdown.selection.index;
        var taskwidth = parseInt(resDict[resolutionChoice]["width"]);
        var taskheight = parseInt(resDict[resolutionChoice]["height"]);

        //if animatic task, initiate animatic compositions
        var aepVariable = aepFolderName;
        if (sntPal.grp.opts.isAnimaticTask.box1.value == true) {
            aepVariable = aepInfoFolder;
        }

        //generate metadata
        var metadata_xml = new File(scriptpath.fsName + "\\" + gamename + "\\" + taskname + "\\" + aepInfoFolder + "\\" + "metadata.xml");
        metadata_xml.open("w");
        metadata_xml.writeln('<?xml version="1.0"?>');
        metadata_xml.writeln('<meta>');
        metadata_xml.writeln('    <data category="main">');
        metadata_xml.writeln('        <game>' + gamename + '</game>');
        metadata_xml.writeln('        <task>' + taskname + '</task>');
        metadata_xml.writeln('        <width>' + taskwidth + '</width>');
        metadata_xml.writeln('        <height>' + taskheight + '</height>');
        metadata_xml.writeln('    </data>');
        metadata_xml.writeln('</meta>');
        metadata_xml.close();

        //check if aepVariable is in the project
        var aepVariableFound = false;
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i).name == aepVariable) {
                aepVariableFound = true;
            }
        }

        //add aepVariable if its not in the project
        if (aepVariableFound == false) {
            app.project.items.addFolder(aepVariable);
        }
        var renderFolder = projectItem(aepVariable).items.addFolder("_render");

        //create comps and set label colors
        var projectComp = projectItem(aepVariable).items.addComp(taskname, taskwidth, taskheight, 1, 20, 25);
        var renderComp = projectItem(aepVariable).items.addComp("render_comp", taskwidth, taskheight, 1, 20, 25);
        var mainComp = projectItem(aepVariable).items.addComp("main_comp", taskwidth, taskheight, 1, 20, 25);

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
        mainComp.layers.addSolid([0.5,0.5,0.5], "main_comp_bg", taskwidth, taskheight, 1);
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