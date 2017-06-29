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
    container.add( tableTree );

    var addBranchRow = new UI.Row();

    addBranchRow.add( new UI.Button( '+' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function () {


    } ) );

    container.add(addBranchRow);

    var addMaterialRow = new UI.Row();

    addBranchRow.add( new UI.Button( 'New Material' ).setMarginLeft( '10px' ).setWidth( "280px" ).setMarginTop( '10px' ).onClick( function () {


    } ) );

    container.add(addMaterialRow);

    return container;
};
