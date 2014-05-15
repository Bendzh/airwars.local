var scene, camera, controls, render, container, stats, iii = 10;
var clock = new THREE.Clock();
window.onload = function(){
    init();
    animate();
}

function init(){
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, Terrain.width/Terrain.height, 1, 20000);
    camera.position.y = 800;
    camera.position.z = 0;
    camera.position.x = -10000;

    camera.rotation.y = 300;
    /*
     controls.movementSpeed = 666;
     controls.lookSpeed = 0.08;*/

    var textures = new Array();
    var geomPar = new Array();

    textures['disp'] = "textures/terrain/vulkan_DISP.png";
    textures['diff'] = "textures/terrain/vulkan_COLOR.jpg";
    textures['norm'] = "textures/terrain/vulkan_NRM.png";

    geomPar['width'] = 20000;
    geomPar['height'] = 20000;
    geomPar['wSigment'] = 127;
    geomPar['hSigment'] = 127;

    Terrain._init(textures, 700, geomPar);
    addToScene(Terrain.plane, scene);
    Airplane._init("js/model/kk1.js", Array(-9993, 798, 0), 1);
    console.log('don\'t load plane');
    //addToScene(Airplane.airPlane, scene);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.shadowCameraVisible = true;
    light.position.set(0,300,100);
    scene.add(light);

    render = new THREE.WebGLRenderer();
    render.setClearColor( 0xFFFFFF );
    render.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(render.domElement);
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
}
function animate(){
    requestAnimationFrame(animate);
    stats.update();
    renderGo();
}
function renderGo(){
    if(controls){
        controls.update(clock.getDelta());
        cameraControls();
    }
    render.render(scene, camera);
}

function cameraControls(){
    var relativeCameraOffset = new THREE.Vector3(-10000,800,0);
    var cameraOffset = relativeCameraOffset.applyMatrix4( Airplane.airPlane.matrixWorld );

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt( Airplane.airPlane.position );

    if(iii){
        console.log('Camera');
        console.log(camera.position);
        console.log('Airplane');
        console.log(Airplane.airPlane.position);
        iii--;
    }
}

function setControls(){
    Airplane.airPlane.rotation.y = 300;
    controls = new THREE.FlyControls(Airplane.airPlane);
    controls.movementSpeed = 1000;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

}
function addToScene(obj, scene){
    scene.add(obj);
}