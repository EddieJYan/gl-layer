export  class  OrbitControls{
   constructor(camera:THREE.Camera, elem:HTMLElement)
   enableDamping:boolean
   
   enableZoom:boolean

   autoRotate:boolean

   minDistance:number

   maxDistance:number

   enablePan:boolean

   update:Function
   zoomIn:Function
   zoomOut:Function

   
   object:any //任何绑定到轨道的物体
	domElement:HTMLElement

	// Set to false to disable this control
	enabled:boolean

	// "target" sets the location of focus, where the object orbits around
	target:THREE.Vector3


	// How far you can zoom in and out ( OrthographicCamera only )
	minZoom:number
	maxZoom:number

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	minPolarAngle:number
	maxPolarAngle :number

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	minAzimuthAngle:number
	maxAzimuthAngle:number

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	dampingFactor:number

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming

	zoomSpeed:number

	// Set to false to disable rotating
	enableRotate:boolean
	rotateSpeed:number

	// Set to false to disable panning
	panSpeed:number
	screenSpacePanning:boolean // if true, pan in screen-space
	keyPanSpeed:number

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop

	autoRotateSpeed:number

	// Set to false to disable use of the keys
	enableKeys:boolean

	// The four arrow keys
	keys:{ LEFT:number, UP:number, RIGHT:number, BOTTOM:number}


}