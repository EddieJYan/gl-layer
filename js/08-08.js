function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(-35, 35, 35));
  var loaderScene = new BaseLoaderScene(camera);
  //loaderScene._addLights()



  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2(), INTERSECTED1, INTERSECTED2, INTERSECTED3;
  var sceneGroup = {};
  // load the model
  var loader = new THREE.ColladaLoader();


  loader.load("./models/1wu.DAE", function (result) {
    sceneGroup = result.scene;
    sceneGroup.children.forEach(function (child) {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      } else {
        // remove any lighting sources from the model
        sceneGroup.remove(child);
      }
    });

	sceneGroup.position.set(3, 0, 4); // (红x, 绿y, 蓝z)
    sceneGroup.scale.set(0.0005, 0.0005, 0.0005);
    setTimeout(() => {
        // sceneGroup.add(ball);
        //text();
        // var mesh = sceneGroup.children[0].children[1].children[31];
        // sceneGroup.children[0].children[1].children.forEach(item => {
        //     if (item.type === 'Mesh' && item.name !== mesh.name) {
        //         item.material.visible = true;
        //     }
        // });
        // mesh.material.visible = false;
        // var a = sceneGroup.children[0].children[1].children.every(item => {
        //     return item.type === 'Mesh' ? item.material.visible : true
        // });
        // console.log(a, 'a');
    }, 100);
    // call the default render loop.
    loaderScene.render(sceneGroup, camera);
  });

  

  


    document.addEventListener( 'mousemove', onDocumentMouseMove);
    // animate();
    function onDocumentMouseMove( event ) {
        event.preventDefault();
        // console.log(event, 'event');

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        // console.log(sceneGroup, 'sceneGroup');
        //text();
        var intersects = raycaster.intersectObjects( sceneGroup.children );
        // console.log(sceneGroup.children[0].children[1].children, 'aaa');
        console.log(intersects, 'intersects');
        if ( intersects.length > 0 ) {

            if ( INTERSECTED1 !== sceneGroup.children[7].children[2].children[0].children[41]  ) {

                if ( INTERSECTED1 && INTERSECTED1.material.emissive ) {
                    // console.log(INTERSECTED.material.emissive, 'bbb');
                    // console.log(intersects, INTERSECTED1, 'INTERSECTED1');
                    INTERSECTED1.material.emissive.setHex(INTERSECTED1.currentHex);
                    INTERSECTED2.material.emissive.setHex(INTERSECTED2.currentHex);
                    INTERSECTED3.material.emissive.setHex(INTERSECTED3.currentHex);
                }

                // INTERSECTED = intersects[ 0 ].object;
                INTERSECTED1 = sceneGroup.children[7].children[2].children[0].children[41] ;
                INTERSECTED2 = sceneGroup.children[7].children[2].children[0].children[12] ;
                INTERSECTED3 = sceneGroup.children[7].children[2].children[0].children[21] ;
                if ( INTERSECTED1 && INTERSECTED1.material.emissive ) {
                    console.log(INTERSECTED1.material.emissive.getHex(), 'getHex();');
                    INTERSECTED1.currentHex = INTERSECTED1.material.emissive.getHex();
                    INTERSECTED1.material.emissive.setHex( 0x00BFFF );
                    console.log(INTERSECTED1.material.emissive.getHex(), 'getHex();222');
                    INTERSECTED2.currentHex = INTERSECTED2.material.emissive.getHex();
                    INTERSECTED2.material.emissive.setHex( 0x00BFFF );
                    INTERSECTED3.currentHex = INTERSECTED3.material.emissive.getHex();
                    INTERSECTED3.material.emissive.setHex( 0x00BFFF );
                }

            }

        } else {

            if ( INTERSECTED1 && INTERSECTED1.material.emissive ) {
                console.log(INTERSECTED1.currentHex, 'currentHex');
                INTERSECTED1.material.emissive.setHex( 0 );
                INTERSECTED2.material.emissive.setHex( 0 );
                INTERSECTED3.material.emissive.setHex( 0 );
            }

            INTERSECTED1 = null;
            INTERSECTED2 = null;
            INTERSECTED3 = null;

        }
    }
    function animate() {

        requestAnimationFrame( animate );

        render();
        // stats.update();

    }
    function render() {
        // raycaster.setFromCamera( mouse, camera );
        //
        // var intersects = raycaster.intersectObjects( sceneGroup.children[0].children[1].children );
        // if ( intersects.length > 0 ) {
        //
        //     if ( INTERSECTED !== intersects[ 0 ].object ) {
        //
        //         if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        //
        //         INTERSECTED = intersects[ 0 ].object;
        //         INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        //         INTERSECTED.material.emissive.setHex( 0xff0000 );
        //
        //     }
        //
        // } else {
        //
        //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        //
        //     INTERSECTED = null;
        //
        // }
    }
    function text() {
        var pyramidBox = sceneGroup.children[7].children[2].children[0].children[14] ;

        var halfWidth = window.innerWidth / 2;
        var halfHeight = window.innerHeight / 2;

        var worldVector = new THREE.Vector3(
            pyramidBox.position.x / 2000, // 模型比例尺为1:2000，所以坐标要除以2000
            pyramidBox.position.y / 2000 / 2,
            pyramidBox.position.z / 2000
        );
        // 逆转相机求出二维坐标，世界坐标转标准设备坐标
        var vector = worldVector.project(camera);

        // 修改 div 的位置
        var style = 'translate(-50%,-50%) translate('
            + ( vector.x * halfWidth + halfWidth ) + 'px,' + ( - vector.y * halfHeight + halfHeight ) + 'px)';

        document.getElementById('label').style.WebkitTransform = style;
        document.getElementById('label').style.MozTransform = style;
        document.getElementById('label').style.oTransform = style;
        document.getElementById('label').style.transform = style;
        // 显示模型信息
        document.getElementById('label').innerText = "name:" + pyramidBox.name;
    }
}
init();