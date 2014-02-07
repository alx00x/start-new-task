#target aftereffects

{
    app.project.close(CloseOptions.PROMPT_TO_SAVE_CHANGES);

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var year = ("0" + now.getFullYear()).slice(-2);
    var today = (year) + (month) + (day);

    var taskdate = today; //date
    var gamename; //game
    var taskname; //task
    var projectpath; //path

    var foldername = taskdate + "_" + gamename + "_" + taskname;
    var projectname = gamename + "_" + taskname;

    //reed text file
    var myFile = new File ("folderList.txt");
    var fileOK = myFile.open("r","TEXT","????");

    //define arrays
    var unnecessaryFolders = new Array("_in", "_out", "aep");
    var folderList = [];

    //prototype function to remove unnecessary items from an array
    Array.prototype.removeByValue = function(val) {
        for(var i=0; i<this.length; i++) {
            if(this[i] == val) {
                this.splice(i, 1);
                break;
            }
        }
    }

    //read line by line in text file and push each line to array
    while(! myFile.eof){
        folderName = myFile.readln();
        folderList.push(folderName);
    }

    //remove unnecesery items
    for (var i = 0; i < unnecessaryFolders.length; i++) {
        folderList.removeByValue(unnecessaryFolders[i])
    }

    //add additional items
    folderList.push("comp") 
  
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
    var projectComp = projectItem("comp").items.addComp(taskName+"_raw", 1024, 512, 1, 20, 25);
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
  
    app.project.save(projectFile);
    app.project.close(CloseOptions.SAVE_CHANGES);
    app.quit()

}