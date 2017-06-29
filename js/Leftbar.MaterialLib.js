/**
 * @author Catherine / https://github.com/Alanrah/
 */

Leftbar.MaterialLib = function ( editor ){

	var signals = editor.signals;
	var currentObject;
	var copiedMaterial;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setMarginLeft( '15px' );

	return container;//如果忘记返回，UI.Element: Leftbar.Material {} is not an instance of UI.Element.
}