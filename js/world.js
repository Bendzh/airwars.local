World = {
    container   : null,
    scene       : null,
    renderer    : null,
    stats       : null,

    init        : function(){
        World.container  = document.getElementById('container');
        World.scene      = new THREE.Scene();
        World.addLight();
        World.renderer = new THREE.WebGLRenderer();
        World.renderer.setClearColor(0xbfd1e5);
        World.renderer.setSize(window.innerWidth, window.innerHeight);
        World.container.innerHTML = "";

        World.container.appendChild(this.renderer.domElement);
        World.stats = new Stats();
        World.stats.domElement.style.position = 'absolute';
        World.stats.domElement.style.top = '0px';
        World.container.appendChild(World.stats.domElement);
    },

    add         : function(obj){
        World.scene.add(obj);
    },

    addLight    : function(){
        var light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(10, 30, 20);
        light.castShadow = true;
        World.scene.add(light);

        var light = new THREE.PointLight(0xFFFFFF);
        light.position.x = 150;
        light.position.y = 0;
        light.position.z = -80;
        World.scene.add(light);

        var light = new THREE.PointLight(0xFFFFFF);
        light.position.x = -150;
        light.position.y = 0;
        light.position.z = -80;
        World.scene.add(light);

        var light = new THREE.PointLight(0xFFFFFF);
        light.position.x = 0;
        light.position.y = -100;
        light.position.z = -80;
        World.scene.add(light);
    },

    animate     : function(){
        requestAnimationFrame(World.animate);
        World.renderer.render(World.scene, Camera.perspectiveCamera);
        Camera.update();
        World.stats.update();
    }
}