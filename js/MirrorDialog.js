var Dialog = function( editor ){

	var url1,url2;

	function TexChange(){

		console.log(normalTex)

		if(normalTex.texture.image !== undefined){

			if(normalTex.texture.image.currentSrc != null){
				url1 = normalTex.texture.image.currentSrc
			}

			
		}

		if(diffuseTex.texture.image !== undefined || diffuseTex.texture.image !== null){

			if(diffuseTex.texture.image.currentSrc != null){
				url2 = diffuseTex.texture.image.currentSrc
			}

		}

		if( url1 && url2){

			dialog.setDisplay('none');

			editor.signals.NDTexture.dispatch(url1,url2);
		}

	}

	var container = new UI.Panel();//DIV
	var NDTextureRow = new UI.Row();
	NDTextureRow.add( new UI.Text( ' 请选择自定义纹理贴图，在路径\'image/decal/\'下' ).setWidth( '350px' ) );
	NDTextureRow.add( new UI.Text( ' normal------------diffuse' ).setWidth( '350px' ) );
	container.add(NDTextureRow);

	var imageRow = new UI.Row().setTop('30px');

	var normalTex = new UI.Texture().onChange(TexChange);
	var diffuseTex = new UI.Texture().onChange(TexChange).setMarginLeft('10px');
	imageRow.add( normalTex );
	imageRow.add( diffuseTex );

	container.add( imageRow );

	var quit = new UI.Button( 'quit' ).setMarginLeft( '100px' ).setTop('8px').onClick( function () {

		dialog.setDisplay('none')

	} );
	container.add(quit);

	return container;

		}

		