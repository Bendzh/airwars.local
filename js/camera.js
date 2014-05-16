Camera = {
    perspectiveCamera       : null,
    viewAngle               : 60,
    aspect                  : window.innerWidth / window.innerHeight,
    near                    : 1,
    far                     : 2000000,
    x                       : 0,
    y                       : 15000,
    z                       : 10,
    controls                : null,
    moventSpeed             : 0,
    rotateSpeed             : 0,

    init                    : function(){
        Camera.perspectiveCamera = new THREE.PerspectiveCamera(Camera.viewAngle, Camera.aspect, Camera.near, Camera.far);
    },

    setPosition             : function(x, y, z){
        Camera.x = (x) ? x : Camera.x;
        Camera.y = (x) ? y : Camera.y;
        Camera.z = (z) ? z : Camera.z;

        Camera.perspectiveCamera.position.set(Camera.x, Camera.y, Camera.z);
    },

    switchControls          : function(controlsInfo){
        switch (controlsInfo.type.toLowerCase()){
            case "firstpersoncontrols" :
                Camera.controls = new THREE.FirstPersonControls(Camera.perspectiveCamera);
                Camera.controls.movementSpeed = controlsInfo.mSpeed;
                Camera.controls.lookSpeed = controlsInfo.rSpeed;
        }
    },

    update                  : function(){
        if(Camera.controls != null){
            Camera.controls.update(clock.getDelta());
        }
    }
}