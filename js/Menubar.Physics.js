
Menubar.Physics = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );


	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Physics' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//YES

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'YES' );
	option.onClick( function () {

		editor.enablePhysics = true;
		signals.enablePhysics.dispatch();

	} );
	options.add( option );

	//NO
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'NO' );
	option.onClick( function () {

		editor.enablePhysics = false;
		signals.Postprocess.dispatch();

	} );
	options.add( option );

	return container;

};
