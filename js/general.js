WarWorld = {
    terrainWidth    : window.innerWidth,
    terrainHeight   : window.innerHeight,
    webglContainer  : null,
    world           : null,
    light           : null,
    camera          : null,
    cameraControls  : null,
    cameraNear      : 1,
    cameraFar       : 10000,
    worldRenderer   : null,
    airPlane        : null,
    stats           : null,

    _initWorld           : function(){
        WarWorld.webglContainer = document.getElementById('webgl');
        WarWorld.world = new THREE.Scene();
        WarWorld.light = new THREE.AmbientLight(0xeeeeee);
        WarWorld.camera = new THREE.PerspectiveCamera(45, WarWorld.terrainWidth / WarWorld.terrainHeight, WarWorld.cameraNear, WarWorld.cameraFar);
        WarWorld.camera.position.set(-50, 11, 0);
        WarWorld.worldRenderer = new THREE.WebGLRenderer();
        WarWorld.worldRenderer.setClearColor(0xffffff);
        WarWorld.worldRenderer.setSize(WarWorld.terrainWidth, WarWorld.terrainHeight);
        WarWorld.webglContainer.appendChild(WarWorld.worldRenderer.domElement);

        WarWorld.world.add(WarWorld.light);
        WarWorld.world.add(WarWorld.camera);

        WarWorld.stats = new Stats();
        WarWorld.stats.domElement.style.position = 'absolute';
        WarWorld.stats.domElement.style.top = '0px';
        WarWorld.webglContainer.appendChild(WarWorld.stats.domElement);

        WarWorld.cameraControls = new THREE.FirstPersonControls(WarWorld.camera);
        WarWorld.cameraControls .movementSpeed = 5.6*5;
        WarWorld.cameraControls .lookSpeed = 0.18;
    },

    _initTerrain        : function(){
        var terrainLoader = new THREE.TerrainLoader();
        terrainLoader.load('textures/terrain/jotunheimen.bin', function (data) {

            var geometry = new THREE.PlaneGeometry(200, 200, 199, 199);

            for (var i = 0, l = geometry.vertices.length; i < l; i++) {
                geometry.vertices[i].z = data[i] / 65535 * 14;
            }

            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
            var material = new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('textures/terrain/jotunheimen-texture.jpg')
            });

            var terrainMesh = new THREE.Mesh(geometry, material);
            WarWorld.world.add(terrainMesh);

        });
    },

    _initAirPlane       : function(){
        var loader = new THREE.JSONLoader;
        loader.load("js/model/kk1.js", function (geometry, material) {
            var mat = new THREE.MeshFaceMaterial(material);
            var airPlane1 = new THREE.Mesh(geometry, mat);
            WarWorld.airPlane = new THREE.Object3D();
            airPlane1.position.set(0, 10, -7);
            WarWorld.airPlane.add(airPlane1);
            WarWorld.world.add(WarWorld.airPlane);
        });
    },

    worldRender         : function(){
        WarWorld.stats.update();
        WarWorld.cameraControls.update(0.003);
        requestAnimationFrame(WarWorld.worldRender);
        WarWorld.worldRenderer.render(WarWorld.world, WarWorld.camera);
    }
}
window.onload = function () {
    WarWorld._initWorld();
    WarWorld._initTerrain();
    WarWorld._initAirPlane();

    WarWorld.worldRender();
}