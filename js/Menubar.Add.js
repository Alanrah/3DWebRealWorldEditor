
/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Add' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var cameraCount = 0;

	editor.signals.editorCleared.add( function () {

		meshCount = 0;
		cameraCount = 0;

	} );

	// Group

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Group' );
	option.onClick( function () {

		var mesh = new THREE.Group();
		mesh.name = 'Group ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Plane

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Plane' );
	option.onClick( function () {

		var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// MirrorPlane

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Mirror' );
	option.onClick( function () {

		var groundMirror = new THREE.Mirror( 10, 10, {
			clipBias: 0.003,
			textureWidth: viewport.dom.offsetWidth * window.devicePixelRatio,
			textureHeight: viewport.dom.offsetHeight * window.devicePixelRatio,
			color: 0x777777
		} );
		groundMirror.rotateX( - Math.PI / 2 );
		
		groundMirror.name = 'Mirror ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( groundMirror ) );

	} );
	options.add( option );
	
	// mirrorRTT + blur
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'BlurMirror' );

	option.onClick( function () {

		dialog.setDisplay('block');

		var decalNormal //= new THREE.TextureLoader().load( 'image/decal/decal-normal.jpg' );

		var decalDiffuse //= new THREE.TextureLoader().load( 'image/decal/decal-diffuse.png' );


		editor.signals.NDTexture.add(function(url1,url2){

			console.log(url1)

			decalNormal = new THREE.TextureLoader().load( url1 );
			decalDiffuse = new THREE.TextureLoader().load( url2 );

			if(decalNormal && decalDiffuse) {

				decalDiffuse.wrapS = decalDiffuse.wrapT = THREE.RepeatWrapping;

				var WIDTH = viewport.dom.offsetWidth;
				var HEIGHT = viewport.dom.offsetHeight;

				var groundMirrorMaterial;

				var planeGeo = new THREE.PlaneBufferGeometry( 10.1, 10.1 );

				var groundMirror = new THREE.MirrorRTT( 10, 10, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT } );

				var mask = new THREE.SwitchNode( new THREE.TextureNode( decalDiffuse ), 'w' );
				var maskFlip = new THREE.Math1Node( mask, THREE.Math1Node.INVERT );

				var mirror = new THREE.MirrorNode( groundMirror );

				var normal = new THREE.TextureNode( decalNormal );
				var normalXY = new THREE.SwitchNode( normal, 'xy' );
				var normalXYFlip = new THREE.Math1Node(
					normalXY,
					THREE.Math1Node.INVERT
				);

				var offsetNormal = new THREE.OperatorNode(
					normalXYFlip,
					new THREE.FloatNode( .5 ),
					THREE.OperatorNode.SUB
				);

				mirror.offset = new THREE.OperatorNode(
					offsetNormal, // normal
					new THREE.FloatNode( 6 ),// scale
					THREE.OperatorNode.MUL
				);

				var clr = new THREE.Math3Node(
					mirror,
					new THREE.ColorNode( 0xFFFFFF ),
					mask,
					THREE.Math3Node.MIX
				);

				var blurMirror = new THREE.BlurNode( mirror );
				blurMirror.size = new THREE.Vector2( WIDTH, HEIGHT );
				blurMirror.coord = new THREE.FunctionNode( "projCoord.xyz / projCoord.q", "vec3" );
				blurMirror.coord.keywords[ "projCoord" ] = new THREE.OperatorNode( mirror.offset, mirror.coord, THREE.OperatorNode.ADD );
				blurMirror.radius.x = blurMirror.radius.y = 0;

				groundMirrorMaterial = new THREE.PhongNodeMaterial();
				groundMirrorMaterial.environment = blurMirror; // or add "mirror" variable to disable blur
				groundMirrorMaterial.environmentAlpha = mask;
				groundMirrorMaterial.normal = normal;
				//groundMirrorMaterial.normalScale = new THREE.FloatNode( 1 );
				groundMirrorMaterial.build();

				var mirrorMesh = new THREE.Mesh( planeGeo, groundMirrorMaterial );
				mirrorMesh.add( groundMirror );

				mirrorMesh.name = 'BlurMirror ' + ( ++ meshCount );

				mirrorMesh.rotateX( - Math.PI / 2 );

				console.log(mirrorMesh)
				console.log(editor.scene)
				// var json = JSON.stringify(mirrorMesh)
				// console.log( json )
				// console.log(JSON.parse( json ))

				editor.execute( new AddObjectCommand( mirrorMesh ) );

				editor.signals.RenderEverywhere.dispatch();

			}

		});

	} );
	options.add( option );

	// Box

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {

		var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Box ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Circle

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Circle' );
	option.onClick( function () {

		var radius = 1;
		var segments = 32;

		var geometry = new THREE.CircleBufferGeometry( radius, segments );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Circle ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Cylinder

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {

		var radiusTop = 1;
		var radiusBottom = 1;
		var height = 2;
		var radiusSegments = 32;
		var heightSegments = 1;
		var openEnded = false;

		var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Cylinder ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Sphere

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {

		var radius = 1;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Sphere ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Icosahedron

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Icosahedron' );
	option.onClick( function () {

		var radius = 1;
		var detail = 2;

		var geometry = new THREE.IcosahedronGeometry( radius, detail );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Icosahedron ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Torus

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Torus' );
	option.onClick( function () {

		var radius = 2;
		var tube = 1;
		var radialSegments = 32;
		var tubularSegments = 12;
		var arc = Math.PI * 2;

		var geometry = new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Torus ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// TorusKnot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'TorusKnot' );
	option.onClick( function () {

		var radius = 2;
		var tube = 0.8;
		var tubularSegments = 64;
		var radialSegments = 12;
		var p = 2;
		var q = 3;

		var geometry = new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'TorusKnot ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	/*
	// Teapot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Teapot' );
	option.onClick( function () {

		var size = 50;
		var segments = 10;
		var bottom = true;
		var lid = true;
		var body = true;
		var fitLid = false;
		var blinnScale = true;

		var material = new THREE.MeshStandardMaterial();

		var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Teapot ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );
	*/

	// Lathe

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Lathe' );
	option.onClick( function() {

		var points = [
			new THREE.Vector2( 0, 0 ),
			new THREE.Vector2( 4, 0 ),
			new THREE.Vector2( 3.5, 0.5 ),
			new THREE.Vector2( 1, 0.75 ),
			new THREE.Vector2( 0.8, 1 ),
			new THREE.Vector2( 0.8, 4 ),
			new THREE.Vector2( 1, 4.2 ),
			new THREE.Vector2( 1.4, 4.8 ),
			new THREE.Vector2( 2, 5 ),
			new THREE.Vector2( 2.5, 5.4 ),
			new THREE.Vector2( 3, 12 )
		];
		var segments = 20;
		var phiStart = 0;
		var phiLength = 2 * Math.PI;

		var geometry = new THREE.LatheBufferGeometry( points, segments, phiStart, phiLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } ) );
		mesh.name = 'Lathe ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Sprite

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sprite' );
	option.onClick( function () {

		var sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
		sprite.name = 'Sprite ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( sprite ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );



	// PerspectiveCamera

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PerspectiveCamera' );
	option.onClick( function() {

		var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000 );
		camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );

		editor.execute( new AddObjectCommand( camera ) );

	} );
	options.add( option );

	return container;

};
