/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	container.add( new Viewport.Info( editor ) );

	//

	var renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	// SSAO  相关
	var depthMaterial, depthRenderTarget;
	var effectComposer = null;

	// SAO 相关 

	function initSSAOPostprocessing() {

		var ssaoPass;

		// Setup render pass
		var renderPass = new THREE.RenderPass( scene, camera );

		// Setup depth pass
		depthMaterial = new THREE.MeshDepthMaterial();
		depthMaterial.depthPacking = THREE.RGBADepthPacking;
		depthMaterial.blending = THREE.NoBlending;

		var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
		depthRenderTarget = new THREE.WebGLRenderTarget( container.dom.offsetWidth, container.dom.offsetHeight, pars );
		depthRenderTarget.texture.name = "SSAOShader.rt";
		//console.log(depthRenderTarget.texture)

		// Setup SSAO pass
		ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
		ssaoPass.renderToScreen = true;
		//ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
		ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
		ssaoPass.uniforms[ 'size' ].value.set( container.dom.offsetWidth, container.dom.offsetHeight );
		ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
		ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
		ssaoPass.uniforms[ 'onlyAO' ].value = false;
		ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
		ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;

		// Add pass to effect composer
		
		effectComposer = new THREE.EffectComposer( renderer );
		effectComposer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		effectComposer.addPass( renderPass );
		effectComposer.addPass( ssaoPass );

		render();

		}

		signals.SSAOpostprocessing.add(initSSAOPostprocessing);

	function initSAOPostprocessing(){

		var renderPass, saoPass;
		var supportsDepthTextureExtension = false;
		var isWebGL2 = false;
		var params = {
				output: 0,
				saoBias: 0.5,
				saoIntensity: 0.25,
				saoScale: 1,
				saoKernelRadius: 100,
				saoMinResolution: 0,
				saoBlur: true,
				saoBlurRadius: 12,
				saoBlurStdDev: 6,
				saoBlurDepthCutoff: 0.01
			}

		effectComposer = new THREE.EffectComposer( renderer );
		effectComposer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		var renderPass = new THREE.RenderPass( scene, camera );
		effectComposer.addPass( renderPass );
		saoPass = new THREE.SAOPass(scene, camera, false, true);
		saoPass.renderToScreen = true;
		effectComposer.addPass( saoPass );

		render();

	}

	signals.SAOpostprocessing.add(initSAOPostprocessing);

	function initSMAAPostprocessing(){

		effectComposer = new THREE.EffectComposer( renderer );
		effectComposer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		effectComposer.addPass( new THREE.RenderPass( scene, camera ) );

		pass = new THREE.SMAAPass( container.dom.offsetWidth, container.dom.offsetHeight  );
		pass.renderToScreen = true;
		effectComposer.addPass( pass );

		render();

	}

	signals.SMAApostprocessing.add(initSMAAPostprocessing);

	function initBLOOMPostprocessing( ){

		var effectFXAA, bloomPass, renderPass;
		var params = {
				projection: 'normal',
				background: false,
				exposure: 1.0,
				bloomStrength: 1.5,
				bloomThreshold: 0.85,
				bloomRadius: 0.4
			};

		renderer.toneMapping = THREE.LinearToneMapping;
		renderer.shadowMap.enabled = true;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		var copyShader = new THREE.ShaderPass(THREE.CopyShader);
		copyShader.renderToScreen = true;

		bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(container.dom.offsetWidth, container.dom.offsetHeight), 1.5, 0.4, 0.85);//1.0, 9, 0.5, 512);
		renderPass = new THREE.RenderPass(scene, camera);
		effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / container.dom.offsetWidth, 1 / container.dom.offsetHeight  );
		effectComposer = new THREE.EffectComposer(renderer);
		effectComposer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		effectComposer.addPass(renderPass);
		effectComposer.addPass(effectFXAA);
		effectComposer.addPass(bloomPass);
		effectComposer.addPass(copyShader);

		render();

	}

	signals.BLOOMpostprocessing.add(initBLOOMPostprocessing);


	//物理引擎相关
	
	var clock = new THREE.Clock();

	// 物理引擎相关变量
	
    var gravityConstant = -9.8;
    var collisionConfiguration;
    var dispatcher;
    var broadphase;
    var solver;
    var physicsWorld;
    var rigidBodies = [];
    var margin = 0.05;
    var transformAux1 = new Ammo.btTransform();

    // 高度场相关
    var terrainWidthExtents = 100;
    var terrainDepthExtents = 100;
    var terrainWidth = 128;
    var terrainDepth = 128;
    var terrainHalfWidth = terrainWidth / 2;
    var terrainHalfDepth = terrainDepth / 2;
    var terrainMaxHeight = 8;
    var terrainMinHeight = -2;

    var heightData = null;
    var ammoHeightData = null;

    var maxNumObjectss = 30;

    function initPhysics() {
        // bullet基本场景配置
        collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        broadphase = new Ammo.btDbvtBroadphase();
        solver = new Ammo.btSequentialImpulseConstraintSolver();
        physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
        physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
    }

    function updatePhysics(deltaTime) {

        physicsWorld.stepSimulation(deltaTime);

        // 更新物体位置
        for (var i = 0, iL = rigidBodies.length; i <iL; i++ ){
            var objThree = rigidBodies[i];
            var objPhys = objThree.userData.physicsBody;
            var ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(transformAux1);
                var p = transformAux1.getOrigin();
                var q = transformAux1.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

    // 生成连续起伏(利用正弦函数)
    function generateHeight( width, depth, minHeight, maxHeight ) {
        // 使用正弦函数生成凹凸不平的场(sinus wave)
        var size = width * depth;
        var data = new Float32Array(size);

        var hRange = maxHeight - minHeight;
        var w2 = width / 2;
        var d2 = depth / 2;
        var phaseMult = 12;

        var p = 0;
        for (var  i = 0; i < depth; i++) {
            for (var j = 0; j < width; j++) {
                var radius = Math.sqrt(
                        Math.pow((j - w2)/w2, 2.0) +
                        Math.pow((i - d2)/d2, 2.0)
                );

//                var height = (Math.sin(radius * phaseMult) + 1) * 0.5 * hRange + minHeight;
                var height = ( Math.sin( radius * phaseMult ) + 1 ) * 0.5 * hRange + minHeight;

                data[p] = height;

                p++;
            }
        }

        return data;
    }

       // 生成物理引擎用高度场
    function createTerrainShape(heightData) {

        // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
        var heightScale = 1;

        // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
        var upAxis = 1;

        // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
        var hdt = "PHY_FLOAT";

        // Set this to your needs (inverts the triangles)
        var flipQuadEdges = false;

        // Creates height data buffer in Ammo heap
        ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);

        // Copy the javascript height data array to the Ammo one.
        var p = 0;
        var p2 = 0;
        for ( var j = 0; j < terrainDepth; j++ ) {
            for ( var i = 0; i < terrainWidth; i++ ) {

                // write 32-bit float data to memory
                Ammo.HEAPF32[ ammoHeightData + p2 >> 2 ] = heightData[ p ];

                p++;

                // 4 bytes/float
                p2 += 4;
            }
        }

        // Creates the heightfield physics shape
        var heightFieldShape = new Ammo.btHeightfieldTerrainShape(
                terrainWidth,
                terrainDepth,
                ammoHeightData,
                heightScale,
                terrainMinHeight,
                terrainMaxHeight,
                upAxis,
                hdt,
                flipQuadEdges
        );

        // Set horizontal scale
        var scaleX = terrainWidthExtents / ( terrainWidth - 1 );
        var scaleZ = terrainDepthExtents / ( terrainDepth - 1 );
        heightFieldShape.setLocalScaling( new Ammo.btVector3( scaleX, 1, scaleZ ) );

        heightFieldShape.setMargin( 0.05 );

        return heightFieldShape;

    }

    function createRigidBody(threeObject, physicsShape, mass, pos, quat,x) {
        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        var localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        if(x==1)
        	scene.add(threeObject);

        if (mass > 0) {
            rigidBodies.push(threeObject);

            // Disable deactivation
            // 防止物体弹力过快消失

            // Ammo.DISABLE_DEACTIVATION = 4
            body.setActivationState(4);
        }

        physicsWorld.addRigidBody(body);

        return body;
    }

     function initInput() {

     	// 鼠标输入相关
	    var mouseCoords = new THREE.Vector2();
	    var raycaster = new THREE.Raycaster();
	    var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );

        window.addEventListener( 'mousedown', function( event ) {

            mouseCoords.set(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1
            );

            raycaster.setFromCamera( mouseCoords, camera );

            // Creates a ball and throws it
            var ballMass = 35;
            var ballRadius = 0.4;

            var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 14, 10 ), ballMaterial );
            ball.castShadow = true;
            ball.receiveShadow = true;
            var ballShape = new Ammo.btSphereShape( ballRadius );
            ballShape.setMargin( margin );
            var pos = new THREE.Vector3();
            var quat = new THREE.Quaternion();
            pos.copy( raycaster.ray.direction );
            pos.add( raycaster.ray.origin );
            quat.set( 0, 0, 0, 1 );
            var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat , 1);

            pos.copy( raycaster.ray.direction );
            pos.multiplyScalar( 24 );
            ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );

        }, false );

    }

    function initPhysicsScene(){

    	initPhysics();

    	var pos = new THREE.Vector3();
        var quat = new THREE.Quaternion();
        quat.set(0, 0, 0, 1);
        heightData = generateHeight(terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight);
        var shape = null;
        var mass = 5; // 体积越大质量越大

    	scene.traverse( function ( sceneChild ) {

            if(sceneChild.type == 'Mesh'){
            	if(sceneChild.geometry.type == 'PlaneBufferGeometry'){
            		sceneChild.receiveShadow = true;
            		sceneChild.castShadow = true;

            		var vertices = sceneChild.geometry.attributes.position.array;
            		heightData = generateHeight(127, 127, -1, 1);
            		for ( var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 ) {
				            // j + 1 because it is the y component that we modify
				            vertices[ j + 1 ] = heightData[ i ];

				        }

				    sceneChild.geometry.computeVertexNormals();
				    // 物理计算用
			        var groundShape = createTerrainShape(heightData);
			        var groundTransform = new Ammo.btTransform();
			        groundTransform.setIdentity();
			        // 设置bullet计算时物体中心
			        groundTransform.setOrigin(new Ammo.btVector3( 0, ( terrainMaxHeight + terrainMinHeight ) / 2, 0 ));
			        var groundMass = 0;
			        var groundLocalInertia = new Ammo.btVector3( 0, 0, 0 );
			        var groundMotionState = new Ammo.btDefaultMotionState( groundTransform );
			        var groundBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, groundShape, groundLocalInertia));
			        physicsWorld.addRigidBody(groundBody);

            	}

                else if(sceneChild.geometry.type == 'BoxBufferGeometry'){
                    shape = new Ammo.btBoxShape( new Ammo.btVector3( sceneChild.width * 0.5, sceneChild.height * 0.5, sceneChild.depth * 0.5 ) );
                	shape.setMargin( margin );
                }

                else if(sceneChild.geometry.type == 'SphereBufferGeometry'){
                	shape = new Ammo.btSphereShape( sceneChild.radius );
                	shape.setMargin( margin );
                }
                else if(sceneChild.geometry.type == 'CylinderBufferGeometry' && sceneChild.radiusTop == sceneChild.radiusBottom){
                	shape = new Ammo.btCylinderShape( new Ammo.btVector3( sceneChild.radiusTop, sceneChild.height * 0.5, sceneChild.radius ) );
                	shape.setMargin(margin);
                }

                else if(sceneChild.geometry.type == 'CylinderBufferGeometry' && sceneChild.radiusTop == 0){
                	shape = new Ammo.btConeShape( sceneChild.radiusBottom, sceneChild.height );
                	shape.setMargin(margin);
                }
                else{

                }

                pos = sceneChild.position;
        		createRigidBody(sceneChild, shape, mass, pos, quat,0);
            }

        } );

        initInput();

    }

    signals.enablePhysics.add(initPhysicsScene);

	var objects = [];


	var vrEffect, vrControls;

	if ( WEBVR.isAvailable() === true ) {

		var vrCamera = new THREE.PerspectiveCamera();
		vrCamera.projectionMatrix = camera.projectionMatrix;
		camera.add( vrCamera );

	}

	// helpers

	var grid = new THREE.GridHelper( 60, 60 );
	sceneHelpers.add( grid );

	//

	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	//对 viewport 中的object的移动 旋转 缩放
	var transformControls = new THREE.TransformControls( camera, container.dom );//创建动画和移动相机，绑定到camera，指向container场景所在的元素
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

			if ( editor.helpers[ object.id ] !== undefined ) {

				editor.helpers[ object.id ].update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {

						editor.execute( new SetPositionCommand( object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {

						editor.execute( new SetRotationCommand( object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {

						editor.execute( new SetScaleCommand( object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );

	// object picking
	//Three.js提供一个射线类Raycaster来拾取场景里面的物体。更方便的使用鼠标来操作3D场景。
	//从某个方向发射一条射线，穿过鼠标所在的点，则这条射线经过的对象就是鼠标点击的对象
	//射线法获取鼠标选择的元素，然后修元素的材质。
	var raycaster = new THREE.Raycaster();
	//raycaster : http://blog.csdn.net/u014658748/article/details/51074840
	//mouse，鼠标所对应的二维向量,监听鼠标移动事件
	//mouse.x是指 鼠标的x到屏幕y轴的距离与屏幕宽的一半的比值 绝对值不超过1
    //mouse.y是指 鼠标的y到屏幕x轴的距离与屏幕宽的一半的比值 绝对值不超过1
    //下面的矩形是显示器屏幕，三维空间坐标系的布局以及屏幕的二维坐标系
                //
                // 鼠标是从  二维坐标系
                // 这个点 .-------------------------------------------|-->鼠标x正半轴
                //  开始算|                    | y     /              |
                //   x,y  |                    |     /                |
                //        |                    |   /                  |
                //        |          三维坐标系| /                    |
                //        | -------------------/-------------------->x|
                //        |                  / |                      |
                //        |                /   |                      |
                //        |              /     |                      |
                //        |__________Z_/_______|______________________|
                //        |
                // 鼠标y  \/
                // 正半轴
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {
		//将html坐标系转化为webgl坐标系，并确定鼠标点击位置
		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
		 //从相机发射一条射线，经过鼠标点击位置
		raycaster.setFromCamera( mouse, camera );
		//camera 到 mouse 之间穿过的物体
		//确定所点击位置上的物体数量
		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {//dom = container.dom, x = event.clientX,  y = event.clientY

		var rect = dom.getBoundingClientRect();//getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) { // 鼠标 down 到 up之间的 move 长度不为 0 时

			var intersects = getIntersects( onUpPosition, objects );
			// 拾取物体数大于0时  
			if ( intersects.length > 0 ) {
				//获取第一个物体 
				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );// 选中该 object

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );//document指的是整个html

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}
	function onDoubleClick( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );

		}

	}

function dragMatFun(){
	if( dragMatFlag == true ){

			var xonUpPosition = new THREE.Vector2();
			var xarray = getMousePosition( container.dom, dragMatPoint.x, dragMatPoint.y );
			xonUpPosition.fromArray( xarray );

			var xraycaster = new THREE.Raycaster();

			var xmouse = new THREE.Vector2();
			xmouse.set( ( xonUpPosition.x * 2 ) - 1, - ( xonUpPosition.y * 2 ) + 1 );

			xraycaster.setFromCamera( xmouse, camera );

			var xintersects = xraycaster.intersectObjects( scene.children );
			//将dragMat设置为null ，防止在viewport中click就直接应用而不是拖动应用
			if ( xintersects.length > 0 && dragMat != null) {

				console.log( '确定object' );
				console.log( xintersects[0].object );
				var x = dragMat.toJSON();
                //console.log(x)
                var y = parseMaterial(x);
				//可 ctrl+z 多次撤销操作
				y.uuid = xintersects[0].object.material.uuid;
				editor.execute( new SetMaterialCommand( xintersects[0].object, y ), 'Pasted Material: ' + y.type );
				render();
				dragMat = null;
				dragMatFlag = false;
				mySignals.sidebarFreshUI.dispatch();
			}
		}
}

	mySignals.dragMatFlag.add(dragMatFun);

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );

	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new THREE.EditorControls( camera, container.dom );
	controls.addEventListener( 'change', function () {

		transformControls.update();
		signals.cameraChanged.dispatch( camera );

	} );

	// signals

	signals.editorCleared.add( function () {

		controls.center.set( 0, 0, 0 );
		render();

	} );

	signals.enterVR.add( function () {

		vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();

	} );

	signals.themeChanged.add( function ( value ) {

		switch ( value ) {

			case 'css/light.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0x444444, 0x888888 );
				sceneHelpers.add( grid );
				break;
			case 'css/dark.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0xbbbbbb, 0x888888 );
				sceneHelpers.add( grid );
				break;

		}

		render();

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererChanged.add( function ( newRenderer ) {

		if ( renderer !== null ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;

		renderer.autoClear = false;
		renderer.setClearAlpha(0);
		renderer.setClearColor(0xFFFFFF, 0.0);
		renderer.autoUpdateScene = false;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		if ( WEBVR.isAvailable() === true ) {

			vrControls = new THREE.VRControls( vrCamera );
			vrEffect = new THREE.VREffect( renderer );

			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

				effect.isPresenting ? signals.enteredVR.dispatch() : signals.exitedVR.dispatch();

			}, false );

		}

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null && object !== scene && object !== camera ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {

				selectionBox.setFromObject( object );
				selectionBox.visible = true;

			}

			transformControls.attach( object );

		}

		render();

	} );

	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.setFromObject( object );
			transformControls.update();

		}

		if ( object instanceof THREE.PerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.RenderEverywhere.add( function (){

		render();
		
	})

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	// fog

	signals.sceneBackgroundChanged.add( function ( backgroundColor ) {

		scene.background = new THREE.Color();

		scene.background.setHex( backgroundColor );

		render();

	} );

	signals.sceneBackgroundImageChanged.add( function ( backgroundImage ) {

		//document.getElementById("viewport").style.backgroundImage = 'url(\'image\/SkyBox\/g.jpg\')';
		scene.background = null;
		document.getElementById("viewport").style.backgroundImage = "url("+backgroundImage.image.currentSrc+")";
		document.getElementById("viewport").style.backgroundSize = '100% 100%';
		
		render();

	} );

	signals.sceneSkyBoxImageChanged.add( function ( urls ) {

		var textureCube = new THREE.CubeTextureLoader().load( urls );
        textureCube.format = THREE.RGBFormat;

		scene.background = textureCube;

		render();

	} );

	var currentFogType = null;

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		if ( currentFogType !== fogType ) {

			switch ( fogType ) {

				case 'None':
					scene.fog = null;
					break;
				case 'Fog':
					scene.fog = new THREE.Fog();
					break;
				case 'FogExp2':
					scene.fog = new THREE.FogExp2();
					break;

			}

			currentFogType = fogType;

		}

		if ( scene.fog instanceof THREE.Fog ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.near = fogNear;
			scene.fog.far = fogFar;

		} else if ( scene.fog instanceof THREE.FogExp2 ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.density = fogDensity;

		}

		render();

	} );

	//

	signals.windowResize.add( function () {

		// TODO: Move this out?

		editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		editor.DEFAULT_CAMERA.updateProjectionMatrix();

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		if(effectComposer != null){

			effectComposer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		}

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );

	signals.Postprocess.add(function (){
		render();
	})

	//

	function animate() {

		requestAnimationFrame( animate );

		/*

		// animations

		if ( THREE.AnimationHandler.animations.length > 0 ) {

			THREE.AnimationHandler.update( 0.016 );

			for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {

				var helper = sceneHelpers.children[ i ];

				if ( helper instanceof THREE.SkeletonHelper ) {

					helper.update();

				}

			}

		}
		*/

		if ( vrEffect && vrEffect.isPresenting ) {

			render();

		}

	}

	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();
		//通道不能放在render里面
		if( editor.SSAOpostprocessing == true){

			//initSSAOPostprocessing();
			// Render depth into depthRenderTarget
			scene.overrideMaterial = depthMaterial;//如果不为空，它将迫使在场景中的一切对象都使用该材料进行渲染。默认为空（null）。
			renderer.render( scene, camera, depthRenderTarget, true );

			// Render renderPass and SSAO shaderPass
			scene.overrideMaterial = null;
			effectComposer.render();
			effectComposer.render( sceneHelpers, camera );

			return;

		}

		if(editor.SAOpostprocessing == true){

			//initSAOPostprocessing();
			effectComposer.render();
			effectComposer.render( sceneHelpers, camera );

			return;
		}

		if(editor.BLOOMpostprocessing == true){

			//initBLOOMPostprocessing();
			effectComposer.render();
			effectComposer.render( sceneHelpers, camera );

			return;
		}

		if(editor.SMAApostprocessing == true){

			//initSMAAPostprocessing();
			effectComposer.render();
			effectComposer.render( sceneHelpers, camera );

			return;
		}

		if(editor.enablePhysics == true){

			var deltaTime = clock.getDelta();

	        updatePhysics(deltaTime);

	        //controls.update(deltaTime);

	        renderer.render(scene, camera);

	        //time += deltaTime;

		}


		if ( vrEffect && vrEffect.isPresenting ) {

			vrControls.update();

			camera.updateMatrixWorld();

			vrEffect.render( scene, vrCamera );
			vrEffect.render( sceneHelpers, vrCamera );

		} else {

			renderer.render( scene, camera );

			if ( renderer instanceof THREE.RaytracingRenderer === false ) {

				renderer.render( sceneHelpers, camera );

			}

		}



	}

	requestAnimationFrame( animate );

	return container;

};
