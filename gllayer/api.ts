
//提供给父窗口使用的接口，建议每个接口都是单一功能线，不要做太多判断分支。这样在今后维护会很简单。
{

    let global: IWin = window;
    global["gl"] = {
        meshs: { "current": "building" },//current 当前镜头位置
        isAnimateEnd: true, //动画判断
        autoRotate: function (isRotate: boolean) {
            Cb.cameraAutoRotate(isRotate);
        },
        setCamera: function (type: string): void {

        },
        reSel: function () {
            glApi.resetEmissive();
        },

        shotCut: function (type: string): string {
            
            if (!Cb.isLoadEnd) { //加载锁
                return;
            }
            //同按钮点击锁
            if (this.meshs.current === type) {
                return;
            } else {
                this.meshs.current = type;
            }
            //动画锁
            if (!this.isAnimateEnd) {
                return;
            }


            let limited = 100;//移动的远
            let moveSp = 500;//移动的快
            let igroup;


            let materialObj: THREE.MeshPhongMaterial;
            if (!this.meshs["floor01"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_01");
                this.meshs["floor01"] = {
                    "isMove": false,
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                }
            }
            if (!this.meshs["floor02"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_02");
                this.meshs["floor02"] = {
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                }
            }
            if (!this.meshs["floor03"]) {
                igroup = glApi.getGroupByName(Cb.scene, "Floor_03");
                this.meshs["floor03"] = {
                    "dic": 0,
                    "group": igroup,
                    "y": igroup.position.y
                }
            }
            let self = this;
            materialObj = glApi.getAllMeshByGroup(self.meshs.floor01.group)[0].material.clone();
console.info(type)
            //Cb就是总控制台
            switch (type) {
                case COMMUNICATE_NAME.BUILDING_01:
                    self.isAnimateEnd = false;
                    recation();
                    break;
                case COMMUNICATE_NAME.Floor_01:
                    self.isAnimateEnd = false;
                    cameraIn();
                    limited = 100;

                    self.meshs.floor02.dic = self.meshs.floor02.dic === 1 ? 0 : 1; //往上移动

                    //重叠上升时需要复杂判断
                    if (self.meshs.floor03.isMove) {
                        self.meshs.floor03.dic = 0;
                    } else {
                        self.meshs.floor03.dic = 1;
                    }

                    self.meshs.floor02.isMove = true;
                    self.meshs.floor03.isMove = true;
   
                    setTimeout(function () { animas() }, 1000);
                    break;
                case COMMUNICATE_NAME.Floor_02:
                    self.isAnimateEnd = false;
                    cameraIn();
                    limited = 100;

                    self.meshs.floor02.dic = self.meshs.floor02.dic === 1 ? -1 : 0; //往下

                    //重叠上升时需要复杂判断
                    if (self.meshs.floor03.isMove) {

                        self.meshs.floor03.dic = 0;
                    } else {
                        self.meshs.floor03.dic = 1;
                    }
                    self.meshs.floor02.isMove = false;
                    self.meshs.floor03.isMove = true;


                    setTimeout(function () { animas() }, 1000);

                    break;
                case COMMUNICATE_NAME.Floor_03:
                    self.isAnimateEnd = false;
                    recation();
                    break;
            }
            //还原
            function recation() {
                cameraOut();
                limited = 100;

                //重叠上升时需要复杂判断
                if (self.meshs.floor02.isMove) {
                    self.meshs.floor02.dic = -1;
                } else {
                    self.meshs.floor02.dic = 0;
                }
                //重叠上升时需要复杂判断
                if (self.meshs.floor03.isMove) {
                    self.meshs.floor03.dic = -1;
                } else {
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
    }
    //调用父窗口接口
}



var glApi = {



    //对父窗口的唯一通道
    postMsg: function (name: string, data?: any) {
        let pWin: IWin = parent;
        if (pWin) {
            pWin.getGlData(name, data);
        }
    },

    //对于各种阻止事件进行的总判断
    isLock: function (type:string) {
        if (!Cb.isLoadEnd) { //加载锁
            return;
        }
        //同按钮点击锁
        if (this.meshs.current === type) {
            return;
        } else {
            this.meshs.current = type;
        }
        //动画锁
        if (!this.isAnimateEnd) {
            return;
        }
    },

    //获取对应名称的组
    getGroupByName: function (group: Group, name: string): Group {
        let i: number = group.children.length;
        let igroup = group;
        if (i > 0) {
            while (i--) {
                let obj = group.children[i];
                if (obj.type.toLowerCase() === "group") {
                    if (obj.name === name) {
                        return obj;
                    } else {
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
    //获取所有模型
    getAllMeshByGroup: function (group: Group): Array<Mesh> {
        let i: number = group.children.length;
        let ilist: Array<Mesh> = [];
        if (i > 0) {
            while (i--) {
                if (group.children[i].type.toLowerCase() === "group") {
                    ilist = ilist.concat(this.getAllMeshByGroup(group.children[i]));
                } else if (group.children[i].type.toLowerCase() === "mesh") {
                    ilist.push(group.children[i])
                }
            }
            return ilist;
        } else {
            return [];
        }
    },


    setGroupAlpha: function (group: Array<THREE.Object3D>, alpha: number) {
        let meshs: Array<Mesh> = this.getAllMeshByGroup(group);
        meshs.forEach(function (mesh: Mesh) {
            //mesh.material.emissive.setHex(material.emissive.getHex());
            mesh.material.opacity = alpha;
        })
    },


    oldmeshs: new Array(),
    //直接设置isReset true 可以还原刚在的设置
    resetEmissive: function (): void {
        this.oldmeshs.forEach(function (meshs: Array<Mesh>) {
            meshs.forEach(function (mesh: Mesh) {
                mesh.material.emissive.setHex(0x000000);
            })
        })
    },

    setGroupEmissive: function (group: Group, color: number): void {
        console.info(group)
        let meshs: Array<Mesh> = this.getAllMeshByGroup(group);
        this.oldmeshs.push(meshs);

        let matir = meshs[0].material.clone();//保证每个模型组使用的材质是独立的

        matir.emissive.setHex(color);
        meshs.forEach(function (mesh: Mesh) {
            //mesh.material.emissive.setHex(material.emissive.getHex());            
            mesh.material = matir;
        })
    },

    setGroupMaterial: function (group: Array<THREE.Object3D>, material: THREE.MeshPhongMaterial) {
        let meshs: Array<Mesh> = this.getAllMeshByGroup(group);
        meshs.forEach(function (mesh: Mesh) {
            //mesh.material.emissive.setHex(material.emissive.getHex());
            mesh.material.opacity = material.opacity;
        })
    },

    isType: function (mesh: Mesh) {
        let iparent: Group = mesh.parent;
        while (iparent.type !== "Scene") {
            iparent = iparent.parent;
            switch (iparent.name.toUpperCase()) {
                case METH_GROUP_NAME.MONITOR: return iparent.name;
                default: break;
            }
        }
        return "noType";
    }

}


var config = {
    "name":{
        "floor":{
            "f1":"f01",
            "f2":"f02",
            "f3":"f03"
        }
    }
}


//对接外层的通信命名设置
enum COMMUNICATE_NAME{
    OVERALL_VIEW =  "overallview",
    BUILDING_01 = "building", 
    Floor_01 = "f01",
    Floor_02 = "f02",
    Floor_03 = "f03"
}

enum POST_NAME {
    CLICK = "mouseClick",
    READY = "ready"
}

enum METH_GROUP_NAME {
    MONITOR = "MONITOR",
}