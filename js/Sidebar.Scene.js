/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// outliner

	function buildOption( object, draggable ) {

		/*
		<div draggable="false" class="option">
		<span class="type PerspectiveCamera"></span>
		 Camera
		 </div>
		 */
		var option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = buildHTML( object );
		option.value = object.id;

		return option;

	}

	function getMaterialName( material ) {

		if ( Array.isArray( material ) ) {//Array.isArray()判断某个值是否为数组，返回布尔类型

			var array = [];

			for ( var i = 0; i < material.length; i ++ ) {

				array.push( material[ i ].name );

			}

			return array.join( ',' );

		}

		return material.name;

	}

	function buildHTML( object ) {
		/*
		举例：
		#outliner .Mesh { color: #8888ee;}
		<span class="type Mesh">
		::after
		</span>
		"Box1"

		<span class="type MeshStandardMaterial">
		::after
		</span>
		"matName"
		 */

		var html = '<span class="type ' + object.type + '"></span> ' + object.name;

		if ( object instanceof THREE.Mesh ) {

			var geometry = object.geometry;
			var material = object.material;

			html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
			html += ' <span class="type ' + material.type + '"></span> ' + getMaterialName( material );

		}

		html += getScript( object.uuid );

		return html;

	}

	function getScript( uuid ) {

		if ( editor.scripts[ uuid ] !== undefined ) {

			return ' <span class="type Script"></span>';

		}

		return '';

	}

	var ignoreObjectSelectedSignal = false;


	var outliner = new UI.Outliner( editor );
	outliner.setId( 'outliner' );
	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.selectById( parseInt( outliner.getValue() ) );//outliner.getValue()返回当前选中物体的id

		ignoreObjectSelectedSignal = false;

	} );
	outliner.onDblClick( function () {

		editor.focusById( parseInt( outliner.getValue() ) );

	} );
	container.add( outliner );
	container.add( new UI.Break() );

	var backgroundrow = new UI.Row();
	backgroundrow.add( new UI.Text( 'Background' ).setWidth( '90px' ) );
	container.add(backgroundrow);


	var backgroundType = new UI.Select().setOptions( {
			'none':'None',
			'backgroundcolor': 'BackgroundColor',
			'backgroundimage': 'backgroundImage',
			'skyboximage': 'SkyBoxImage'

		} ).setWidth( '150px' ).onChange(function (){

			//onbackgroundchanged();
			refushBackgroundUI();
		});
	backgroundType.setValue( "none" );

	backgroundrow.add(backgroundType);

	var backgroundProperties = new UI.Row().setDisplay('none');
	container.add(backgroundProperties);
	// background

	function onBackgroundColorChanged() {

		signals.sceneBackgroundChanged.dispatch( backgroundColor.getHexValue() );

	}

	var backgroundRow = new UI.Row().setDisplay('none');

	var backgroundColor = new UI.Color().setValue( '#aaaaaa' ).onChange( onBackgroundColorChanged );

	backgroundRow.add( new UI.Text( 'BackgroundColor' ).setWidth( '120px' ) );
	backgroundRow.add( backgroundColor );

	backgroundProperties.add( backgroundRow );

	//backgroundImage
	
	function onBackgroundImageChanged() {
		
		signals.sceneBackgroundImageChanged.dispatch( backgroundImage.getValue() );
	}

	var backgroundImageRow = new UI.Row().setDisplay('none');

	var backgroundImage = new UI.Texture().onChange( onBackgroundImageChanged );

	backgroundImageRow.add( new UI.Text( 'BackgroundImage' ).setWidth( '120px' ) );
	backgroundImageRow.add( backgroundImage );

	backgroundProperties.add( backgroundImageRow );

	//sKyBoxImage
	
	function onSkyBoxImageChanged() {


		if(skyBoxImageEnabled.getValue()==true && skyBoxImagePX.imageload!=null && skyBoxImageNX.imageload!=null && skyBoxImagePY.imageload!=null && skyBoxImageNY.imageload!=null && skyBoxImagePZ.imageload!=null && skyBoxImageNZ.imageload!=null){
			var path = "image/SkyBox/";
			var urls = [
				path + skyBoxImagePX.imageload.sourceFile , path + skyBoxImageNX.imageload.sourceFile,
				path + skyBoxImagePY.imageload.sourceFile , path + skyBoxImageNY.imageload.sourceFile,
				path + skyBoxImagePZ.imageload.sourceFile , path + skyBoxImageNZ.imageload.sourceFile
			];
			signals.sceneSkyBoxImageChanged.dispatch( urls );
		}
		else{
			skyBoxImageEnabled.setValue(false);
			onBackgroundColorChanged();
		}
		
	}

	var skyBoxImageRow = new UI.Row().setDisplay('none');

	skyBoxImageRow.add( new UI.Text( 'SkyBoxImage:天空盒背景' ).setWidth( '170px' ) );
	skyBoxImageEnabled = new UI.Checkbox( false ).setWidth( '15px' ).onChange(onSkyBoxImageChanged)
	skyBoxImageRow.add( skyBoxImageEnabled );

	var imageRow = new UI.Row();

	var skyBoxImagePX = new UI.ImageLoad();
	var skyBoxImageNX = new UI.ImageLoad();
	var skyBoxImagePY = new UI.ImageLoad();
	var skyBoxImageNY = new UI.ImageLoad();
	var skyBoxImagePZ = new UI.ImageLoad();
	var skyBoxImageNZ = new UI.ImageLoad();

	imageRow.add(skyBoxImagePX);
	imageRow.add(skyBoxImageNX);
	imageRow.add(skyBoxImagePY);
	imageRow.add(skyBoxImageNY);
	imageRow.add(skyBoxImagePZ);
	imageRow.add(skyBoxImageNZ);

	skyBoxImageRow.add( imageRow );
	backgroundProperties.add( skyBoxImageRow );

	// refushBackgroundUI

	function refushBackgroundUI() {

		var type = backgroundType.getValue();
		if(type === 'none'){

			signals.sceneBackgroundChanged.dispatch( backgroundColor.getHexValue() );
		}

		backgroundProperties.setDisplay( type === 'none' ? 'none' : '' );
		backgroundRow.setDisplay( type === 'backgroundcolor' ? '' : 'none' );
		backgroundImageRow.setDisplay( type === 'backgroundimage' ? '' : 'none' );
		skyBoxImageRow.setDisplay( type === 'skyboximage' ? '' : 'none' );

	}
	// fog

	function onFogChanged() {

		signals.sceneFogChanged.dispatch(
			fogType.getValue(),
			fogColor.getHexValue(),
			fogNear.getValue(),
			fogFar.getValue(),
			fogDensity.getValue()
		);

	}

	var fogTypeRow = new UI.Row();
	var fogType = new UI.Select().setOptions( {

		'None': 'None',
		'Fog': 'Linear',
		'FogExp2': 'Exponential'

	} ).setWidth( '150px' );
	fogType.onChange( function () {

		onFogChanged();
		refreshFogUI();

	} );

	fogTypeRow.add( new UI.Text( 'Fog' ).setWidth( '90px' ) );
	fogTypeRow.add( fogType );

	container.add( fogTypeRow );

	// fog color

	var fogPropertiesRow = new UI.Row();
	fogPropertiesRow.setDisplay( 'none' );
	fogPropertiesRow.setMarginLeft( '90px' );
	container.add( fogPropertiesRow );

	var fogColor = new UI.Color().setValue( '#aaaaaa' );
	fogColor.onChange( onFogChanged );
	fogPropertiesRow.add( fogColor );

	// fog near

	var fogNear = new UI.Number( 0.1 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	fogPropertiesRow.add( fogNear );

	// fog far

	var fogFar = new UI.Number( 50 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	fogPropertiesRow.add( fogFar );

	// fog density

	var fogDensity = new UI.Number( 0.05 ).setWidth( '40px' ).setRange( 0, 0.1 ).setPrecision( 3 ).onChange( onFogChanged );
	fogPropertiesRow.add( fogDensity );
    
    signals.ShowFog.add(function (color,near,far){
    	fogColor.setValue( color );
    	fogNear.setValue( near );
    	fogFar.setValue( far );
    	onFogChanged();

    })
	//

	function refreshUI() {

		var camera = editor.camera;
		var scene = editor.scene;

		var options = [];

		options.push( buildOption( camera, false ) );
		options.push( buildOption( scene, false ) );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				var option = buildOption( object, true );
				option.style.paddingLeft = ( pad * 10 ) + 'px';
				options.push( option );

				addObjects( object.children, pad + 1 );

			}

		} )( scene.children, 1 );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}

		if ( scene.background ) {

			if(typeof(scene.background.getHex)==='function')

			backgroundColor.setHexValue( scene.background.getHex() );


		}

		if ( scene.fog ) {

			fogColor.setHexValue( scene.fog.color.getHex() );

			if ( scene.fog instanceof THREE.Fog ) {

				fogType.setValue( "Fog" );
				fogNear.setValue( scene.fog.near );
				fogFar.setValue( scene.fog.far );

			} else if ( scene.fog instanceof THREE.FogExp2 ) {

				fogType.setValue( "FogExp2" );
				fogDensity.setValue( scene.fog.density );

			}

		} else {

			fogType.setValue( "None" );

		}

		refreshFogUI();

	}

	function refreshFogUI() {

		var type = fogType.getValue();

		fogPropertiesRow.setDisplay( type === 'None' ? 'none' : '' );
		fogNear.setDisplay( type === 'Fog' ? '' : 'none' );
		fogFar.setDisplay( type === 'Fog' ? '' : 'none' );
		fogDensity.setDisplay( type === 'FogExp2' ? '' : 'none' );

	}

	refreshUI();

	// events

	signals.editorCleared.add( refreshUI );

	signals.sceneGraphChanged.add( refreshUI );

	signals.objectChanged.add( function ( object ) {

		var options = outliner.options;

		for ( var i = 0; i < options.length; i ++ ) {

			var option = options[ i ];

			if ( option.value === object.id ) {

				option.innerHTML = buildHTML( object );
				return;

			}

		}

	} );

	signals.objectSelected.add( function ( object ) {

		if ( ignoreObjectSelectedSignal === true ) return;

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

};
