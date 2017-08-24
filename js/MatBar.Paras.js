MatBar.Paras = function(editor){
	
	var container = new UI.Panel();//DIV
	container.setId('paras');
	
	var currentObject = new THREE.Mesh(new THREE.BoxBufferGeometry(4,4,4),new THREE.MeshStandardMaterial());//新建时为标准，修改时为修改前的材质
	var currentMaterial = currentObject.material;//初始化,后续currentMaterial变化时不需要改变currentObject
	var currentGeometry = currentObject.geometry;

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
	var materialName = new UI.Input("").setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {
		
		updateMat();

	} );

	materialNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	materialNameRow.add( materialName );

	container.add( materialNameRow );

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
	var materialSaveButton = new UI.Button( 'SAVE' ).setMarginLeft( '55px' ).onClick( function () {

		if( editMat.editMatFlag == true){

			if(currentMaterial.name == ""){

				alert("请输入材质名称！");

			}
			else{

				currentMat = currentMaterial; //赋值成功
				editMat.li.firstChild.textContent = currentMat.name;
				branchLib.branchArray[editMat.branchIndex].ownMat[editMat.ownMatIndex] = currentMat;
			
			}

			editMat.editMatFlag = false;
			currentMaterial = currentObject.material;//初始化，放弃之前编辑的参数
			currentMat = currentMaterial;
			refreshUI();
			console.log(branchLib);
			return;

		}


		if(currentMaterial.name == ""){

			alert("请输入材质名称！")

		}
		else{

			currentMat = currentMaterial; //赋值成功
			console.log(currentMat);
			branchLib.flag = true;// add mat 会检测

			//必须初始化currentMat  不然在元mat上只修改name之后会put相同mat到同一branch
			currentObject.material = new THREE.MeshStandardMaterial();
			currentMaterial = currentObject.material;//初始化，放弃之前编辑的参数
			refreshUI();

			//leftbar下面缓冲区只允许缓冲一个mat
			if(leftbar.dom.lastChild.className == "bufferMat" ){
				leftbar.dom.removeChild(leftbar.dom.lastChild);
			}

			var newMatRow = new UI.Row().setClass('bufferMat');
    		newMatRow.add( new UI.Button( currentMat.name ).setTop("20px").setMarginLeft( '10px' ).setWidth( "280px" ).setBackgroundColor("#808983"));
    		leftbar.add(newMatRow);

		}
		
	} );

	var materialQuit = new UI.Button( 'RESET' ).setMarginLeft( '7px' ).onClick( function () {
		editMat.editMatFlag = false;
		initCurrentMat();
		refreshUI();

	} );

	var materialExit = new UI.Button( 'EXIT' ).setMarginLeft( '7px' ).onClick( function () {

		initCurrentMat();
		matbar.setDisplay('none');//关闭编辑窗口
		viewport.setLeft('300px');
		
	} );

	materialSave.add(materialSaveButton);
	materialSave.add(materialQuit);
	materialSave.add(materialExit);

	container.add(materialSave);

	refreshUI();

	
	function initCurrentMat(){
		currentObject.material = new THREE.MeshStandardMaterial();
		currentMaterial = currentObject.material;//初始化，放弃之前编辑的参数
		currentMat = new THREE.MeshStandardMaterial();
	}
	
	function updateMat(){

		var textureWarning = false;
		var objectHasUvs = false;

		if ( currentObject instanceof THREE.Sprite ) objectHasUvs = true;
		if ( currentGeometry instanceof THREE.Geometry && currentGeometry.faceVertexUvs[ 0 ].length > 0 ) objectHasUvs = true;
		if ( currentGeometry instanceof THREE.BufferGeometry && currentGeometry.attributes.uv !== undefined ) objectHasUvs = true;

		//生成currentMaterial
		if(currentMaterial){
			if ( currentMaterial instanceof THREE[ materialClass.getValue() ] === false ) {

				 currentMaterial = new THREE[ materialClass.getValue() ]();//不需保存任何变量

				 setRowVisibility();//一旦materialClass变化，就刷新显示页面

			}

			if ( currentMaterial.uuid !== undefined && currentMaterial.uuid !== materialUUID.getValue() ) {

				currentMaterial.uuid = materialUUID.getValue();

			}

			if ( currentMaterial.name !== undefined && currentMaterial.name !== materialName.getValue()) {

				currentMaterial.name = materialName.getValue();

			}

			if ( currentMaterial.color !== undefined && currentMaterial.color.getHex() !== materialColor.getHexValue() ) {

				currentMaterial.color.setHex(materialColor.getHexValue());
				//console.log( currentMaterial.color.getHex() + "  "+materialColor.getHexValue() ) 相等的十六进制数

			}

			if ( currentMaterial.roughness !== undefined && Math.abs( currentMaterial.roughness - materialRoughness.getValue() ) >= 0.01 ) {

				currentMaterial.roughness = materialRoughness.getValue();

			}

			if ( currentMaterial.metalness !== undefined && Math.abs( currentMaterial.metalness - materialMetalness.getValue() ) >= 0.01 ) {

				currentMaterial.metalness = materialMetalness.getValue();

			}

			if ( currentMaterial.emissive !== undefined && currentMaterial.emissive.getHex() !== materialEmissive.getHexValue() ) {

				currentMaterial.emissive.setHex(materialEmissive.getHexValue());

			}

			if ( currentMaterial.specular !== undefined && currentMaterial.specular.getHex() !== materialSpecular.getHexValue() ) {

				currentMaterial.specular.setHex(materialSpecular.getHexValue());

			}


			if ( currentMaterial.shininess !== undefined && Math.abs( currentMaterial.shininess - materialShininess.getValue() ) >= 0.01 ) {

				currentMaterial.shininess = materialShininess.getValue();

			}

			if ( currentMaterial.clearCoat !== undefined && Math.abs( currentMaterial.clearCoat - materialClearCoat.getValue() ) >= 0.01 ) {

				currentMaterial.clearCoat = materialClearCoat.getValue();

			}

			if ( currentMaterial.clearCoatRoughness !== undefined && Math.abs( currentMaterial.clearCoatRoughness - materialClearCoatRoughness.getValue() ) >= 0.01 ) {

				currentMaterial.clearCoatRoughness = materialClearCoatRoughness.getValue();

			}


			if ( currentMaterial.vertexColors !== undefined ) {

				var vertexColors = parseInt( materialVertexColors.getValue() );

				if ( currentMaterial.vertexColors !== vertexColors ) {

					currentMaterial.vertexColors = vertexColors

				}

			}

			if ( currentMaterial.skinning !== undefined && currentMaterial.skinning !== materialSkinning.getValue() ) {

				currentMaterial.skinning = materialSkinning.getValue()

			}


			if ( currentMaterial.map !== undefined ) {

				var mapEnabled = materialMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var map = mapEnabled ? materialMap.getValue() : null;
					if ( currentMaterial.map !== map ) {

						currentMaterial.map = map;

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.alphaMap !== undefined ) {

				var mapEnabled = materialAlphaMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;
					if ( currentMaterial.alphaMap !== alphaMap ) {

						currentMaterial.alphaMap = alphaMap ;

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.bumpMap !== undefined ) {

				var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
					if ( currentMaterial.bumpMap !== bumpMap ) {

						currentMaterial.bumpMap = bumpMap;

					}

					if ( currentMaterial.bumpScale !== materialBumpScale.getValue() ) {

						currentMaterial.bumpScale = materialBumpScale.getValue()

					}

				} else {

					if ( bumpMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.normalMap !== undefined ) {

				var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
					if ( currentMaterial.normalMap !== normalMap ) {

						currentMaterial.normalMap = normalMap;

					}

				} else {

					if ( normalMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.displacementMap !== undefined ) {

				var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;
					if ( currentMaterial.displacementMap !== displacementMap ) {

						currentMaterial.displacementMap = displacementMap;

					}

					if ( currentMaterial.displacementScale !== materialDisplacementScale.getValue() ) {

						currentMaterial.displacementScale = materialDisplacementScale.getValue();

					}

				} else {

					if ( displacementMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.roughnessMap !== undefined ) {

				var roughnessMapEnabled = materialRoughnessMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;
					if ( currentMaterial.roughnessMap !== roughnessMap ) {

						currentMaterial.roughnessMap = roughnessMap;

					}

				} else {

					if ( roughnessMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.metalnessMap !== undefined ) {

				var metalnessMapEnabled = materialMetalnessMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;
					if ( currentMaterial.metalnessMap !== metalnessMap ) {

						currentMaterial.metalnessMap = metalnessMap;

					}

				} else {

					if ( metalnessMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.specularMap !== undefined ) {

				var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
					if ( currentMaterial.specularMap !== specularMap ) {

						currentMaterial.specularMap = specularMap;

					}

				} else {

					if ( specularMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.envMap !== undefined ) {

				var envMapEnabled = materialEnvMapEnabled.getValue() === true;

				var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

				if ( currentMaterial.envMap !== envMap ) {

					currentMaterial.envMap = envMap;

				}

			}

			if ( currentMaterial.reflectivity !== undefined ) {

				var reflectivity = materialReflectivity.getValue();

				if ( currentMaterial.reflectivity !== reflectivity ) {

					currentMaterial.reflectivity = reflectivity;

				}

			}

			if ( currentMaterial.lightMap !== undefined ) {

				var lightMapEnabled = materialLightMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
					if ( currentMaterial.lightMap !== lightMap ) {

						currentMaterial.lightMap = lightMap;

					}

				} else {

					if ( lightMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.aoMap !== undefined ) {

				var aoMapEnabled = materialAOMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;
					if ( currentMaterial.aoMap !== aoMap ) {

						currentMaterial.aoMap = aoMap;

					}

					if ( currentMaterial.aoMapIntensity !== materialAOScale.getValue() ) {

						currentMaterial.aoMapIntensity = materialAOScale.getValue();

					}

				} else {

					if ( aoMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.emissiveMap !== undefined ) {

				var emissiveMapEnabled = materialEmissiveMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;
					if ( currentMaterial.emissiveMap !== emissiveMap ) {

						currentMaterial.emissiveMap = emissiveMap ;

					}

				} else {

					if ( emissiveMapEnabled ) textureWarning = true;

				}

			}

			if ( currentMaterial.side !== undefined ) {

				var side = parseInt( materialSide.getValue() );
				if ( currentMaterial.side !== side ) {

					currentMaterial.side = side;

				}

			}

			if ( currentMaterial.shading !== undefined ) {

				var shading = parseInt( materialShading.getValue() );
				if ( currentMaterial.shading !== shading ) {

					currentMaterial.shading = shading;

				}

			}

			if ( currentMaterial.blending !== undefined ) {

				var blending = parseInt( materialBlending.getValue() );
				if ( currentMaterial.blending !== blending ) {

					currentMaterial.blending = blending;

				}

			}

			if ( currentMaterial.opacity !== undefined && Math.abs( currentMaterial.opacity - materialOpacity.getValue() ) >= 0.01 ) {

				currentMaterial.opacity = materialOpacity.getValue();

			}

			if ( currentMaterial.transparent !== undefined && currentMaterial.transparent !== materialTransparent.getValue() ) {

				currentMaterial.transparent = materialTransparent.getValue();

			}

			if ( currentMaterial.alphaTest !== undefined && Math.abs( currentMaterial.alphaTest - materialAlphaTest.getValue() ) >= 0.01 ) {

				currentMaterial.alphaTest = materialAlphaTest.getValue();

			}

			if ( currentMaterial.wireframe !== undefined && currentMaterial.wireframe !== materialWireframe.getValue() ) {

				currentMaterial.wireframe = materialWireframe.getValue();

			}

			if ( currentMaterial.wireframeLinewidth !== undefined && Math.abs( currentMaterial.wireframeLinewidth - materialWireframeLinewidth.getValue() ) >= 0.01 ) {

				currentMaterial.wireframeLinewidth = materialWireframeLinewidth.getValue();

			}

			refreshUI();


		}

		if ( textureWarning ) {

			console.warn( "Can't set texture, model doesn't have texture coordinates" );

		}
				
	}

	function refreshUI()  {

		var material = currentMaterial;

		if ( material.uuid !== undefined ) {

			if( material.uuid !== null ){
				materialUUID.setValue( material.uuid );
			}

		}

		if ( material.name !== undefined) {

			materialName.setValue( material.name );

		}

		materialClass.setValue( material.type );

		if ( material.color !== undefined ) {

			materialColor.setHexValue( material.color.getHexString() );

		}

		if ( material.roughness !== undefined ) {

			materialRoughness.setValue( material.roughness );

		}

		if ( material.metalness !== undefined ) {

			materialMetalness.setValue( material.metalness );

		}

		if ( material.emissive !== undefined ) {

			materialEmissive.setHexValue( material.emissive.getHexString() );

		}

		if ( material.specular !== undefined ) {

			materialSpecular.setHexValue( material.specular.getHexString() );

		}

		if ( material.shininess !== undefined ) {

			materialShininess.setValue( material.shininess );

		}

		if ( material.clearCoat !== undefined ) {

			materialClearCoat.setValue( material.clearCoat );

		}

		if ( material.clearCoatRoughness !== undefined ) {

			materialClearCoatRoughness.setValue( material.clearCoatRoughness );

		}

		if ( material.vertexColors !== undefined ) {

			materialVertexColors.setValue( material.vertexColors );

		}

		if ( material.skinning !== undefined ) {

			materialSkinning.setValue( material.skinning );

		}

		if ( material.map !== undefined ) {

			materialMapEnabled.setValue( material.map !== null );

			if ( material.map !== null ) {

				materialMap.setValue( material.map );

			}

		}

		if ( material.alphaMap !== undefined ) {

			materialAlphaMapEnabled.setValue( material.alphaMap !== null );

			if ( material.alphaMap !== null ) {

				materialAlphaMap.setValue( material.alphaMap );

			}

		}

		if ( material.bumpMap !== undefined ) {

			materialBumpMapEnabled.setValue( material.bumpMap !== null );

			if ( material.bumpMap !== null ) {

				materialBumpMap.setValue( material.bumpMap );

			}

			materialBumpScale.setValue( material.bumpScale );

		}

		if ( material.normalMap !== undefined ) {

			materialNormalMapEnabled.setValue( material.normalMap !== null );

			if ( material.normalMap !== null ) {

				materialNormalMap.setValue( material.normalMap );

			}

		}

		if ( material.displacementMap !== undefined ) {

			materialDisplacementMapEnabled.setValue( material.displacementMap !== null );

			if ( material.displacementMap !== null ) {

				materialDisplacementMap.setValue( material.displacementMap );

			}

			materialDisplacementScale.setValue( material.displacementScale );

		}

		if ( material.roughnessMap !== undefined ) {

			materialRoughnessMapEnabled.setValue( material.roughnessMap !== null );

			if ( material.roughnessMap !== null ) {

				materialRoughnessMap.setValue( material.roughnessMap );

			}

		}

		if ( material.metalnessMap !== undefined ) {

			materialMetalnessMapEnabled.setValue( material.metalnessMap !== null );

			if ( material.metalnessMap !== null ) {

				materialMetalnessMap.setValue( material.metalnessMap );

			}

		}

		if ( material.specularMap !== undefined ) {

			materialSpecularMapEnabled.setValue( material.specularMap !== null );

			if ( material.specularMap !== null ) {

				materialSpecularMap.setValue( material.specularMap );

			}

		}

		if ( material.envMap !== undefined ) {

			materialEnvMapEnabled.setValue( material.envMap !== null );

			if ( material.envMap !== null ) {

				materialEnvMap.setValue( material.envMap );

			}

		}

		if ( material.reflectivity !== undefined ) {

			materialReflectivity.setValue( material.reflectivity );

		}

		if ( material.lightMap !== undefined ) {

			materialLightMapEnabled.setValue( material.lightMap !== null );

			if ( material.lightMap !== null ) {

				materialLightMap.setValue( material.lightMap );

			}

		}

		if ( material.aoMap !== undefined ) {

			materialAOMapEnabled.setValue( material.aoMap !== null );

			if ( material.aoMap !== null ) {

				materialAOMap.setValue( material.aoMap );

			}

			materialAOScale.setValue( material.aoMapIntensity );

		}

		if ( material.emissiveMap !== undefined ) {

			materialEmissiveMapEnabled.setValue( material.emissiveMap !== null );

			if ( material.emissiveMap !== null ) {

				materialEmissiveMap.setValue( material.emissiveMap );

			}

		}

		if ( material.side !== undefined ) {

			materialSide.setValue( material.side );

		}

		if ( material.shading !== undefined ) {

			materialShading.setValue( material.shading );

		}

		if ( material.blending !== undefined ) {

			materialBlending.setValue( material.blending );

		}

		if ( material.opacity !== undefined ) {

			materialOpacity.setValue( material.opacity );

		}

		if ( material.transparent !== undefined ) {

			materialTransparent.setValue( material.transparent );

		}

		if ( material.alphaTest !== undefined ) {

			materialAlphaTest.setValue( material.alphaTest );

		}

		if ( material.wireframe !== undefined ) {

			materialWireframe.setValue( material.wireframe );

		}

		if ( material.wireframeLinewidth !== undefined ) {

			materialWireframeLinewidth.setValue( material.wireframeLinewidth );

		}

		setRowVisibility();

	}

    function matBarFreshUI(){
    	currentMaterial = currentMat;
    	refreshUI();
    	currentMat = currentObject.material;
    }
    mySignals.matbarFreshUI.add(matBarFreshUI);
    
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

		for ( var property in properties ) {
			//若该属性不属于matarial，则不显示
			properties[ property ].setDisplay( currentMaterial[ property ] !== undefined ? '' : 'none' );

		}

	}

	return container;
}