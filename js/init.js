var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
{
    let global = window;
    global["gl"] = {
        meshs: { "current": "building" },
        isAnimateEnd: true,
        autoRotate: function (isRotate) {
            Cb.cameraAutoRotate(isRotate);
        },
        setCamera: function (type) {
        },
        reSel: function () {
            glApi.resetEmissive();
        },
        shotCut: function (type) {
            if (!Cb.isLoadEnd) {
                return;
            }
            if (this.meshs.current === type) {
                return;
            }
            else {
                this.meshs.current = type;
            }
            if (!this.isAnimateEnd) {
                return;
            }
            let limited = 100;
            let moveSp = 500;
            let igroup;
            let whoOpacity = "";
            let materialObj;
            if (!this.meshs["floor01"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_01");
                this.meshs["floor01"] = {
                    "isMove": false,
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                };
            }
            if (!this.meshs["floor02"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_02");
                this.meshs["floor02"] = {
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                };
            }
            if (!this.meshs["floor03"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_03");
                this.meshs["floor03"] = {
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                };
            }
            let self = this;
            materialObj = glApi.getAllMeshByGroup(self.meshs.floor01.group)[0].material.clone();
            let iAlpha = materialObj.opacity;
            switch (type) {
                case "building":
                    self.isAnimateEnd = false;
                    recation();
                    break;
                case "f01":
                    self.isAnimateEnd = false;
                    cameraIn();
                    limited = 100;
                    self.meshs.floor02.dic = self.meshs.floor02.dic === 1 ? 0 : 1;
                    if (self.meshs.floor03.isMove) {
                        self.meshs.floor03.dic = 0;
                    }
                    else {
                        self.meshs.floor03.dic = 1;
                    }
                    self.meshs.floor02.isMove = true;
                    self.meshs.floor03.isMove = true;
                    whoOpacity = "02";
                    setTimeout(function () { animas(); }, 1000);
                    break;
                case "f02":
                    self.isAnimateEnd = false;
                    cameraIn();
                    limited = 100;
                    self.meshs.floor02.dic = self.meshs.floor02.dic === 1 ? -1 : 0;
                    if (self.meshs.floor03.isMove) {
                        self.meshs.floor03.dic = 0;
                    }
                    else {
                        self.meshs.floor03.dic = 1;
                    }
                    self.meshs.floor02.isMove = false;
                    self.meshs.floor03.isMove = true;
                    whoOpacity = "03";
                    setTimeout(function () { animas(); }, 1000);
                    break;
                case "f03":
                    self.isAnimateEnd = false;
                    recation();
                    break;
            }
            function recation() {
                cameraOut();
                limited = 100;
                if (self.meshs.floor02.isMove) {
                    self.meshs.floor02.dic = -1;
                }
                else {
                    self.meshs.floor02.dic = 0;
                }
                if (self.meshs.floor03.isMove) {
                    self.meshs.floor03.dic = -1;
                }
                else {
                    self.meshs.floor03.dic = 0;
                }
                self.meshs.floor02.isMove = false;
                self.meshs.floor03.isMove = false;
                animas();
            }
            function animas() {
                if (limited <= 0) {
                    self.isAnimateEnd = true;
                    return;
                }
                self.meshs.floor01.group.position.z += moveSp * self.meshs.floor01.dic;
                self.meshs.floor02.group.position.z += moveSp * self.meshs.floor02.dic;
                self.meshs.floor03.group.position.z += moveSp * self.meshs.floor03.dic;
                limited--;
                requestAnimationFrame(animas);
            }
            return type;
        }
    };
}
var glApi = {
    postMsg: function (name, data) {
        let pWin = parent;
        if (pWin) {
            pWin.getGlData(name, data);
        }
    },
    isLock: function (type) {
        if (!Cb.isLoadEnd) {
            return;
        }
        if (this.meshs.current === type) {
            return;
        }
        else {
            this.meshs.current = type;
        }
        if (!this.isAnimateEnd) {
            return;
        }
    },
    getGroupByName: function (group, name) {
        let i = group.children.length;
        let igroup = group;
        if (i > 0) {
            while (i--) {
                let obj = group.children[i];
                if (obj.type.toLowerCase() === "group") {
                    if (obj.name === name) {
                        return obj;
                    }
                    else {
                        igroup = this.getGroupByName(obj, name);
                        if (igroup.name === name) {
                            return igroup;
                        }
                    }
                }
            }
        }
        return igroup;
    },
    getAllMeshByGroup: function (group) {
        let i = group.children.length;
        let ilist = [];
        if (i > 0) {
            while (i--) {
                if (group.children[i].type.toLowerCase() === "group") {
                    ilist = ilist.concat(this.getAllMeshByGroup(group.children[i]));
                }
                else if (group.children[i].type.toLowerCase() === "mesh") {
                    ilist.push(group.children[i]);
                }
            }
            return ilist;
        }
        else {
            return [];
        }
    },
    setGroupAlpha: function (group, alpha) {
        let meshs = this.getAllMeshByGroup(group);
        meshs.forEach(function (mesh) {
            mesh.material.opacity = alpha;
        });
    },
    oldmeshs: new Array(),
    resetEmissive: function () {
        this.oldmeshs.forEach(function (meshs) {
            meshs.forEach(function (mesh) {
                mesh.material.emissive.setHex(0x000000);
            });
        });
    },
    setGroupEmissive: function (group, color) {
        console.info(group);
        let meshs = this.getAllMeshByGroup(group);
        this.oldmeshs.push(meshs);
        let matir = meshs[0].material.clone();
        matir.emissive.setHex(color);
        meshs.forEach(function (mesh) {
            mesh.material = matir;
        });
    },
    setGroupMaterial: function (group, material) {
        let meshs = this.getAllMeshByGroup(group);
        meshs.forEach(function (mesh) {
            mesh.material.opacity = material.opacity;
        });
    },
    isType: function (mesh) {
        let iparent = mesh.parent;
        while (iparent.type !== "Scene") {
            iparent = iparent.parent;
            switch (iparent.name.toUpperCase()) {
                case METH_GROUP_NAME.MONITOR: return iparent.name;
                default: break;
            }
        }
        return "noType";
    }
};
var SHOW_STATE;
(function (SHOW_STATE) {
    SHOW_STATE["OVERALL_VIEW"] = "overallview";
    SHOW_STATE["BUILDING"] = "building";
    SHOW_STATE["FLOOR"] = "f";
})(SHOW_STATE || (SHOW_STATE = {}));
var POST_NAME;
(function (POST_NAME) {
    POST_NAME["CLICK"] = "mouseClick";
    POST_NAME["READY"] = "ready";
})(POST_NAME || (POST_NAME = {}));
var METH_GROUP_NAME;
(function (METH_GROUP_NAME) {
    METH_GROUP_NAME["MONITOR"] = "MONITOR";
})(METH_GROUP_NAME || (METH_GROUP_NAME = {}));
var Stats = function () {
    var mode = 0;
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    container.addEventListener('click', function (event) {
        event.preventDefault();
        showPanel(++mode % container.children.length);
    }, false);
    function addPanel(panel) {
        container.appendChild(panel.dom);
        return panel;
    }
    function showPanel(id) {
        for (var i = 0; i < container.children.length; i++) {
            container.children[i].style.display = i === id ? 'block' : 'none';
        }
        mode = id;
    }
    var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
    var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
    var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));
    if (self.performance && self.performance.memory) {
        var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
    }
    showPanel(0);
    return {
        REVISION: 16,
        dom: container,
        addPanel: addPanel,
        showPanel: showPanel,
        begin: function () {
            beginTime = (performance || Date).now();
        },
        end: function () {
            frames++;
            var time = (performance || Date).now();
            msPanel.update(time - beginTime, 200);
            if (time > prevTime + 1000) {
                fpsPanel.update((frames * 1000) / (time - prevTime), 100);
                prevTime = time;
                frames = 0;
                if (memPanel) {
                    var memory = performance.memory;
                    memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
                }
            }
            return time;
        },
        update: function () {
            beginTime = this.end();
        },
        domElement: container,
        setMode: showPanel
    };
};
Stats.Panel = function (name, fg, bg) {
    var min = Infinity, max = 0, round = Math.round;
    var PR = round(window.devicePixelRatio || 1);
    var WIDTH = 80 * PR, HEIGHT = 48 * PR, TEXT_X = 3 * PR, TEXT_Y = 2 * PR, GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR, GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;
    var canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';
    var context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';
    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
    return {
        dom: canvas,
        update: function (value, maxValue) {
            min = Math.min(min, value);
            max = Math.max(max, value);
            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);
            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);
            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }
    };
};
{
    function init() {
        var urls = ["./models/bigborder.dae"];
        var loaderScene = getSceneMaster();
        loaderScene.loadMesh(urls, function () {
        });
        return loaderScene;
    }
    ;
    var Cb = init();
    console.log(Cb.scene);
    Cb.initControl(100, 200);
    Cb.controls.autoRotateSpeed = 0.5;
    Cb.controls.zoomSpeed = 0.3;
    Cb.controls.enablePan = false;
    Cb.controls.enabled = false;
    Cb.addLights();
    Cb.cameraAutoRotate(true);
    Cb.onclick(function (objGroup, mouse) {
        if (objGroup.length > 0) {
            let selName = objGroup[0].object.name;
            let objName = selName.split("_")[0];
            let GType = glApi.isType(objGroup[0].object);
            switch (GType.toUpperCase()) {
                case METH_GROUP_NAME.MONITOR:
                    glApi.setGroupEmissive(glApi.getGroupByName(Cb.scene, objName), 0x00BFFF);
                    glApi.postMsg(POST_NAME.CLICK, objName);
                    break;
            }
        }
    });
    function cameraIn() {
        if (Cb.cameras.currentCamera.position.y <= 80) {
            return true;
        }
        Cb.scene.position.y -= 1;
        Cb.cameraIn();
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
        Cb.controls.update();
        requestAnimationFrame(animate);
        Cb.reRender();
    }
    animate();
    function getSceneMaster() {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        let cameraV3;
        cameraV3 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraV3.position.copy(new THREE.Vector3(100, 100, 100));
        cameraV3.lookAt(new THREE.Vector3(0, 0, 0));
        THREE.DefaultLoadingManager.onLoad = function () {
            glApi.postMsg(POST_NAME.READY);
            Cb.isLoadEnd = true;
        };
        function loadAllDAEs(urls, callback) {
            let sceneObjs = { meshes: {}, lights: {} };
            function getFloorNum(str) {
                return parseInt(str[0]);
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
            let url;
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
        return {
            isLoadEnd: false,
            state: new Stats(),
            cameras: {
                currentCamera: cameraV3
            },
            controls: null,
            scene: new THREE.Scene(),
            renderer: initRenderer({
                antialias: true, alpha: true
            }),
            loadMesh: function (urls, callback) {
                loadAllDAEs(urls, (meshes) => {
                    this.addMeshes(meshes);
                    if (callback) {
                        callback(meshes);
                    }
                });
            },
            initControl: function (min, max) {
                this.controls = new THREE.OrbitControls(cameraV3, document.getElementById("webgl-output"));
                this.controls.minDistance = min;
                this.controls.maxDistance = max;
                this.controls.enableDamping = true;
                this.controls.autoRotate = false;
                this.controls.enableZoom = true;
                this.controls.enablePan = true;
            },
            addMeshes: function (meshes) {
                return __awaiter(this, void 0, void 0, function* () {
                    let keyName;
                    for (keyName in meshes) {
                        yield this.scene.add(meshes[keyName]);
                    }
                    this.reRender();
                });
            },
            reRender: function () {
                this.renderer.render(this.scene, this.cameras.currentCamera);
            },
            cameraAutoRotate: function (autoRotate) {
                this.controls.autoRotate = autoRotate;
            },
            cameraDistance: function (min, max) {
                this.controls.minDistance = min;
                this.controls.maxDistance = max;
            },
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
                this.controls.zoomIn();
            },
            cameraOut: function () {
                this.controls.zoomOut();
            },
            windowResize: function (needResize) {
                function onWindowResize() {
                    this.cameraV3.aspect = window.innerWidth / window.innerHeight;
                    this.cameraV3.updateProjectionMatrix();
                    this.reRender();
                    this.renderer.setSize(window.innerWidth, window.innerHeight);
                }
                if (needResize) {
                    window.removeEventListener("resize", onWindowResize);
                    window.addEventListener("resize", onWindowResize);
                }
                else {
                    window.removeEventListener("resize", onWindowResize);
                }
            },
            onclick: function (callback) {
                document.addEventListener('click', function (event) {
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                    raycaster.setFromCamera(mouse, Cb.cameras.currentCamera);
                    let selGroup = glApi.getGroupByName(Cb.scene, "Building");
                    var intersects = raycaster.intersectObjects(selGroup.children, true);
                    console.info(intersects);
                    if (callback) {
                        callback(intersects, {
                            "x": event.clientX,
                            "y": event.clientY,
                        });
                    }
                });
            }
        };
    }
}
//# sourceMappingURL=init.js.map