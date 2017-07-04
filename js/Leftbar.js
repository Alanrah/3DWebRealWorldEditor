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

    //新建分支
    var addBranchRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Class Li +' ).setMarginLeft( '10px' ).setWidth( "280px" ).onClick( function (){
        //创建一个父

        var li = new UI.Li().setMarginTop("1px");

        var branchName = prompt("Please input the New Class Name");
  
        if(branchName){

            var liRow = new UI.Row().setMarginTop("3px");
            
            var name = new UI.Button( branchName ).setWidth( "150px" ).onClick(function(){setDDisplay(li);});
            var add =new UI.Button( 'add' ).setWidth( "40px" ).onClick(function(){addLi(li);});
            var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delLi(li,liRow);});
            var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editLi(liRow);}); 

            liRow.add(name);
            liRow.add(add);
            liRow.add(del);
            liRow.add(edit);

            li.add(liRow);

            li.add(new UI.Ul().setMarginTop("1px"));

            branchUL.add(li);
        }
        

    } ) );

    //setDisplay()貌似和某某重名了
    function setDDisplay(li){

        console.log(li.dom.lastChild.style.display);

        if(li.dom.lastChild.style.display !== "block"){
            li.dom.lastChild.style.display = "block";
        }

        else{
            li.dom.lastChild.style.display = "none";
        }
        
    }

    function addLi(liParent){

        //console.log(liParent.dom.lastChild);//ul

        var li = new UI.Li();
        li.setMarginLeft("30px").setWidth("250px");

        var materialName = prompt("Please input the New material Name");

        if(materialName){

            var liRow = new UI.Row();

            var name = new UI.Button( materialName ).setWidth( "160px" );
            var del = new UI.Button( 'del' ).setWidth( "40px" ).onClick(function(){delMaterial(li,liRow);});
            var edit = new UI.Button( 'edit' ).setWidth( "50px" ).onClick(function(){editMaterial();});

            liRow.add(name);
            liRow.add(del);
            liRow.add(edit);

            li.add(liRow);

            liParent.dom.lastChild.appendChild(li.dom);
        }
        
    }

    function delLi(li,liRow){
        
        li.dom.parentNode.removeChild(liRow.dom.parentNode);
    }

    function editLi(liRow){
        var newName = prompt("Please input the New Class Name");
        if(newName){
            console.log('nishishei')
            console.log(liRow.dom.firstChild);
            liRow.dom.firstChild.value = newName;
            liRow.dom.firstChild.innerHTML = newName;
        }
    }

    function delMaterial(li,liRow) {
        li.dom.parentNode.removeChild(liRow.dom.parentNode);
    }

    function editMaterial(){

    }

    container.add(addBranchRow);

    //新建材质
    var addMaterialRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Material +' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function () {

       // new Leftbar.MaterialLib(editor);
    } ) );

    container.add(addMaterialRow);

    return container;
};
