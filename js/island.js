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

    var axes = new THREE.AxisHelper(10000);
    scene.add(axes);

    camera = new THREE.PerspectiveCamera(45, Terrain.width/Terrain.height, 1, 20000);
    camera.position.set(0, 10, 0);

//////////////////////////////////////////////////////
    var textures = new Array();
    var geomPar = new Array();

    textures['disp'] = "textures/terrain/vulkan_DISP.png";
    textures['diff'] = "textures/terrain/vulkan_COLOR.jpg";
    textures['norm'] = "textures/terrain/vulkan_NRM.png";

    geomPar['width'] = 60;
    geomPar['height'] = 60;
    geomPar['wSigment'] = 199;
    geomPar['hSigment'] = 199;

    Terrain._init(textures, 1, geomPar);
    addToScene(Terrain.plane, scene);/*
////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
    Airplane._init("js/model/kk1.js", Array(0, 995, 6983), 1);
    console.log('don\'t load plane');
////////////////////////////////////////////////////////*/

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
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 40;
    controls.lookSpeed = 0.18;
}
function animate(){
    requestAnimationFrame(animate);
    controls.update(0.003);
    stats.update();
    renderGo();
}
function renderGo(){
    render.render(scene, camera);
}
function addToScene(obj, scene){
    scene.add(obj);
}