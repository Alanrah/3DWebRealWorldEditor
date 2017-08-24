/**
 * @author Catherine / https://github.com/Alanrah/
 */
var branchLib = new BranchLib(); 
var currentMat = new THREE.MeshStandardMaterial();// leftbar 当前生成的 mat

var dragMat = currentMat;
var dragMatFlag = false;

var editMat = {
    editMatFlag : false,
    li : null,
    branchIndex :0,
    ownMatIndex :0
};

var editFlag = false;
var dragMatPoint = new THREE.Vector2();

var Signal = signals.Signal;
var mySignals = {

    editMatLi: new Signal(),
    dragMatFlag: new Signal(),
    sidebarFreshUI: new Signal(),
    matbarFreshUI: new Signal()

};

var Leftbar = function ( editor ) {

    var container = new UI.Panel();
    container.setId( 'leftbar' );

    var materialTab = new UI.Text( '         MATERIAL LIBRARY   ' );
    materialTab.setWidth( "272px" ).setColor( "#444" ).setBorderRight( "1px solid #222" ).setPadding( "12px" );
    container.add( materialTab );

    //新建外部div和ul
    var branchDiv = new UI.BranchDivClass();
    branchDiv.setId("branchDivClass");
    branchUL = new UI.BranchULClass(); 
    branchUL.setId( "branchULClass" );
    branchDiv.add( branchUL );
    container.add( branchDiv );

    function saveChange(){
        //修改indexedDB
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

        for(var i=0;i<branchLib.branchArray.length;i++){
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

        var name = new UI.Button( branchName ).setWidth( "150px" ).setClass("branchButton").onClick(function(){
            setDDisplay(this.dom.parentNode.parentNode)
            });

        var add =new UI.Button( 'add' ).setWidth( "40px" ).setClass("branchButton").onClick(function(){
            addMaterial(this.dom.parentNode.parentNode); //传过去的是当前所造branch行
            });

        var del = new UI.Button( 'del' ).setWidth( "40px" ).setClass("branchButton").onClick(function(){
            delBranch(this.dom.parentNode.parentNode);/*console.log(this);del这个button*/
            });

        var edit = new UI.Button( 'edit' ).setWidth( "50px" ).setClass("branchButton").onClick(function(){
            editBranch(this.dom.parentNode.parentNode);
             }); 

        liRow.add(name);
        liRow.add(add); 
        liRow.add(del);
        liRow.add(edit);

        li.add(liRow);
        li.add(new UI.Ul().setMarginTop("1px"));

        branchUL.add(li);//this就是branchUL，li是arguments
        return li.dom;
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
    function matNameInput(i,materialName){

        for(var j in branchLib.branchArray[i].ownMat){

            if(branchLib.branchArray[i].ownMat[j].name == materialName){

                alert("当前分支下有重名，请重新编辑材质名称");
                return false;

                }
        }
        return true;
                   
    }


    function addMaterial(li){
      
        if(branchLib.flag == true && currentMat !== null){
            leftbar.dom.removeChild(leftbar.dom.lastChild);

            //防止当前branch下有重名的mat
            var i = findBranch(li.firstChild.firstChild.textContent);
            var confirm = matNameInput(i,currentMat.name);

            if(confirm == true){
            
                var x = currentMat.toJSON();
                //console.log(x)
                var y = parseMaterial(x);
                //console.log(y)
                addMatLib(li,y);
                addMatLi(li,y.name);

                currentMat = new THREE.MeshStandardMaterial();
                branchLib.flag = false;
                console.log(branchLib);
            }
        }
    }

    function addMatLib(li,currentM){//li是当前所在的branch行

        var i = findBranch(li.firstChild.firstChild.textContent);
        
        if(i>=0){

            branchLib.branchArray[i].addMaterial(currentM);    
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
        var name = new UI.Button( materialName ).setWidth( "160px" ).setDraggable( "true" ).setClass( "matButton" ).setCursor( "move" );

        //name.dom.addEventListener( 'click' , onMatMouseclick,false);
        name.dom.addEventListener( 'mousedown' , onMatMousedown,false);

        //document.addEventListener( 'mousemove',onMatMousemove,false );
        
        function onMatMousedown (e){

            var i = findBranch(lli.firstChild.firstChild.textContent);

            if( i>=0 ) {

                var  j = findMat(branchLib.branchArray[i].ownMat,name.dom.textContent);

                if( j >= 0 ){

                    dragMat = branchLib.branchArray[i].ownMat[j];
                    console.log('确定dragmat');

                }

                else{

                    alert(" 拖动无效material ！");

                }
            }

            else{

                alert(" 拖动无效branch下的material ！")

            }

            document.addEventListener( 'mouseup', onMatMouseup, false );
        }

        function onMatMousemove(e){

            e.preventDefault();

        }

        function onMatMouseup( e ) {

            e.preventDefault();

            if(document.elementFromPoint(e.clientX,e.clientY).tagName.toUpperCase() == 'CANVAS'){

                dragMatFlag = true;
                console.log('dragMatFlag为true')
                dragMatPoint.set( e.clientX,e.clientY );
                mySignals.dragMatFlag.dispatch();

            }
            //一旦remove 就只能mousedown mouseup 一次
            document.removeEventListener( 'mouseup', onMatMouseup, false );
    
        }

        var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){

            delMaterial(li.dom,name.dom.textContent);

        });

        var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){ 

            matbar.setDisplay('block');//关闭编辑窗口
            matBarParas.setDisplay('block');

            editMaterial(li.dom,name.dom.textContent); 
            
        });

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

    function editMaterial(li,materialName){//li 指的是当前材质所在行

        var i = findBranch(li.parentNode.parentNode.firstChild.firstChild.textContent);
        

        if(i>=0){

            var j = findMat( branchLib.branchArray[i].ownMat , materialName);

            if(j>=0){
                editMat.editMatFlag = true;
                currentMat = branchLib.branchArray[i].ownMat[j];
                editMat.li = li;
                editMat.branchIndex = i;
                editMat.ownMatIndex = j;
                mySignals.matbarFreshUI.dispatch();

            }
            else{alert("editMatLib 中该mat不存在")}
        }
        else{alert("editMatLib 中该branch不存在");}

       } 


        //要将lli分支下的materialname拖动到elementFromPoint(e.clientX,e.clientY)
    function dragMaterialToBranch(lli,materialName,elem){

        var x = findBranch(lli.firstChild.firstChild.textContent);
        var branch = branchLib.branchArray[x];

        var insertPosition;

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
    addMatRow.add( new UI.Button( 'New Mat +' ).setTop("3px").setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        matbar.setDisplay('block');
        matBarParas.setDisplay('block');
    }));
    container.add(addMatRow);
 /*
    var saveMatRow = new UI.Row();
    saveMatRow.add( new UI.Button( 'Save To Your MatLib' ).setTop("7px").setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        
        materialdb.set(branchLib,function(e){
            alert("materialDB put sucess");
        });
    }));
    container.add(saveMatRow);

    var saveMatRow = new UI.Row();

    saveMatRow.add( new UI.Button( 'Get Your MatLib' ).setTop("10px").setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        //读取的结果一直是 undefined
        materialdb.get(function(e){
            console.log(e);

            branchLib = e;//两类型不匹配，不能直接赋值
            console.log(branchLib)

            for(var i in branchLib.branchArray){

            var li = addBranchLi(branchLib.branchArray[i].name);

            for(var j in branchLib.branchArray[i].ownMat){
                addMatLi(li,branchLib.branchArray[i].ownMat[j].name);
            }
        }

        });
    }));

    container.add(saveMatRow);
*/
    return container;
} 
