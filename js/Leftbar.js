/**
 * @author Catherine / https://github.com/Alanrah/
 */

var Leftbar = function ( editor ) {

    var container = new UI.Panel();
    //id名称第一个字符都是小写字母
    container.setId( 'leftbar' );


    var materialTab = new UI.Text( '    MATERIAL EDITOR   ' );
    materialTab.setWidth( "272px" );
    materialTab.setColor( "#444" );
    materialTab.setBorderRight( "1px solid #222" );
    materialTab.setPadding( "12px" );
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
    var changed = false;
    var branchLibJson = null;

    //init branchLib and branchUL
    function initBranch(){
        if(localStorage.getItem("branchLibJson")){
            branchLibJSON = JSON.parse(localStorage.getItem("branchLibJson")); 

            //类型转换
            for(var i in branchLibJSON.branchArray){
                var branch = new Branch(branchLibJSON.branchArray[i].name);
                branchLib.addBranch(branch);
                for(var j in branchLibJSON.branchArray[i].ownMat){
                    var material = new Mat(branchLibJSON.branchArray[i].ownMat[j].name);
                     branchLib.branchArray[i].addMaterial(material);
                }
            }
            
            for(var i in branchLib.branchArray){
                var lli = new UI.Li().setMarginTop("1px");
                var lliRow = new UI.Row().setMarginTop("3px");
                var name = new UI.Button( branchLib.branchArray[i].name ).setWidth( "150px" ).onClick(function(){setDDisplay(lli);});
                var add =new UI.Button( 'add' ).setWidth( "40px" ).onClick(function(){
                if (confirm("Do you want to add new class(yes) or new material(no) ?")) {
                   addMaterial(lli,branchLib.branchArray[i]); 
                }
                else{
                    //new Leftbar.MaterialLib(editor,branchUL);//编辑材质,并将当前材质信息传过去
                }
                });
                var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delBranch(lli,lliRow,branchLib.branchArray[i]);/*console.log(this);del这个button*/});
                var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editBranch(lliRow,branchLib.branchArray[i]);}); 
                lliRow.add(name);
                lliRow.add(add); 
                lliRow.add(del);
                lliRow.add(edit);
                lli.add(lliRow);
                lli.add(new UI.Ul().setMarginTop("1px"));
                branchUL.add(lli);

                for(var j in branchLib.branchArray[i].ownMat){
                    var li = new UI.Li();
                    li.setMarginLeft("30px").setWidth("250px");

                    var liRow = new UI.Row();
                    var name = new UI.Button( branchLib.branchArray[i].ownMat[j].name ).setWidth( "160px" );
                    var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delMaterial(li,liRow,i,branchLib.branchArray[i].ownMat[j].name);});
                    var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editMaterial(i,branchLib.branchArray[i].ownMat[j].name);});
                    liRow.add(name);
                    liRow.add(del);
                    liRow.add(edit);
                    li.add(liRow);
                    lli.dom.lastChild.appendChild(li.dom);//在li下面的ul中添加material
                }
            }
        }
    }
    initBranch();
    console.log(branchLib);
    console.log(branchUL);

    function saveChange(){
        //变量转换成json数据存储在localstorage，每次改变都刷新重新写入
        if(changed === true){
            branchLibJson = JSON.stringify(branchLib);
            if(localStorage.getItem("branchLibJson")){
                localStorage.removeItem("branchLibJson"); 
                localStorage.setItem("branchLibJson",branchLibJson); 
                //console.log(localStorage.getItem("branchLibJson"));
            }
            else{
                localStorage.setItem("branchLibJson",branchLibJson);
            }
            
            changed = false;
        }
    }

    //新建分支
    var addBranchRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Class Li +' ).setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        //创建一个父

        var li = new UI.Li().setMarginTop("1px");

        var branchName = prompt("Please input the New Class Name");

        //如果重名，重新输入或者放弃
        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === branchName && i!== branchLib.branchArray.length-1){
                    
                    branchName = prompt("Renamed, Please input the New Class Name again");
                    i=0;
                }
                else if(i=== branchLib.branchArray.length-1){
                    break;
                }

            }

        if(branchName){

            //将新建的分支信息存在branchLib中
            var branch = new Branch(branchName);
            branchLib.addBranch(branch);

            //console.log(branchLib);//对的

            //将新建信息展示在页面
            var liRow = new UI.Row().setMarginTop("3px");
            
            var name = new UI.Button( branch.name ).setWidth( "150px" ).onClick(function(){setDDisplay(li);});

            var add =new UI.Button( 'add' ).setWidth( "40px" ).onClick(function(){
                if (confirm("Do you want to add new class(yes) or new material(no) ?")) {
                   addMaterial(li,branch); //传过去的是当前所造branch
                }
                else{
                    //new Leftbar.MaterialLib(editor,branchUL);//编辑材质,并将当前材质信息传过去
                }
                });

            var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delBranch(li,liRow,branch);/*console.log(this);del这个button*/});
            var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editBranch(liRow,branch);}); 

            liRow.add(name);
            liRow.add(add); 
            liRow.add(del);
            liRow.add(edit);

            li.add(liRow);
            li.add(new UI.Ul().setMarginTop("1px"));

            branchUL.add(li);//this就是branchUL，li是arguments
            changed = true;
            saveChange();
            console.log('addbranch');
            console.log(branchLib);
        }
        

    } ) );

    //setDisplay()貌似和某某重名了
    function setDDisplay(){
        arguments[0].dom.lastChild.style.display = "block";
        if(arguments[0].dom.lastChild.style.display !== "block"){
            arguments[0].dom.lastChild.style.display = "block";
        }

        else{
            arguments[0].dom.lastChild.style.display = "none";
        }
    }

    //在分之中增加material信息
    function addMaterial(lli,branch){

        var li = new UI.Li();
        li.setMarginLeft("30px").setWidth("250px");

        var materialName = prompt("Please input the New material Name");


        //如果重名，重新输入或者放弃
        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === branch.name){
                    for(var j in branchLib.branchArray[i].ownMat){
                        if(branchLib.branchArray[i].ownMat[j].name === materialName){
                            materialName = prompt("Renamed, Please input the material Name again");
                            j=0;
                        }
                }
            }
                else {
                    break;
                }
            }

       var mi=0; 

        if(materialName){

            //将新增的material信息加入所属的branch
            var material = new Mat(materialName);   

            //搜索branchLib，在对应branch下面push mat
            for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === branch.name ){
                    
                    branchLib.branchArray[i].addMaterial(material);
                    mi = i;
                }
            } 

            var liRow = new UI.Row();

            var name = new UI.Button( material.name ).setWidth( "160px" );
            var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delMaterial(li,liRow,mi,materialName);});
            var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editMaterial(mi,materialName);});

            liRow.add(name);
            liRow.add(del);
            liRow.add(edit);

            li.add(liRow);

            arguments[0].dom.lastChild.appendChild(li.dom);//在li下面的ul中添加material
            changed = true;
            saveChange();
            console.log('addmaterial');
            console.log(branchLib);
        }
        
    }

    //删除分之中的material信息
    function delBranch(li,lirow,branch){

        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === branch.name ){
                    
                    branchLib.delBranch(i);
                    console.log(i);

                }
            }
        console.log(lirow.dom.firstChild.textContent);
        arguments[0].dom.parentNode.removeChild(arguments[1].dom.parentNode);
        //console.log(this);windows
        changed = true;
        saveChange();
        console.log('delbranch');
            console.log(branchLib);
    }


    function editBranch(li,branch){
        var newName = prompt("Please input the New Class Name");

        //对newName查重
        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === newName && i!== branchLib.branchArray.length-1){
                    
                    newName = prompt("Renamed, Please input the New Class Name again");
                    i=0;
                }
                else if(i === branchLib.branchArray.length-1){
                    break;
                }

            }

        if(newName){
            console.log(arguments[0].dom.firstChild);
            arguments[0].dom.firstChild.textContent = newName;
        }

        for(var i in branchLib.branchArray){
                //找到对应的branch
                if(branchLib.branchArray[i].name === branch.name ){
                    
                    branchLib.branchArray[i].editBranch(newName);

                }
            }
            changed = true;
            saveChange();
            console.log('editbranch');
            console.log(branchLib);
    }

    function delMaterial(li,lirow,mi,materialName) {//mi的branch在branchLib中的index

        for(var j in branchLib.branchArray[mi].ownMat){
            if(branchLib.branchArray[mi].ownMat[j].name === materialName){
                branchLib.branchArray[mi].delMaterial(j);
                }
        }  

        li.dom.parentNode.removeChild(lirow.dom.parentNode);
        changed = true;
        saveChange();
        console.log('delmaterial');
            console.log(branchLib);
    }


    function editMaterial(i,materialName){
        for(var j in branchLib.branchArray[i].ownMat){
            if(branchLib.branchArray[i].ownMat[j].name === materialName){
                branchLib.branchArray[i].ownMat[j].editMaterial(branchLib.branchArray[i],j);
                }
        } 
        changed = true;
        saveChange();
        console.log('editmaterial');
        console.log(branchLib);
    }

    container.add(addBranchRow);

    //新建材质
    var addMaterialRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Material +' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function () {

        new Leftbar.MaterialLib(editor);//创建新材质
    } ) );

    container.add(addMaterialRow);

    return container;
};

