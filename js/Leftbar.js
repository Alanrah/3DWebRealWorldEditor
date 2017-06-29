/**
 * @author Catherine / https://github.com/Alanrah/
 */

var Leftbar = function ( editor ) {

    var container = new UI.Panel();
    //id名称第一个字符都是小写字母
    container.setId( 'leftbar' );

    var materialTab = new UI.Text( '    MATERIAL EDITOR   ' );
    materialTab.setWidth("272px");
    //materialTab.setBackgroundColor("#111");
    var tabs = new UI.Div();
    tabs.setId( 'tabs' );
    tabs.add( materialTab);
    container.add( tabs );


    return container;
};
