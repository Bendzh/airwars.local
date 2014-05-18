var count = 0;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
WarWorld = {
    worldWidth      : 200,
    worldHeight     : 200,
    realWidth       : 5000, //(meters)
    terrainWidth    : window.innerWidth,
    terrainHeight   : window.innerHeight,
    realSpeedPerHour: 500, //(kilometers)
    speedPerHour    : 0,
    speedPerSec     : 0,
    webglContainer  : null,
    world           : null,
    light           : null,
    camera          : null,
    cameraControls  : null,
    cameraNear      : 0.2,
    cameraFar       : 10000,
    worldRenderer   : null,
    airPlane        : null,
    stats           : null,

    _initWorld              : function(){
        WarWorld.webglContainer = document.getElementById('webgl');
        WarWorld.world = new THREE.Scene();
        WarWorld.light = new THREE.AmbientLight(0xeeeeee);
        WarWorld.camera = new THREE.PerspectiveCamera(45, WarWorld.terrainWidth / WarWorld.terrainHeight, WarWorld.cameraNear, WarWorld.cameraFar);
        WarWorld.camera.position.set(0, 11, 0);
        WarWorld.worldRenderer = new THREE.WebGLRenderer();
        WarWorld.worldRenderer.setClearColor(0xffffff);
        WarWorld.worldRenderer.setSize(WarWorld.terrainWidth, WarWorld.terrainHeight);
        WarWorld.webglContainer.appendChild(WarWorld.worldRenderer.domElement);
        WarWorld.calculateSpeedPerSecond();

        WarWorld.world.add(WarWorld.light);
        //WarWorld.world.add(WarWorld.camera);

        WarWorld.stats = new Stats();
        WarWorld.stats.domElement.style.position = 'absolute';
        WarWorld.stats.domElement.style.top = '0px';
        WarWorld.webglContainer.appendChild(WarWorld.stats.domElement);

        /*WarWorld.cameraControls = new THREE.FirstPersonControls(WarWorld.camera);
        WarWorld.cameraControls.movementSpeed = WarWorld.speedPerSec;
        WarWorld.cameraControls.lookSpeed = 0.18;*/
    },

    _initTerrain            : function(){
        var terrainLoader = new THREE.TerrainLoader();
        terrainLoader.load('textures/terrain/jotunheimen.bin', function (data) {

            var geometry = new THREE.PlaneGeometry(200, 200, 199, 199);

            for (var i = 0, l = geometry.vertices.length; i < l; i++) {
                geometry.vertices[i].z = data[i] / 65535 * 10;
            }

            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
            var material = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('textures/terrain/jotunheimen-texture.jpg')
            });

            var terrainMesh = new THREE.Mesh(geometry, material);
            WarWorld.world.add(terrainMesh);

        });
    },

    _initAirPlane           : function(){
        var loader = new THREE.JSONLoader;
        loader.load("js/model/kk1.js", function (geometry, material) {
            var mat = new THREE.MeshFaceMaterial(material);
            WarWorld.airPlane = new THREE.Mesh(geometry, mat);
            WarWorld.airPlane.position.set(0, 10.5, -3);
            WarWorld.airPlane.scale.set(0.2,0.2,0.2);
            WarWorld.world.add(WarWorld.airPlane);
            WarWorld.airPlane.add(WarWorld.camera);
            WarWorld.camera.position.set(0, 2, 10);
        });
    },

    worldRender             : function(){
        WarWorld.stats.update();
        //WarWorld.cameraControls.update(clock.getDelta());
        requestAnimationFrame(WarWorld.worldRender);
        WarWorld.worldRenderer.render(WarWorld.world, WarWorld.camera);
        var delta = clock.getDelta();
        var moveDistance = WarWorld.speedPerSec * delta;
        var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
        /*if(WarWorld.airPlane)
            WarWorld.airPlane.translateZ( -moveDistance );*/
        if ( keyboard.pressed("A") )
            WarWorld.airPlane.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
        if ( keyboard.pressed("D") )
            WarWorld.airPlane.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
        if ( keyboard.pressed("W") )
            WarWorld.airPlane.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
        if ( keyboard.pressed("S") )
            WarWorld.airPlane.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
    },

    calculateSpeedPerSecond     : function(){
        var equivalent = WarWorld.realWidth / WarWorld.worldWidth;
        WarWorld.speedPerHour = (WarWorld.realSpeedPerHour * 1000) / equivalent;
        WarWorld.speedPerSec  = WarWorld.speedPerHour / (60*60);
    }
}
window.onload = function () {
    WarWorld._initWorld();
    WarWorld._initTerrain();
    WarWorld._initAirPlane();
    WarWorld.worldRender();
}