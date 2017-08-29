/**
 * @author https://github.com/Alanrah/3DWebRealWorldEditor
 */

Menubar.Light = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	renderer = editor.renderer;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Light' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var lightCount = 0;

	// PointLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PointLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// SpotLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SpotLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var penumbra = 0;

		var light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
		light.name = 'SpotLight ' + ( ++ lightCount );
		light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// DirectionalLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'DirectionalLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// HemisphereLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'HemisphereLight' );
	option.onClick( function () {

		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 0, 10, 0 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// AmbientLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'AmbientLight' );
	option.onClick( function() {

		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	//ColorfulSpotLight  webgl - lights - spot light

	options.add( new UI.HorizontalRule() );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'ColorfulSpotLight' );
	option.onClick(function(){
		
		function createSpotlight( color ) {

				var newObj = new THREE.SpotLight( color, 2 );

				newObj.castShadow = true;
				newObj.angle = 0.3;
				newObj.penumbra = 0.2;
				newObj.decay = 2;
				newObj.distance = 50;

				newObj.shadow.mapSize.width = 1024;
				newObj.shadow.mapSize.height = 1024;

				return newObj;

			}

		var spotLight1 = createSpotlight( 0xFF7F00 );
		var spotLight2 = createSpotlight( 0x00FF7F );
		var spotLight3 = createSpotlight( 0x7F00FF );
		spotLight1.name = "SpotLightG" + ( ++ lightCount );
		spotLight2.name = "SpotLightG" + ( ++ lightCount );
		spotLight3.name = "SpotLightG" + ( ++ lightCount );

		spotLight1.position.set( -10, 18, 5 );
		spotLight2.position.set( 10, 18, -15 );
		spotLight3.position.set( 4, 18, 15 );

		//var lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
		//var lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
		//var lightHelper3 = new THREE.SpotLightHelper( spotLight3 );

		editor.execute( new AddObjectCommand( spotLight1 ) );
		editor.execute( new AddObjectCommand( spotLight2 ) );
		editor.execute( new AddObjectCommand( spotLight3 ) );

	});
	options.add( option );

	//  lights - rect light

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'RectReflectorLight' );
	option.onClick( function() {

		var color = 0xFFFFFF;

		var rectLight = new THREE.RectAreaLight( color, undefined, 10, 10 );
		rectLight.matrixAutoUpdate = true;
		rectLight.intensity = 80.0;
		rectLight.position.set( 10, 10, 10 );
		rectLight.name = 'rectLight ' + ( ++ lightCount );
		rectLightHelper = new THREE.RectAreaLightHelper( rectLight );

		editor.execute( new AddObjectCommand( rectLight ) );

	} );
	options.add( option );

	//  lights - physical
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PhysicalBulb' );
	option.onClick(function(){

		var bulbGeometry = new THREE.SphereGeometry( 0.02, 16, 8 );
		var bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );

		bulbMat = new THREE.MeshStandardMaterial( {
			emissive: 0xffffee,
			emissiveIntensity: 1,
			color: 0x000000
		});
		var bulb = new THREE.Mesh( bulbGeometry, bulbMat );
		bulb.name = "bulb" ;
		bulbLight.add( bulb );
		bulbLight.position.set( 0, 10, 0 );
		bulbLight.name = 'bulbLight ' + ( ++ lightCount );
		bulbLight.castShadow = true;

		editor.execute( new AddObjectCommand( bulbLight ) );

	})
	options.add( option );
	

	//  lights - Rembrandt lighting
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'RembrandtLight' );
	option.onClick( function() {

		var skyColor = 0xffaa00 ;
		var groundColor = 0xffaa77;
		var intensityH = 1;

		var lightH = new THREE.HemisphereLight( skyColor, groundColor, intensityH );
		lightH.name = 'HemisphereLight ' + ( ++ lightCount );

		lightH.position.set( 10, 10, 30 );

		editor.execute( new AddObjectCommand( lightH ) );

		var colorS = 0xffaa00;
		var intensityS = 1;
		var distanceS = 0;
		var angleS = Math.PI * 0.1;
		var penumbraS = 0;

		var lightS = new THREE.SpotLight( colorS, intensityS, distanceS, angleS, penumbraS );
		lightS.name = 'SpotLight ' + ( ++ lightCount );
		lightS.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		lightS.position.set( 10, 20, 7.5 );

		editor.execute( new AddObjectCommand( lightS ) );

		var colorP1 = 0xffffff;
		var intensityP1 = 1;
		var distanceP1 = 0;

		var lightP1 = new THREE.PointLight( colorP1, intensityP1, distanceP1 );
		lightP1.name = 'PointLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( lightP1 ) );

		var colorP2 = 0xffffff;
		var intensityP2 = 1;
		var distanceP2 = 0;

		var lightP2 = new THREE.PointLight( colorP2, intensityP2, distanceP2 );
		lightP2.name = 'PointLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( lightP2 ) );

	} );
	options.add( option );

	return container;

};
