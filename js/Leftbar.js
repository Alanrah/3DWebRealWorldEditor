/**
 * @author Catherine / https://github.com/Alanrah/
 */

var Leftbar = function ( editor ) {

    var container = new UI.Panel();
    container.setId( 'leftbar' );

    this.currentMaterial = 'null';

    var materialTab = new UI.Text( '    MATERIAL EDITOR   ' );
    materialTab.setWidth( "272px" ).setColor( "#444" ).setBorderRight( "1px solid #222" ).setPadding( "12px" );
    container.add( materialTab );

    //新建外部div和ul
    var branchDiv = new UI.BranchDivClass();
    branchDiv.setId("branchDivClass");
    var branchUL = new UI.BranchULClass(); 
    branchUL.setId( "branchULClass" );
    branchDiv.add( branchUL );
    container.add( branchDiv );
    

    //本地存储branchlib的信息的变量,变量名和构造器的名字不能相同
    var branchLib = new BranchLib();

    function saveChange(){
        //变量转换成json数据存储在localstorage，每次改变都刷新重新写入
        if(branchLib.changed === true){
            var branchLibJson = JSON.stringify(branchLib);
            if(localStorage.getItem("branchLibJson")){
                localStorage.removeItem("branchLibJson"); 
                localStorage.setItem("branchLibJson",branchLibJson); 
            }
            else{
                localStorage.setItem("branchLibJson",branchLibJson);
            }
            branchLib.changed = false;
            //console.log(localStorage.getItem("branchLibJson"))
            console.log(branchLib);
            //console.log(branchUL);
        }
    }

    //新建分支
    var addBranchRow = new UI.Row();
    addBranchRow.add( new UI.Button( 'New Class Li +' ).setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        var branchName = prompt("Please input the New Class Name");

        branchName = ifRenameBran(branchName);

        if(branchName && branchName !== 0){

            addBranchLib(branchName);
            addBranchLi(branchName);
        }
        else{
            alert("添加失败，无效branchName！")
        }
    }));

    function ifRenameBran(branchName){
        var i=0;
        for(i=0;i<branchLib.branchArray.length;i++){
                //找到对应的branch
                if(branchLib.branchArray[i].name == branchName){// === cuo 
                    return 0;
                }
            }
            return branchName;
    }

    function addBranchLib(branchName){
        var branch = new Branch(branchName);
        branchLib.addBranch(branch);
        branchLib.changed = true;
        saveChange();
    }

    function addBranchLi(branchName){

        var li = new UI.Li().setMarginTop("1px");
        li.setClass("branch");
        var liRow = new UI.Row().setMarginTop("3px"); 

        var name = new UI.Button( branchName ).setWidth( "150px" ).setClass("branchButton").onClick(function(){setDDisplay(this.dom.parentNode.parentNode)});
        var add =new UI.Button( 'add' ).setWidth( "40px" ).setClass("branchButton").onClick(function(){
                addMaterial(this.dom.parentNode.parentNode); //传过去的是当前所造branchUI
            });

        var del = new UI.Button( 'del' ).setWidth( "40px" ).setClass("branchButton").onClick(function(){delBranch(this.dom.parentNode.parentNode);/*console.log(this);del这个button*/});
        var edit = new UI.Button( 'edit' ).setWidth( "50px" ).setClass("branchButton").onClick(function(){editBranch(this.dom.parentNode.parentNode);}); 

        liRow.add(name);
        liRow.add(add); 
        liRow.add(del);
        liRow.add(edit);

        li.add(liRow);
        li.add(new UI.Ul().setMarginTop("1px"));

        branchUL.add(li);//this就是branchUL，li是arguments
    }

     function setDDisplay(li){
        
        if(li.lastChild.style.display !== "block" && li.lastChild.style.display !== "none"){
            li.lastChild.style.display = "none";
        }

        else if(li.lastChild.style.display === "none"){
            li.lastChild.style.display = "block";
        }
        else if(li.lastChild.style.display === "block"){
            li.lastChild.style.display = "none";
        }
    }

    function delBranch(li){
        var branchName = li.firstChild.firstChild.textContent;
        var i = findBranch(branchName);
        if(i>=0){
            branchLib.delBranch(i);
            li.parentNode.removeChild(li);
            branchLib.changed = true;
            saveChange();
        }
        else{
            alert("不存在该branch，del 失败！")
        }

    }

    function editBranch(li){
        var branchName = li.firstChild.firstChild.textContent;
        var i = findBranch(branchName);
        if(i>=0){
            var newName = prompt("Please input the New Class Name");
            newName = ifRenameBran(newName);
            if(newName){
                li.firstChild.firstChild.textContent = newName;
                branchLib.branchArray[i].editBranch(newName);
                branchLib.changed = true;
                saveChange();
            }
            else{
                alert("修改失败，无效newBranchName！")
            }
                
            }
        else{
            alert("不存在该branchName，edit 失败！")
        }
    }
    

    function findBranch(branchName){
        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name == branchName){// === cuo
                    return i;
                }

            }
        return -1;
    }  

    function addMaterial(li){

        viewport.setLeft('601px');
        matbar.setDisplay('block');
        // if(this.currentMaterial){
        //     console.log('加入mat到branch')
        //     addMatLib(li,this.currentMaterial);
        // }
        }


    function addMatLib(li,currentMaterial){
        var i = findBranch(li.firstChild.firstChild.textContent);
        if(i>=0){
            branchLib.branchArray[i].addMaterial(currentMaterial);
            branchLib.changed = true;
            saveChange();
        }
        else{alert("addMatLib 中该branch不存在")}
        
    }
    container.add(addBranchRow);
    return container;
}
