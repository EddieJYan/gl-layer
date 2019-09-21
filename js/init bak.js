!function init() {
    function loadAllDAEs(urls, callback) {
        let sceneObjs = { meshes: {}, light: {} };
        function getFloorNum(str) {
            return str[0];
        }
        function loadHandler(result) {
            let keyName = result.scene.name;
            sceneObjs.meshes[keyName] = result.scene;
            sceneObjs.meshes[keyName].children.forEach(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
                else {
                    sceneObjs.meshes[keyName].remove(child);
                }
            });
            sceneObjs.meshes[keyName].position.set(0, 0, 0);
            sceneObjs.meshes[keyName].position.y = 10 * getFloorNum(keyName);
            loadListener.complateCount++;
        }
        var loader = new THREE.ColladaLoader();
        var loadListener = { "loadTotal": 0, "complateCount": 0 };
        for (url of urls) {
            loadListener.loadTotal++;
            loader.load(url, loadHandler);
        }
        let sk = setInterval(function () {
            if (loadListener.loadTotal === loadListener.complateCount) {
                clearInterval(sk);
                if (callback) {
                    callback(sceneObjs.meshes);
                }
            }
        }, 500);
        return sceneObjs;
    }
    var camera = initCamera(new THREE.Vector3(300, 300, 300));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    var loaderScene = new BaseLoaderScene(camera);
    loaderScene._addLights();
    var urls = ["./models/3wu.DAE", "./models/2wu.DAE", "./models/1wu.DAE"];
    var sceneGroup = loadAllDAEs(urls, function (meshes) {
        loaderScene.addMeshes(meshes);
    });
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(), INTERSECTED1, INTERSECTED2, INTERSECTED3;
    var controls;
    function initControls() {
        controls = new THREE.OrbitControls(camera, document.getElementById("webgl-output"));
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.minDistance = 100;
        controls.maxDistance = 300;
        controls.enablePan = true;
    }
    var stats;
    function initStats() {
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        loaderScene.reRender();
        loaderScene.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate() {
        controls.update();
        loaderScene.reRender();
        stats.update();
        requestAnimationFrame(animate);
    }
    function cameraIn() {
        if (camera.position.y <= 100) {
            return;
        }
        controls.zoomIn();
        console.info(11);
        requestAnimationFrame(cameraIn);
    }
    function cameraOut() {
        if (camera.position.y >= 170) {
            return;
        }
        controls.zoomOut();
        console.info(camera.position.y);
        requestAnimationFrame(cameraOut);
    }
    document.addEventListener("mousedown", function () {
        if (event.button == "2") {
            cameraOut();
        }
        else {
            cameraIn();
        }
    });
    initControls();
    initStats();
    animate();
    window.onresize = onWindowResize;
}();
//# sourceMappingURL=init.js.map