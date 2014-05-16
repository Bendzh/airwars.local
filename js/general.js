clock = new THREE.Clock();
window.onload = function(){

    World.init();
    Camera.init();
    World.add(Camera.perspectiveCamera);
    Camera.setPosition(0, 15000, 10);
    Terrain.loadTerrain();
    Airplane.loadAirPlane();

    var controls = {
        type    : 'FirstPersonControls',
        mSpeed  : 20,
        rSpeed  : 0.18
    }

    Camera.switchControls(controls);

    World.animate();
}