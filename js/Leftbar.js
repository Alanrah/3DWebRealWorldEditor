/**
 * @author Catherine / https://github.com/Alanrah/
 */
var branchLib = new BranchLib();
var currentMat = null;

var Leftbar = function ( editor ) {

    var container = new UI.Panel();
    container.setId( 'leftbar' );

    var materialTab = new UI.Text( '    MATERIAL EDITOR   ' );
    materialTab.setWidth( "272px" ).setColor( "#444" ).setBorderRight( "1px solid #222" ).setPadding( "12px" );
    container.add( materialTab );

    //新建外部div和ul
    var branchDiv = new UI.BranchDivClass();
    branchDiv.setId("branchDivClass");
    branchUL = new UI.BranchULClass(); 
    branchUL.setId( "branchULClass" );
    branchDiv.add( branchUL );
    container.add( branchDiv );
    

    //本地存储branchlib的信息的变量,变量名和构造器的名字不能相同
    

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
            //console.log(branchLib);
            //console.log(branchUL);
        }
    }
    //init branchLib and branchUL


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
    function findMat(ownMat,materialName){
        for(var j in ownMat){
            if(ownMat[j].name == materialName){
                return j;
                }
        } 
        return -1;
    }
    function matNameInput(li){
        var name = li.firstChild.firstChild.textContent;
        var materialName = prompt("Please input the New material Name");
        //如果重名，重新输入或者放弃
            for(var i in branchLib.branchArray){
                    //找到对应的branch
                    if(branchLib.branchArray[i].name == name){
                        for(var j in branchLib.branchArray[i].ownMat){
                            if(branchLib.branchArray[i].ownMat[j].name == materialName){
                                return 0;
                            }
                    }
                    return materialName;
                }
            }
    }


    function addMaterial(li){
      
        if(branchLib.flag == true && currentMat !== null){
            console.log(currentMat);
            addMatLib(li,currentMat);
            addMatLi(li,currentMat.name);
        }
        console.log('branchLib.flag')
        console.log(branchLib.flag)
        console.log(branchLib)
        currentMat = null;
        branchLib.flag = false;

/*方便自测
        if(confirm("yes 新建mat，no 新建空mat")){
            //改变全局变量viewport的宽度
            viewport.setLeft('601px');
            matbar.setDisplay('block');
        }
        else{
            var materialName = matNameInput(li);
            if(materialName && materialName !== 0){

                addMatLib(li,materialName);
                addMatLi(li,materialName);
            }
            else{
                alert("添加失败，无效materialName！")
            }  
        }
        */
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

    function addMatLi(lli,materialName){
        var li = new UI.Li();
        li.setClass("material");
        li.setMarginLeft("30px").setWidth("250px");
        var drag = false;
        var name = new UI.Button( materialName ).setWidth( "160px" ).setClass("matButton").setCursor("move");
           /* name.dom.onmousedown = function(e){
              drag   = true;
            }
            document.onmousemove = function(e){
              if(drag ===true){
                console.log(e.clientX+"  "+e.clientY)
              }
            }
            document.onmouseup = function(e){
                dragMaterial(lli,materialName,document.elementFromPoint(e.clientX,e.clientY));
                drag   = false;
            }*/
        var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delMaterial(li.dom,materialName);});
        var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editMaterial(li.dom,materialName);});

        li.add(name);
        li.add(del);
        li.add(edit);

        lli.lastChild.appendChild(li.dom);//在li下面的ul中添加material
    }

    function delMaterial(li,materialName){
        var i = findBranch(li.parentNode.parentNode.firstChild.firstChild.textContent);
        if(i>=0){
            var j = findMat( branchLib.branchArray[i].ownMat,materialName);
            if(j>=0){
                branchLib.branchArray[i].delMaterial(j);
                li.parentNode.removeChild(li);
                branchLib.changed = true;
                saveChange();
            }
            else{alert("delMatLib 中该mat不存在")}
        }
        else{alert("delMatLib 中该branch不存在")}
    }

    function editMaterial(li,materialName){
        console.log(li.parentNode.parentNode.firstChild.firstChild.textContent)
        var i = findBranch(li.parentNode.parentNode.firstChild.firstChild.textContent);
        if(i>=0){
            var j = findMat( branchLib.branchArray[i].ownMat,materialName);
            if(j>=0){
                branchLib.branchArray[i].editMaterial(j);
                alert("该功能暂时不完善")
                branchLib.changed = true;
                saveChange();
            }
            else{alert("editMatLib 中该mat不存在")}
        }
        else{alert("editMatLib 中该branch不存在")}
        
    }

//要将lli分支下的materialname拖动到elementFromPoint(e.clientX,e.clientY)
function dragMaterial(lli,materialName,elem){

    var x = findBranch(lli.firstChild.firstChild.textContent);
    var branch = branchLib.branchArray[x];

    var insertPosition;
console.log('jinlai1')
    if(elem.className == "branchButton"){
        console.log('jinlai11')
            if(elem.parentNode.firstChild.textContent == branch.name){//drag在同一branch下，不做任何修改
                console.log('jinlai2')
                return;
            }

            else{
                for(var i in branchLib.branchArray){//防止同一branch下的mat重名
                if(branchLib.branchArray[i].name == elem.parentNode.firstChild.textContent){
                    for(var j in branchLib.branchArray[i].ownMat){
                        if(branchLib.branchArray[i].ownMat[j].name == materialName){ alert("该分类下有重名的material！");return;console.log('jinlai3')}
                        }
                    }
                    insertPosition = i;
                }
                
                //delete 原来的结构

                for(var j in branchLib.branchArray[x].ownMat){
                    if(branchLib.branchArray[x].ownMat[j].name == materialName){
                        branchLib.branchArray[x].delMaterial(j);console.log('jinlai4')
                        break;
                        }
                    }  
                for(var j in lli.lastChild.childNodes){
                if(lli.lastChild.childNodes[j].firstChild.textContent == materialName){
                    lli.lastChild.removeChild(lli.lastChild.childNodes[j]);console.log('jinlai5')
                    break;
                    }
                }
        
        //加到新的branch里面
        branchLib.branchArray[insertPosition].addMaterial(new Mat(materialName));
        for(var j in branchUL.childNodes){
            if(branchUL.childNodes[i].firstChild.firstChild.textContent == branchLib.branchArray[insertPosition].name){
                addMatLi(branchUL.dom.childNodes[i],materialName);console.log('jinlai6');break;
            }
            }
        }
        }

        else{
            return;
        }
        branchLib.changed = true;
        saveChange();
}
    
    container.add(addBranchRow);


    var addMatRow = new UI.Row();
    addMatRow.add( new UI.Button( 'New Mat' ).setTop("3px").setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        viewport.setLeft('601px');
        matbar.setDisplay('block');
    }));
    container.add(addMatRow);

    return container;
}
