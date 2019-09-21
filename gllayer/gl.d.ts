interface KeyVal {
    [key: string]: any
}

interface SceneObjs {
    meshes: KeyVal,
    lights: KeyVal
}

interface IWin extends Window {
    [key: string]: any
}

interface Group extends KeyVal {
    children: Array<any>
}

interface GroupControl extends Group {
    hidden(group: Group): void
}

interface OrbigResult {
    scene: any
    animations: Array<any>
    kinematics: Array<any>
    library: {
        animations: { [key: string]: any }
        clips: { [key: string]: any }
        controllers: { [key: string]: any }
        images: { [key: string]: any }
        effects: { [key: string]: any }
        materials: { [key: string]: any }
        cameras: { [key: string]: any }
        lights: { [key: string]: any }
        geometries: { [key: string]: any }
        nodes: { [key: string]: any }
        visualScenes: { [key: string]: any }
        kinematicsModels: { [key: string]: any }
        kinematicsScenes: { [key: string]: any }
    }
}

declare enum CAMERA_LENS {
    MODE = 10001,
    MODE2 = 10002
}

interface RaycasterObj{
    distance: number
    face: THREE.Face3
    faceIndex: number
    object: Mesh
    point: THREE.Vector3
}


interface Mesh{
    castShadow: boolean
    children: Array<THREE.Object3D>
    drawMode: number
    frustumCulled: boolean
    geometry: THREE.BufferGeometry
    layers: {mask: 1}
    material: THREE.MeshPhongMaterial
    matrix: THREE.Matrix4
    matrixAutoUpdate: boolean
    matrixWorld: THREE.Matrix4
    matrixWorldNeedsUpdate: boolean
    name: string
    parent: Group
    position: THREE.Vector3
    quaternion: THREE.Quaternion
    receiveShadow: boolean
    renderOrder: number
    rotation: THREE.Euler
    scale: THREE.Vector3
    type: string
    up: THREE.Vector3
    userData: {}
    uuid: string
    visible: boolean    
    id: number
    eulerOrder():void
}
//BaseLoaderScene.js
interface SceneMaster {

    state:Stats
    cameras:{
        [key:string]:THREE.PerspectiveCamera
    } 
    isLoadEnd:boolean
    controls: THREE.OrbitControls
    scene: THREE.Scene
    renderer: THREE.Renderer
    loadMesh(urls:Array<string>,callback:Function):void
    initControl(min:number,max:number):void
    addMeshes(meshes: KeyVal): void
    reRender(): void
    addLights(): void
    cameraAutoRotate(autoRotate: Boolean): void
    cameraDistance(min: Number, max: Number): void

    cameraIn(): void
    cameraOut(): void
    windowResize(needResize: boolean):void    
    onclick(callback:Function):void
}








declare class Stats {
    update(): void
    dom: HTMLElement
}
//UNTIL.JS
declare function initCamera(initialPosition: THREE.Vector3): THREE.PerspectiveCamera
declare function initRenderer(additionalProperties: KeyVal): THREE.WebGLRenderer
