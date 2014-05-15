$(document).ready(function(){
    var scene, camera, controls, render, container, stats;
    var clock = new THREE.Clock();

    Terrain = {
        width           : window.innerWidth,
        height          : window.innerHeight,
        heightDate2D    : []
    }
    Terrain.getHeightFromImg = function(mapImage) {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 200;
        canvas.height = 200;
        var context = canvas.getContext( '2d' );

        var size = 200 * 200;
        Terrain.heightDate2D = new Float32Array(size);

        context.drawImage(mapImage,0,0);

        for (var i = 0; i < size; i++) {
            Terrain.heightDate2D[i] = 0
        }

        var imgd = context.getImageData(0, 0, 200, 200);
        var pix = imgd.data;
        console.log(pix);

        var j=0;
        for (var i = 0, n = pix.length; i < n; i += (4)) {
            var all = pix[i]+pix[i+1]+pix[i+2];
            Terrain.heightDate2D[j++] = all/5;
        }
    }

    function init(){
        container = document.createElement('div');
        document.body.appendChild(container);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, Terrain.width/Terrain.height, 1, 100000);
        controls = new THREE.FirstPersonControls( camera );
        controls.movementSpeed = 70;
        controls.lookSpeed = 0.08;

        var img = new Image();
        img.onload = function(){
            Terrain.getHeightFromImg(img);

            plane_geom = new THREE.PlaneGeometry(Terrain.width, Terrain.height, 200, 200);
            for(var i=0;i<plane_geom.vertices.length;i++){
                plane_geom.vertices[i].z = Terrain.heightDate2D[i];
            }
            plane_geom.computeFaceNormals();
            plane_geom.computeVertexNormals();
            var texture = THREE.ImageUtils.loadTexture( "old_files/assets/delTex.jpg" );
            plane_mat = new THREE.MeshPhongMaterial( { opacity:1, map: texture, color: 0x999999, ambient: 0xcccccc, specular: 0xfff9c2, shininess: 5, shading: THREE.SmoothShading } );


            //make a cube
            plane_geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
            plane = new THREE.Mesh( plane_geom, plane_mat);
            scene.add(plane);

            camera.position.y = 670;
            camera.position.z = 590;

            //plane_mat =  new THREE.MeshNormalMaterial( {color: 0x999999,wireframe: false } );
            plane = new THREE.Mesh(plane_geom, plane_mat);
            scene.add(plane);

            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.shadowCameraVisible = true;
            light.position.set(0,300,100);
            scene.add(light);
            render = new THREE.WebGLRenderer();
            render.setClearColor( 0xFFFFFF );
            render.setSize(window.innerWidth, window.innerHeight);

            container.appendChild(render.domElement);stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            container.appendChild( stats.domElement );
        }
        img.src = "old_files/assets/vulkan.png";

    }

    init();
    animate();
    function animate(){
        requestAnimationFrame(animate);
        stats.update();
        renderGo();
    }
    function renderGo(){
        controls.update(clock.getDelta());
        render.render(scene, camera);
    }
});
