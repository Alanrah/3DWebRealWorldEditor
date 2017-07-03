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


    var tableTree = new UI.Table();
    tableTree.setId( "tree" );
    container.add( tableTree );

    //新建分支
    var addBranchRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Class +' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function (){
        //创建一个父
        var Tr = document.createElement("tr");
  
        //创建td来保存
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");


        var branchName = prompt("Please input thr New Class Name");
  
        //赋值
        td1.innerHTML = branchName;// "<input type='text' value=branchName/>";
        td2.innerHTML = "<a href='#' onclick='addTr(this);'>Add</a><a href='#' onclick='delTr(this);'>Del</a>  <a href='#' onclick='eidtTr(this);'>Edit</a>";
  
        //把子节点放到父节点
        Tr.appendChild(td1);
        Tr.appendChild(td2);

        document.getElementById("tree").appendChild(Tr);

    } ) );

    container.add(addBranchRow);

    //新建材质
    var addMaterialRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Material +' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function () {

        new Leftbar.MaterialLib(editor);
    } ) );

    container.add(addMaterialRow);



    function addTr(){
        //创建一个父
        var Tr = document.createElement("tr");
  
        //创建td来保存
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");


        var branchName = prompt("Please input thr New Class Name");
  
        //赋值
        td1.innerHTML = branchName;// "<input type='text' value=branchName/>";
        td2.innerHTML = "<a href='#' onclick='addTr(this);'>Add</a><a href='#' onclick='delTr(this);'>Del</a>  <a href='#' onclick='eidtTr(this);'>Edit</a>";
  
        //把子节点放到父节点
        Tr.appendChild(td1);
        Tr.appendChild(td2);

        this.appendChild(Tr);
    }    
    function delTr(){
        
    }
    function editTr(){

    }

    return container;
};
