Menubar.Postprocessing = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Postprocessing' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// SSAO

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SSAO' );
	option.onClick( function () {

		editor.SSAOpostprocessing = true;
		editor.SAOpostprocessing = false;
		editor.HDRpostprocessing = false;
		editor.BLOOMpostprocessing = false;
		editor.SMAApostprocessing = false;

		editor.signals.SSAO.dispatch();

	} );
	options.add( option );

	// SAO

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SAO' );
	option.onClick( function () {

		editor.SSAOpostprocessing = false;
		editor.SAOpostprocessing = true;
		editor.HDRpostprocessing = false;
		editor.BLOOMpostprocessing = false;
		editor.SMAApostprocessing = false;

		editor.signals.SAO.dispatch();

	} );
	options.add( option );

	/* HDR

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'HDR' );
	option.onClick( function () {

		editor.SSAOpostprocessing = false;
		editor.SAOpostprocessing = false;
		editor.HDRpostprocessing = true;
		editor.BLOOMpostprocessing = false;
		editor.SMAApostprocessing = false;

		editor.signals.HDR.dispatch();

	} );
	options.add( option );
*/
	// BLOOM

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'BLOOM' );
	option.onClick( function () {

		editor.SSAOpostprocessing = false;
		editor.SAOpostprocessing = false;
		editor.HDRpostprocessing = false;
		editor.BLOOMpostprocessing = true;
		editor.SMAApostprocessing = false;

		editor.signals.BLOOM.dispatch();

	} );
	options.add( option );

	// SMAA

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SMAA' );
	option.onClick( function () {

		editor.SSAOpostprocessing = false;
		editor.SAOpostprocessing = false;
		editor.HDRpostprocessing = false;
		editor.BLOOMpostprocessing = true;
		editor.SMAApostprocessing = false;

		editor.signals.SMAA.dispatch();

	} );
	options.add( option );

	return container;

};
