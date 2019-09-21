

{
 
    function init(): SceneMaster {

        //物体地址
        var urls = ["./models/bigborder.dae"];
        //场景初始化 包含读取所有模型loadAllDAEs 初始摄像机位置
        var loaderScene = getSceneMaster();
        loaderScene.loadMesh(urls, function () {

        });        
        return loaderScene;
    };


    //全局控制对象
    var Cb: SceneMaster = init();
    console.log(Cb.scene)
    Cb.initControl(100, 200); //最大200，最佳等同于摄像机
    Cb.controls.autoRotateSpeed = 0.5;
    Cb.controls.zoomSpeed = 0.3;
    Cb.controls.enablePan = false;
    Cb.controls.enabled = false;
    Cb.addLights();
    Cb.cameraAutoRotate(true);
    Cb.onclick(function (objGroup: Array<RaycasterObj>, mouse: KeyVal) {
        if (objGroup.length > 0) {
            let selName = objGroup[0].object.name;
            let objName = selName.split("_")[0];

            let GType = glApi.isType(objGroup[0].object);

            switch (GType.toUpperCase()) {
                case METH_GROUP_NAME.MONITOR: glApi.setGroupEmissive(glApi.getGroupByName(Cb.scene, objName), 0x00BFFF); glApi.postMsg(POST_NAME.CLICK, objName); break;
            }
        }
    })


    function cameraIn() {
        if (Cb.cameras.currentCamera.position.y <= 80) {
            return true;
        }

        Cb.scene.position.y -= 1;
        Cb.cameraIn();
        //Cb.cameras.currentCamera.fov-=1

        requestAnimationFrame(cameraIn);
    }

    function cameraOut() {
        if (Cb.cameras.currentCamera.position.y >= 100) {
            return true;
        }
        Cb.scene.position.y += 1;
        Cb.cameraOut();

        requestAnimationFrame(cameraOut);
    }

    function animate() {
        //更新控制器 
        Cb.controls.update();

        //更新性能插件 
        //stats.update();
        requestAnimationFrame(animate);
        Cb.reRender();
    }

    animate()



    //返回总控制台
    function getSceneMaster(): SceneMaster {
        // function initStats() {
        //     stats = new Stats();
        //     document.body.appendChild(stats.dom);
        // }

        //镭射范围 多用于摄像头旋转
        let raycaster = new THREE.Raycaster();
        //2D鼠标定位
        let mouse = new THREE.Vector2();

        let cameraV3: THREE.PerspectiveCamera;
        //"webgl-output" 摄像头应该去这个宽高
        cameraV3 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraV3.position.copy(new THREE.Vector3(100, 100, 100));
        cameraV3.lookAt(new THREE.Vector3(0, 0, 0));


        THREE.DefaultLoadingManager.onLoad = function () {
            glApi.postMsg(POST_NAME.READY);
            Cb.isLoadEnd = true;
        };        

        /**
           * @param {Array<string>} urls 
           * @return {sceneObjs} {meshes:{},light:{}}
           */
        function loadAllDAEs(urls: Array<string>, callback: Function): SceneObjs {

            let sceneObjs: SceneObjs = { meshes: {}, lights: {} };

            //返回楼层号
            function getFloorNum(str: string): number {
                return parseInt(str[0]);
            }

            //模型加载
            function loadHandler(result: OrbigResult) {

                let keyName: string = result.scene.name;
                sceneObjs.meshes[keyName] = result.scene;

                sceneObjs.meshes[keyName].children.forEach(function (child: THREE.Mesh) {
                    if (child instanceof THREE.Mesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    } else {
                        // remove any lighting sources from the model
                        sceneObjs.meshes[keyName].remove(child);
                    }
                });

                sceneObjs.meshes[keyName].position.set(0, 0, 0); // (红x, 绿y, 蓝z)   


                sceneObjs.meshes[keyName].position.y = 10 * getFloorNum(keyName);
                loadListener.complateCount++;
            }


            //返回封装好得模型加载器
            var loader = new THREE.ColladaLoader();
            var loadListener = { "loadTotal": 0, "complateCount": 0 };
            let url: string;
            for (url of urls) {
                //动态KEY赋值
                loadListener.loadTotal++;
                loader.load(url, loadHandler);
            }

            let sk = setInterval(function () {
                if (loadListener.loadTotal === loadListener.complateCount) {
                    clearInterval(sk);
                    if (callback) {
                        callback(sceneObjs.meshes)
                    }
                }
            }, 500)

            return sceneObjs;
        }


        return {
            isLoadEnd: false,
            state: new Stats(),
            cameras: {
                currentCamera: cameraV3
            },
            controls: null, //基于OrbitControls轨道系统
            scene: new THREE.Scene(),

            // initialize basic renderer The initRenderer from util.js
            renderer: initRenderer({
                antialias: true, alpha: true
            }),

            //public method
            loadMesh: function (urls: Array<string>, callback?: Function) {
                loadAllDAEs(urls, (meshes: KeyVal) => {
                    this.addMeshes(meshes);
                    if (callback) {
                        callback(meshes);
                    }
                })
            },
            initControl: function (min: number, max: number): void {

                //用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放 
                this.controls = new THREE.OrbitControls(cameraV3, document.getElementById("webgl-output"));
                //动画启动时不用此方法
                //controls.addEventListener( 'change', render ); 
                this.controls.minDistance = min;
                this.controls.maxDistance = max;
                // 使动画循环使用时阻尼或自转 意思是否有惯性 
                this.controls.enableDamping = true;

                //动态阻尼系数 就是鼠标拖拽旋转灵敏度 
                //controls.dampingFactor = 0.25; 

                this.controls.autoRotate = false;
                //是否可以缩放 
                this.controls.enableZoom = true;

                //是否开启右键拖拽 
                this.controls.enablePan = true;
            },
            addMeshes: async function (meshes) {
                let keyName: string;
                for (keyName in meshes) {
                    await this.scene.add(meshes[keyName]);
                }
                this.reRender();
            },
            reRender: function () {
                this.renderer.render(this.scene, this.cameras.currentCamera);

            },

            cameraAutoRotate: function (autoRotate: Boolean): void {
                this.controls.autoRotate = autoRotate;
            },

            cameraDistance: function (min: Number, max: Number): void {
                this.controls.minDistance = min;
                this.controls.maxDistance = max;
            },
            /**
             * Internal function, which adds a number of lights to the scene.
             */
            addLights: function () {
                var keyLight = new THREE.SpotLight(0xffffff);
                keyLight.position.set(0, 80, 80);
                keyLight.intensity = 4;
                keyLight.lookAt(new THREE.Vector3(0, 15, 0));
                keyLight.castShadow = true;
                keyLight.shadow.mapSize.height = 4096;
                keyLight.shadow.mapSize.width = 4096;
                this.scene.add(keyLight);

                var backlight1 = new THREE.SpotLight(0xaaaaaa);
                backlight1.position.set(150, 40, -20);
                backlight1.intensity = 0.5;
                backlight1.lookAt(new THREE.Vector3(0, 15, 0));
                this.scene.add(backlight1);

                var backlight2 = new THREE.SpotLight(0xaaaaaa);
                backlight2.position.set(-150, 40, -20);
                backlight2.intensity = 0.5;
                backlight2.lookAt(new THREE.Vector3(0, 15, 0));
                this.scene.add(backlight2);
            },
            cameraIn: function () {
                this.controls.zoomIn()
            },

            cameraOut: function () {
                this.controls.zoomOut()
            },

            windowResize: function (needResize: boolean): void {

                //窗口变动触发的函数 
                function onWindowResize() {
                    this.cameraV3.aspect = window.innerWidth / window.innerHeight;
                    this.cameraV3.updateProjectionMatrix();
                    this.reRender();
                    this.renderer.setSize(window.innerWidth, window.innerHeight)
                }
                if (needResize) {
                    window.removeEventListener("resize", onWindowResize);
                    window.addEventListener("resize", onWindowResize);
                } else {
                    window.removeEventListener("resize", onWindowResize);
                }
            },


            onclick: function (callback) {
                document.addEventListener('click', function (event) {
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


                    //用一个新的原点和方向向量来更新射线（ray），两个过程： 1 将鼠标当前位置（转换成0-1之间的2D向量）与ray挂钩。 2 将射线模型与摄像头关联并移动至摄像机。  估计后续事件操作都会以射线来控制及获取对应接触的模型
                    raycaster.setFromCamera(mouse, Cb.cameras.currentCamera);

                    //text();
                    let selGroup = glApi.getGroupByName(Cb.scene, "Building");

                    var intersects = raycaster.intersectObjects(selGroup.children, true);
                    console.info(intersects);
                    if (callback) {
                        callback(intersects, {
                            "x": event.clientX,
                            "y": event.clientY,
                        })
                    }

                });
            }
        }
    }
}



