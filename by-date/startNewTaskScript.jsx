// startNewTask.jsx
// 
// Name: startNewTask
// Author: Aleksandar Kocic
//
// Note: Builds structure by date.
// 

(function startNewTask(thisObj)
{
    var scriptpath = Folder(new File($.fileName)).parent;

    // Globals
    var projectFolderName = "after";

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var year = ("0" + now.getFullYear()).slice(-2);
    var today = (year) + (month) + (day);

    var taskdate = today; //date
    var gamename; //game
    var taskname; //task

    var foldername;
    var projectname;
    var projectpath;
    var projectfile;
    var projectfolder;

    var startNewTask = new Object(); // Store globals in an object
    startNewTask.scriptNameShort = "SNT by date";
    startNewTask.scriptName = "Start New Task";
    startNewTask.scriptVersion = "1.2";
    startNewTask.scriptTitle = startNewTask.scriptName + " v" + startNewTask.scriptVersion;

    startNewTask.strGameName = {en: "Game Name"};
    startNewTask.strTaskName = {en: "Task Name"};

    startNewTask.strExecute = {en: "OK"};
    startNewTask.strCancel = {en: "Cancel"};

    startNewTask.strGameNameError = {en: "Please specify game name."};
    startNewTask.strTaskNameError = {en: "Please specify task name."};
    startNewTask.strSpacesError = {en: "You better not use spaces!"};
    startNewTask.strProjectError = {en: "This project already exists! Choose a different name."};

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

    // Main Functions:
    //

    function startNewTask_getInfo() {
        gamename = sntPal.grp.opts.getGameName.gameNameInput.text;
        taskname = sntPal.grp.opts.getTaskName.taskNameInput.text;

        foldername = taskdate + "_" + gamename + "_" + taskname;
        projectname = gamename + "_" + taskname;
        projectfile = scriptpath.fsName + "\\" + foldername + "\\" + projectFolderName + "\\" + projectname + "_v001";
        projectfolder = new Folder(scriptpath.fsName + "\\" + foldername);
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
        //reed text file
        var myFile = new File ("startNewTaskList.txt");
        var fileOK = myFile.open("r","TEXT","????");
    
        //define arrays
        var unnecessaryFolders = new Array("_in", "_out", projectFolderName);
        var folderList = [];
   
        //read line by line in text file and push each line to array
        while(! myFile.eof){
            folderName = myFile.readln();
            folderList.push(folderName);
        }

        //add projectFolderName
        folderList.push(projectFolderName);

        //create directory structure
        var makeProjectDir = "mkdir " + scriptpath.fsName + "\\" + foldername + "\"";
        system.callSystem("cmd /c \"" + makeProjectDir + "\"");

        for (var i = 0; i < folderList.length; i++) {
            var cmdLineToExecute = "mkdir " + foldername + "\\" + folderList[i] + "\"";
            system.callSystem("cmd /c \"" + cmdLineToExecute + "\"");
        };

        //prototype function to remove unnecessary items from an array
        Array.prototype.removeByValue = function(val) {
            for(var i=0; i<this.length; i++) {
                if(this[i] == val) {
                    this.splice(i, 1);
                    break;
                }
            }
        }

        //remove items
        for (var i = 0; i < unnecessaryFolders.length; i++) {
            folderList.removeByValue(unnecessaryFolders[i])
        }
    
        //add additional items
        folderList.push("comp");
      
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
    
        var renderFolder = projectItem("comp").items.addFolder("_render");
    
        //create comps and set label colors
        var projectComp = projectItem("comp").items.addComp(taskname, 1024, 512, 1, 20, 25);
        var renderComp = projectItem("comp").items.addComp("render_comp", 1024, 512, 1, 20, 25);
        var mainComp = projectItem("comp").items.addComp("main_comp", 1024, 512, 1, 20, 25);
    
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