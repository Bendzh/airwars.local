var count = 0;
var spanHit;
var hitCount = 0;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();
var testObj;
var pricel;
var distanceZ = 0;
var distanceX = 0;
WarWorld = {
    worldWidth: 200,
    worldHeight: 200,
    terrainMesh: null,
    realWidth: 5000, //(meters)
    terrainWidth: window.innerWidth,
    terrainHeight: window.innerHeight,
    realSpeedPerHour: 500, //(kilometers)
    speedPerHour: 0,
    speedPerSec: 0,
    webglContainer: null,
    world: null,
    light: null,
    camera: null,
    airPlaneControls: null,
    cameraNear: 0.2,
    cameraFar: 10000,
    worldRenderer: null,
    airPlanes: new Array(),
    stats: null,
    collision: true,
    bullets: [],

    _initWorld: function () {
        'use strict';

        Physijs.scripts.worker = 'js/libs/physijs_worker.js';
        Physijs.scripts.ammo = 'ammo.js';
        WarWorld.webglContainer = document.getElementById('webgl');
        spanHit = document.getElementById('hit');

        WarWorld.world = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
        WarWorld.world.setGravity(new THREE.Vector3( 0, -10, 0 ));
        WarWorld.world.addEventListener(
            'update',
            function() {
                WarWorld.world.simulate( undefined, 2 );
            }
        );
        //WarWorld.world = new THREE.Scene();
        WarWorld.light = new THREE.AmbientLight(0xeeeeee);
        WarWorld.camera = new THREE.PerspectiveCamera(45, WarWorld.terrainWidth / WarWorld.terrainHeight, WarWorld.cameraNear, WarWorld.cameraFar);
        WarWorld.camera.position.set(-10, 10, 20);
        WarWorld.worldRenderer = new THREE.WebGLRenderer();
        WarWorld.worldRenderer.setClearColor(0xffffff);
        WarWorld.worldRenderer.setSize(WarWorld.terrainWidth, WarWorld.terrainHeight);
        WarWorld.webglContainer.appendChild(WarWorld.worldRenderer.domElement);

        WarWorld.world.add(WarWorld.light);
        //WarWorld.world.add(WarWorld.camera);
        WarWorld.stats = new Stats();
        WarWorld.stats.domElement.style.position = 'absolute';
        WarWorld.stats.domElement.style.top = '0px';
        WarWorld.webglContainer.appendChild(WarWorld.stats.domElement);
    },

    _initTerrain: function () {
        var terrainLoader = new THREE.TerrainLoader();
        terrainLoader.load('textures/terrain/jotunheimen.bin', function (data) {

            var geo = new THREE.PlaneGeometry(200,200,199,199);

                for (var i = 0, l = geo.vertices.length; i < l; i++) {
                    geo.vertices[i].z = data[i] / 65535 * 10;
                }
            //geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

            geo.computeFaceNormals();
            geo.computeVertexNormals();
            var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('textures/terrain/jotunheimen-texture.jpg')
            }),.8,.4);


            var ground = new Physijs.HeightfieldMesh(geo,mat,0,199,199);
            ground.rotation.x = Math.PI / -2;
            WarWorld.world.add(ground);
        });



        /*var geoc = new THREE.CubeGeometry(3,3,3);
         var matc = new THREE.MeshBasicMaterial({color:0xffff00});
         var box  = new Physijs.BoxMesh(geoc,matc);
         box.position.set(0,30,0);
         WarWorld.world.add(box);*/

        var loader = new THREE.JSONLoader;
        loader.load("js/model/kk1.js", function (geometry, material) {
            var mat = new THREE.MeshBasicMaterial({color:0xffff00});

            WarWorld.airPlanes[0] = new THREE.Mesh(geometry, mat);
            WarWorld.airPlanes[0].position.set(-10,10,10);
            WarWorld.airPlanes[0].scale.set(0.2, 0.2, 0.2);
            WarWorld.world.add(WarWorld.airPlanes[0]);
        });

    /*
        var terrainLoader = new THREE.TerrainLoader();
        terrainLoader.load('textures/terrain/jotunheimen.bin', function (data) {

            var geometry = new THREE.PlaneGeometry(200, 200, 199, 199);

            for (var i = 0, l = geometry.vertices.length; i < l; i++) {
                geometry.vertices[i].z = data[i] / 65535 * 10;
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
            var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('textures/terrain/jotunheimen-texture.jpg')
            }),
                .8, // high friction
                .4 // low restitution
            );
            WarWorld.terrainMesh = new Physijs.HeightfieldMesh(
                geometry,
                material,
                0, // mass
                199,
                199
            );
            //WarWorld.terrainMesh = new THREE.Mesh(geometry, material);
            WarWorld.world.add(WarWorld.terrainMesh);

        });*/
    },

    _initAirPlane: function () {
        var loader = new THREE.JSONLoader;
        loader.load("js/model/kk1.js", function (geometry, material) {
            var mat = new THREE.MeshFaceMaterial(material);
            var numberOfAirplans = 0;
            if (WarWorld.airPlanes[0]) {
                numberOfAirplans = WarWorld.airPlanes.length;
                distanceZ += 3;
                distanceX = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
            }
            WarWorld.airPlanes[numberOfAirplans] = new Physijs.PlaneMesh(geometry, mat);
            WarWorld.airPlanes[numberOfAirplans].numInWorld = numberOfAirplans+1;
            WarWorld.airPlanes[numberOfAirplans].health = 100;
            WarWorld.airPlanes[numberOfAirplans].position.set(distanceX, 10.5, -3 - distanceZ);
            WarWorld.airPlanes[numberOfAirplans].scale.set(0.2, 0.2, 0.2);
            WarWorld.world.add(WarWorld.airPlanes[numberOfAirplans]);

            if (numberOfAirplans == 0) {
                /*loader.load("js/model/pricel.js", function (geometry, material) {
                    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
                    var mat = new THREE.MeshFaceMaterial(material);
                    pricel = new THREE.Mesh(geometry, mat);
                    pricel.scale.set(0.35, 0.35, 0.35);
                    pricel.position.set(0.045, -0.314, -1);
                    console.log(pricel.position);

                    WarWorld.airPlanes[0].add(pricel);
                });*/
                /*WarWorld.airPlaneControls = new THREE.FlyControls(WarWorld.airPlanes[0]);
                WarWorld.airPlaneControls.movementSpeed = WarWorld.speedPerSec;
                WarWorld.airPlaneControls.rollSpeed = 0.18;
                WarWorld.airPlaneControls.autoForward = true;*/

                var axisHelper = new THREE.AxisHelper(5);
                 WarWorld.airPlanes[0].add(axisHelper);

                WarWorld.airPlanes[0].add(WarWorld.camera);
                WarWorld.camera.position.set(0, 2, 13);
            }
        });
    },

    worldRender: function () {
        WarWorld.world.simulate();
        WarWorld.stats.update();
        var delta = -20;
        var currBullet = 0;
        if (WarWorld.bullets.length > 0) {
            while(currBullet < WarWorld.bullets.length){
                WarWorld.bullets[currBullet].translateOnAxis(new THREE.Vector3(0, 0.057, 1), -2);
                WarWorld.bullets[currBullet].fantom.translateOnAxis(new THREE.Vector3(0, 0.057, 1), -2);
                if(WarWorld.inspectCollision(WarWorld.bullets[currBullet], WarWorld.bullets[currBullet].position.clone(), currBullet)) continue;
                WarWorld.bullets[currBullet].far += 2;
                if(WarWorld.bullets[currBullet].far > 200){
                    WarWorld.world.remove(WarWorld.bullets[currBullet]);
                    WarWorld.world.remove(WarWorld.bullets[currBullet].fantom);
                    WarWorld.bullets.splice(currBullet,1);
                }
                currBullet++;
            }
        }
        /*if (WarWorld.airPlanes[0])
            WarWorld.airPlaneControls.update(clock.getDelta());*/

        requestAnimationFrame(WarWorld.worldRender);
        WarWorld.worldRenderer.render(WarWorld.world, WarWorld.camera);
    },

    calculateSpeedPerSecond: function () {
        var equivalent = WarWorld.realWidth / WarWorld.worldWidth;
        WarWorld.speedPerHour = (WarWorld.realSpeedPerHour * 1000) / equivalent;
        WarWorld.speedPerSec = WarWorld.speedPerHour / (60 * 60);
    },

    inspectCollision: function (obj, originPoint, bullet) {
        var collisionObjects = [];
        for(var i = 1; i < WarWorld.airPlanes.length; i++) collisionObjects.push(WarWorld.airPlanes[i]);
        for (var objVertex = 0; objVertex < obj.geometry.vertices.length; objVertex++) {
            var localVertex = obj.geometry.vertices[objVertex].clone();
            var globalVertex = localVertex.applyMatrix4(obj.matrix);
            var directionVector = globalVertex.sub(obj.position);


            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collisionObjects);//,true);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                WarWorld.collision = true;
                hitCount++;
                spanHit.innerHTML = "Hit " + hitCount;
                WarWorld.world.remove(WarWorld.bullets[bullet]);
                WarWorld.world.remove(WarWorld.bullets[bullet].fantom);
                WarWorld.bullets.splice(bullet, 1);

                WarWorld.airPlanes[collisionResults[0].object.numInWorld - 1].health -= 25;
                if(WarWorld.airPlanes[collisionResults[0].object.numInWorld - 1].health <= 0){
                    WarWorld.world.remove(WarWorld.airPlanes[collisionResults[0].object.numInWorld - 1]);
                }
                return true;
                break;
            }
        }
        return false;
    },

    makeTheShot: function (obj) {
        var length  = WarWorld.bullets.length;
        WarWorld.bullets[length] = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 2), new THREE.MeshBasicMaterial({opacity: 0, transparent: true }));
        WarWorld.bullets[length].fantom = new THREE.Mesh(new THREE.SphereGeometry(0.017, 2, 2), new THREE.MeshBasicMaterial({color: 0x000000}));
        WarWorld.bullets[length].far = 0;
        WarWorld.bullets[length].position.set(obj.position.x, (obj.position.y+(pricel.position.y * -1))-WarWorld.bullets[length].geometry.radius-0.070, obj.position.z);
        WarWorld.bullets[length].rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);

        WarWorld.bullets[length].fantom.position.set(obj.position.x,obj.position.y, obj.position.z);
        WarWorld.bullets[length].fantom.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        WarWorld.world.add(WarWorld.bullets[length]);
        WarWorld.world.add(WarWorld.bullets[length].fantom);
    }
}
window.onload = function () {
    WarWorld._initWorld();
    WarWorld._initTerrain();
/*        WarWorld._initAirPlane();*/
    WarWorld.worldRender();
}