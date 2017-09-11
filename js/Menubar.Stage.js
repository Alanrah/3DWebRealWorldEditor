Menubar.Stage = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Stages' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options ); 

	var meshCount = 0;

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'NONE' );
	option.onClick( function () {

		//nothing……

	} );
	options.add( option );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'WhiteSpace' );
	option.onClick( function () {

		var meshCount1 = 0;
		var lightCount = 0;

		var meshGroup = new THREE.Group();
		meshGroup.name = 'StageGroup ' + ( ++ meshCount );

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var decay =  2.0;
		var shadow = true;

		var light = new THREE.PointLight( color, intensity, distance, decay, shadow );
		light.name = meshGroup.name + '.PointLight ' + ( ++ lightCount );
		light.position.set( 0, 20, 0 );
		light.castShadow = true;

		meshGroup.add(light);

		var geometry = new THREE.PlaneBufferGeometry( 40, 40 );
		var material = new THREE.MeshStandardMaterial();
		material.side = 2;
		material.emissive.setHex( 14671839 ); 
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = meshGroup.name + '.Plane ' + ( ++ meshCount1 );
		mesh.receiveShadow = true;
		mesh.rotateX( - Math.PI / 2 );

		meshGroup.add(mesh);

		editor.signals.StageGrid.dispatch( false ) ; 
		editor.signals.sceneBackgroundChanged.dispatch( 16777215 );

		editor.execute( new AddObjectCommand( meshGroup ) );

		var childs = editor.scene.children;

		for( var x in childs){
			
			if( childs[x].type == "Mesh" ){
				
				childs[x].castShadow = true;
			}

		}

	} );
	options.add( option );

	//
	
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'DarkSpace' );
	option.onClick( function () {

		editor.scene.background = new THREE.Color( 0x111111 );
		editor.signals.StageGrid.dispatch( false ) ; 

		var meshCount2 = 0;
		var lightCount = 0;

		var meshGroup = new THREE.Group();
		meshGroup.name = 'StageGroup ' + ( ++ meshCount );

		// Lights
		var light = new THREE.HemisphereLight( 0xffffff, 0x111122 );
		light.position.set( - 1, 3, 1 );
		light.name = meshGroup.name + '.HemisphereLight ' + ( ++ lightCount );
		meshGroup.add(light);

		var light = new THREE.SpotLight();
		light.name = meshGroup.name + '.SpotLight ' + ( ++ lightCount );
		light.angle = Math.PI / 8;
		light.penumbra = 0.7;
		light.castShadow = true;
		light.position.set( - 1, 5, 1 );
		meshGroup.add( light );

		// Ground
		var plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 40, 40 ),
			new THREE.MeshPhongMaterial( { color: 0x1B1A1A, specular: 0x101010 } )
		);
		plane.rotation.x = - Math.PI / 2;
		plane.receiveShadow = true;
		plane.side = 2;
		plane.name = meshGroup.name + '.Plane ' + ( ++ meshCount2 );

		meshGroup.add(plane);

		editor.execute( new AddObjectCommand( meshGroup ) );

		var childs = editor.scene.children;

		for( var x in childs){

			if( childs[x].type == "Mesh"){
				
				childs[x].castShadow = true;
			}

		}

	} );
	options.add( option );

	return container;
}