MatBar.Paras = function(editor){
	
	var container = new UI.Panel();//DIV
	container.setId('paras');

	var currentMaterial = new THREE.MeshStandardMaterial();//初始化

	// type
	
	var materialClassRow = new UI.Row().setTop( '8px' );
	var materialClass = new UI.Select().setOptions( {

		'LineBasicMaterial': 'LineBasicMaterial',
		'LineDashedMaterial': 'LineDashedMaterial',
		'MeshBasicMaterial': 'MeshBasicMaterial',
		'MeshDepthMaterial': 'MeshDepthMaterial',
		'MeshNormalMaterial': 'MeshNormalMaterial',
		'MeshLambertMaterial': 'MeshLambertMaterial',
		'MeshPhongMaterial': 'MeshPhongMaterial',
		'MeshStandardMaterial': 'MeshStandardMaterial',
		'MeshPhysicalMaterial': 'MeshPhysicalMaterial',
		'ShaderMaterial': 'ShaderMaterial',
		'SpriteMaterial': 'SpriteMaterial'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( updateMat );

	materialClassRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	materialClassRow.add( materialClass );

	container.add( materialClassRow );

	// uuid

	var materialUUIDRow = new UI.Row();
	var materialUUID = new UI.Input().setWidth( '102px' ).setFontSize( '12px' ).setDisabled( true );
	var materialUUIDRenew = new UI.Button( 'New' ).setMarginLeft( '7px' ).onClick( function () {

		materialUUID.setValue( THREE.Math.generateUUID() );
		updateMat();

	} );

	materialUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	materialUUIDRow.add( materialUUID );
	materialUUIDRow.add( materialUUIDRenew );

	container.add( materialUUIDRow );

	// name

	var materialNameRow = new UI.Row();
	var materialName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		///editor.execute( new SetMaterialValueCommand( editor.selected, 'name', materialName.getValue() ) );

	} );

	materialNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	materialNameRow.add( materialName );

	container.add( materialNameRow );

	// program

	var materialProgramRow = new UI.Row();
	materialProgramRow.add( new UI.Text( 'Program' ).setWidth( '90px' ) );

	var materialProgramInfo = new UI.Button( 'Info' );
	materialProgramInfo.setMarginLeft( '4px' );
	materialProgramInfo.onClick( function () {

		signals.editScript.dispatch( currentObject, 'programInfo' );

	} );
	materialProgramRow.add( materialProgramInfo );

	var materialProgramVertex = new UI.Button( 'Vertex' );
	materialProgramVertex.setMarginLeft( '4px' );
	materialProgramVertex.onClick( function () {

		signals.editScript.dispatch( currentObject, 'vertexShader' );

	} );
	materialProgramRow.add( materialProgramVertex );

	var materialProgramFragment = new UI.Button( 'Fragment' );
	materialProgramFragment.setMarginLeft( '4px' );
	materialProgramFragment.onClick( function () {

		signals.editScript.dispatch( currentObject, 'fragmentShader' );

	} );
	materialProgramRow.add( materialProgramFragment );

	container.add( materialProgramRow );


	// color

	var materialColorRow = new UI.Row();
	var materialColor = new UI.Color().onChange( updateMat );

	materialColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	materialColorRow.add( materialColor );

	container.add( materialColorRow );

	// roughness

	var materialRoughnessRow = new UI.Row();
	var materialRoughness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialRoughnessRow.add( new UI.Text( 'Roughness' ).setWidth( '90px' ) );
	materialRoughnessRow.add( materialRoughness );

	container.add( materialRoughnessRow );

	// metalness

	var materialMetalnessRow = new UI.Row();
	var materialMetalness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialMetalnessRow.add( new UI.Text( 'Metalness' ).setWidth( '90px' ) );
	materialMetalnessRow.add( materialMetalness );

	container.add( materialMetalnessRow );

	// emissive

	var materialEmissiveRow = new UI.Row();
	var materialEmissive = new UI.Color().setHexValue( 0x000000 ).onChange( updateMat );

	materialEmissiveRow.add( new UI.Text( 'Emissive' ).setWidth( '90px' ) );
	materialEmissiveRow.add( materialEmissive );

	container.add( materialEmissiveRow );

	// specular

	var materialSpecularRow = new UI.Row();
	var materialSpecular = new UI.Color().setHexValue( 0x111111 ).onChange( updateMat );

	materialSpecularRow.add( new UI.Text( 'Specular' ).setWidth( '90px' ) );
	materialSpecularRow.add( materialSpecular );

	container.add( materialSpecularRow );

	// shininess

	var materialShininessRow = new UI.Row();
	var materialShininess = new UI.Number( 30 ).onChange( updateMat );

	materialShininessRow.add( new UI.Text( 'Shininess' ).setWidth( '90px' ) );
	materialShininessRow.add( materialShininess );

	container.add( materialShininessRow );

	// clearCoat

	var materialClearCoatRow = new UI.Row();
	var materialClearCoat = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialClearCoatRow.add( new UI.Text( 'ClearCoat' ).setWidth( '90px' ) );
	materialClearCoatRow.add( materialClearCoat );

	container.add( materialClearCoatRow );

	// clearCoatRoughness

	var materialClearCoatRoughnessRow = new UI.Row();
	var materialClearCoatRoughness = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialClearCoatRoughnessRow.add( new UI.Text( 'ClearCoat Roughness' ).setWidth( '90px' ) );
	materialClearCoatRoughnessRow.add( materialClearCoatRoughness );

	container.add( materialClearCoatRoughnessRow );

	// vertex colors

	var materialVertexColorsRow = new UI.Row();
	var materialVertexColors = new UI.Select().setOptions( {

		0: 'No',
		1: 'Face',
		2: 'Vertex'

	} ).onChange( updateMat );

	materialVertexColorsRow.add( new UI.Text( 'Vertex Colors' ).setWidth( '90px' ) );
	materialVertexColorsRow.add( materialVertexColors );

	container.add( materialVertexColorsRow );

	// skinning

	var materialSkinningRow = new UI.Row();
	var materialSkinning = new UI.Checkbox( false ).onChange( updateMat );

	materialSkinningRow.add( new UI.Text( 'Skinning' ).setWidth( '90px' ) );
	materialSkinningRow.add( materialSkinning );

	container.add( materialSkinningRow );

	// map

	var materialMapRow = new UI.Row();
	var materialMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialMap = new UI.Texture().onChange( updateMat );

	materialMapRow.add( new UI.Text( 'Map' ).setWidth( '90px' ) );
	materialMapRow.add( materialMapEnabled );
	materialMapRow.add( materialMap );

	container.add( materialMapRow );

	// alpha map

	var materialAlphaMapRow = new UI.Row();
	var materialAlphaMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialAlphaMap = new UI.Texture().onChange( updateMat );

	materialAlphaMapRow.add( new UI.Text( 'Alpha Map' ).setWidth( '90px' ) );
	materialAlphaMapRow.add( materialAlphaMapEnabled );
	materialAlphaMapRow.add( materialAlphaMap );

	container.add( materialAlphaMapRow );

	// bump map

	var materialBumpMapRow = new UI.Row();
	var materialBumpMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialBumpMap = new UI.Texture().onChange( updateMat );
	var materialBumpScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( updateMat );

	materialBumpMapRow.add( new UI.Text( 'Bump Map' ).setWidth( '90px' ) );
	materialBumpMapRow.add( materialBumpMapEnabled );
	materialBumpMapRow.add( materialBumpMap );
	materialBumpMapRow.add( materialBumpScale );

	container.add( materialBumpMapRow );

	// normal map

	var materialNormalMapRow = new UI.Row();
	var materialNormalMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialNormalMap = new UI.Texture().onChange( updateMat );

	materialNormalMapRow.add( new UI.Text( 'Normal Map' ).setWidth( '90px' ) );
	materialNormalMapRow.add( materialNormalMapEnabled );
	materialNormalMapRow.add( materialNormalMap );

	container.add( materialNormalMapRow );

	// displacement map

	var materialDisplacementMapRow = new UI.Row();
	var materialDisplacementMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialDisplacementMap = new UI.Texture().onChange( updateMat );
	var materialDisplacementScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( updateMat );

	materialDisplacementMapRow.add( new UI.Text( 'Displace Map' ).setWidth( '90px' ) );
	materialDisplacementMapRow.add( materialDisplacementMapEnabled );
	materialDisplacementMapRow.add( materialDisplacementMap );
	materialDisplacementMapRow.add( materialDisplacementScale );

	container.add( materialDisplacementMapRow );

	// roughness map

	var materialRoughnessMapRow = new UI.Row();
	var materialRoughnessMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialRoughnessMap = new UI.Texture().onChange( updateMat );

	materialRoughnessMapRow.add( new UI.Text( 'Rough. Map' ).setWidth( '90px' ) );
	materialRoughnessMapRow.add( materialRoughnessMapEnabled );
	materialRoughnessMapRow.add( materialRoughnessMap );

	container.add( materialRoughnessMapRow );

	// metalness map

	var materialMetalnessMapRow = new UI.Row();
	var materialMetalnessMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialMetalnessMap = new UI.Texture().onChange( updateMat );

	materialMetalnessMapRow.add( new UI.Text( 'Metal. Map' ).setWidth( '90px' ) );
	materialMetalnessMapRow.add( materialMetalnessMapEnabled );
	materialMetalnessMapRow.add( materialMetalnessMap );

	container.add( materialMetalnessMapRow );

	// specular map

	var materialSpecularMapRow = new UI.Row();
	var materialSpecularMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialSpecularMap = new UI.Texture().onChange( updateMat );

	materialSpecularMapRow.add( new UI.Text( 'Specular Map' ).setWidth( '90px' ) );
	materialSpecularMapRow.add( materialSpecularMapEnabled );
	materialSpecularMapRow.add( materialSpecularMap );

	container.add( materialSpecularMapRow );

	// env map

	var materialEnvMapRow = new UI.Row();
	var materialEnvMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialEnvMap = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( updateMat );
	var materialReflectivity = new UI.Number( 1 ).setWidth( '30px' ).onChange( updateMat );

	materialEnvMapRow.add( new UI.Text( 'Env Map' ).setWidth( '90px' ) );
	materialEnvMapRow.add( materialEnvMapEnabled );
	materialEnvMapRow.add( materialEnvMap );
	materialEnvMapRow.add( materialReflectivity );

	container.add( materialEnvMapRow );

	// light map

	var materialLightMapRow = new UI.Row();
	var materialLightMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialLightMap = new UI.Texture().onChange( updateMat );

	materialLightMapRow.add( new UI.Text( 'Light Map' ).setWidth( '90px' ) );
	materialLightMapRow.add( materialLightMapEnabled );
	materialLightMapRow.add( materialLightMap );

	container.add( materialLightMapRow );

	// ambient occlusion map

	var materialAOMapRow = new UI.Row();
	var materialAOMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialAOMap = new UI.Texture().onChange( updateMat );
	var materialAOScale = new UI.Number( 1 ).setRange( 0, 1 ).setWidth( '30px' ).onChange( updateMat );

	materialAOMapRow.add( new UI.Text( 'AO Map' ).setWidth( '90px' ) );
	materialAOMapRow.add( materialAOMapEnabled );
	materialAOMapRow.add( materialAOMap );
	materialAOMapRow.add( materialAOScale );

	container.add( materialAOMapRow );

	// emissive map

	var materialEmissiveMapRow = new UI.Row();
	var materialEmissiveMapEnabled = new UI.Checkbox( false ).onChange( updateMat );
	var materialEmissiveMap = new UI.Texture().onChange( updateMat );

	materialEmissiveMapRow.add( new UI.Text( 'Emissive Map' ).setWidth( '90px' ) );
	materialEmissiveMapRow.add( materialEmissiveMapEnabled );
	materialEmissiveMapRow.add( materialEmissiveMap );

	container.add( materialEmissiveMapRow );

	// side

	var materialSideRow = new UI.Row();
	var materialSide = new UI.Select().setOptions( {

		0: 'Front',
		1: 'Back',
		2: 'Double'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( updateMat );

	materialSideRow.add( new UI.Text( 'Side' ).setWidth( '90px' ) );
	materialSideRow.add( materialSide );

	container.add( materialSideRow );

	// shading

	var materialShadingRow = new UI.Row();
	var materialShading = new UI.Select().setOptions( {

		0: 'No',
		1: 'Flat',
		2: 'Smooth'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( updateMat );

	materialShadingRow.add( new UI.Text( 'Shading' ).setWidth( '90px' ) );
	materialShadingRow.add( materialShading );

	container.add( materialShadingRow );

	// blending

	var materialBlendingRow = new UI.Row();
	var materialBlending = new UI.Select().setOptions( {

		0: 'No',
		1: 'Normal',
		2: 'Additive',
		3: 'Subtractive',
		4: 'Multiply',
		5: 'Custom'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( updateMat );

	materialBlendingRow.add( new UI.Text( 'Blending' ).setWidth( '90px' ) );
	materialBlendingRow.add( materialBlending );

	container.add( materialBlendingRow );

	// opacity

	var materialOpacityRow = new UI.Row();
	var materialOpacity = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialOpacityRow.add( new UI.Text( 'Opacity' ).setWidth( '90px' ) );
	materialOpacityRow.add( materialOpacity );

	container.add( materialOpacityRow );

	// transparent

	var materialTransparentRow = new UI.Row();
	var materialTransparent = new UI.Checkbox().setLeft( '100px' ).onChange( updateMat );

	materialTransparentRow.add( new UI.Text( 'Transparent' ).setWidth( '90px' ) );
	materialTransparentRow.add( materialTransparent );

	container.add( materialTransparentRow );

	// alpha test

	var materialAlphaTestRow = new UI.Row();
	var materialAlphaTest = new UI.Number().setWidth( '60px' ).setRange( 0, 1 ).onChange( updateMat );

	materialAlphaTestRow.add( new UI.Text( 'Alpha Test' ).setWidth( '90px' ) );
	materialAlphaTestRow.add( materialAlphaTest );

	container.add( materialAlphaTestRow );

	// wireframe

	var materialWireframeRow = new UI.Row();
	var materialWireframe = new UI.Checkbox( false ).onChange( updateMat );
	var materialWireframeLinewidth = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 100 ).onChange( updateMat );

	materialWireframeRow.add( new UI.Text( 'Wireframe' ).setWidth( '90px' ) );
	materialWireframeRow.add( materialWireframe );
	materialWireframeRow.add( materialWireframeLinewidth );

	container.add( materialWireframeRow );

	var materialSave = new UI.Row();
	var materialSaveButton = new UI.Button( 'save' ).setMarginLeft( '90px' ).onClick( function () {

	} );
	var materialQuit = new UI.Button( 'quit' ).setMarginLeft( '7px' ).onClick( function () {

	} );
	materialSave.add(materialSaveButton);
	materialSave.add(materialQuit);
	container.add(materialSave);

	

	function updateMat(){
		if(currentMaterial){
			if ( currentMaterial.uuid !== undefined && currentMaterial.uuid !== materialUUID.getValue() ) {

				currentMaterial.uuid = materialUUID.getValue()

			}

			if ( currentMaterial instanceof THREE[ materialClass.getValue() ] === false ) {

				 currentMaterial = new THREE[ materialClass.getValue() ]();//不需保存任何变量
				 setRowVisibility();//一旦materialClass变化，就刷新显示页面

			}

			if ( currentMaterial.color !== undefined && currentMaterial.color.getHex() !== materialColor.getHexValue() ) {

				currentMaterial.color = materialColor.getHexValue();

			}

			if ( currentMaterial.roughness !== undefined && Math.abs( currentMaterial.roughness - materialRoughness.getValue() ) >= 0.01 ) {

				currentMaterial.roughness = materialRoughness.getValue();

			}

			if ( currentMaterial.metalness !== undefined && Math.abs( currentMaterial.metalness - materialMetalness.getValue() ) >= 0.01 ) {

				currentMaterial.metalness = materialMetalness.getValue();

			}



		}

		console.log(currentMaterial)
				
	
	}

	function setRowVisibility() {

		var properties = {
			'name': materialNameRow,
			'color': materialColorRow,
			'roughness': materialRoughnessRow,
			'metalness': materialMetalnessRow,
			'emissive': materialEmissiveRow,
			'specular': materialSpecularRow,
			'shininess': materialShininessRow,
			'clearCoat': materialClearCoatRow,
			'clearCoatRoughness': materialClearCoatRoughnessRow,
			'vertexShader': materialProgramRow,
			'vertexColors': materialVertexColorsRow,
			'skinning': materialSkinningRow,
			'map': materialMapRow,
			'alphaMap': materialAlphaMapRow,
			'bumpMap': materialBumpMapRow,
			'normalMap': materialNormalMapRow,
			'displacementMap': materialDisplacementMapRow,
			'roughnessMap': materialRoughnessMapRow,
			'metalnessMap': materialMetalnessMapRow,
			'specularMap': materialSpecularMapRow,
			'envMap': materialEnvMapRow,
			'lightMap': materialLightMapRow,
			'aoMap': materialAOMapRow,
			'emissiveMap': materialEmissiveMapRow,
			'side': materialSideRow,
			'shading': materialShadingRow,
			'blending': materialBlendingRow,
			'opacity': materialOpacityRow,
			'transparent': materialTransparentRow,
			'alphaTest': materialAlphaTestRow,
			'wireframe': materialWireframeRow
		};

		var material = new THREE.LineBasicMaterial();;

		for ( var property in properties ) {
			//若该属性不属于matarial，则不显示
			properties[ property ].setDisplay( currentMaterial[ property ] !== undefined ? '' : 'none' );

		}

	}
	return container;
}