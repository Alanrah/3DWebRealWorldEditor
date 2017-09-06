var Dialog = function( editor ){

	var path = "image/decal/";

	function TexChange(){

		if(normalTex.imageload!=null){

			var url1 = path + normalTex.imageload.sourceFile;
		}

		if(diffuseTex.imageload != null){

			var url2 = path + diffuseTex.imageload.sourceFile;
		}

		if( url1 && url2){

			dialog.setDisplay('none');

			editor.signals.NDTexture.dispatch(url1,url2);
		}

	}

	var container = new UI.Panel();//DIV
	var NDTextureRow = new UI.Row();
	NDTextureRow.add( new UI.Text( ' 请选择自定义纹理贴图，在路径\'image/decal/\'下' ).setWidth( '350px' ) );
	NDTextureRow.add( new UI.Text( ' normal , diffuse' ).setWidth( '350px' ) );
	container.add(NDTextureRow);

	var imageRow = new UI.Row();

	var normalTex = new UI.ImageLoad().onChange(TexChange);
	var diffuseTex = new UI.ImageLoad().onChange(TexChange).setMarginTop('5px');
	imageRow.add( normalTex );
	imageRow.add( diffuseTex );

	container.add( imageRow );

	return container;

		}

		