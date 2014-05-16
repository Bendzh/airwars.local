Terrain = {
    width           : 16000,
    height          : 18000,
    wSegments       : 39,
    hSegments       : 49,
    heightMap       : new Image(),
    heightMapSrc    : "../textures/terrain/hm1.png",
    heightData      : null,
    geometry        : null,
    material        : null,
    texture         : null,
    textureSrc      : "../textures/terrain/7572-v2.jpg",
    mesh            : null,

    getHeightDateFromImg : function(img){
        var canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 55;
        var context = canvas.getContext('2d');

        var size = 40 * 50, data = new Float32Array(size);

        context.drawImage(img, 0, 0);

        for (var i = 0; i < size; i++) {
            data[i] = 0
        }

        var imgd = context.getImageData(0, 0, 40, 50);
        var pix = imgd.data;

        var j = 0;
        for (var i = 0, n = pix.length; i < n; i += (4)) {
            var all = pix[i] + pix[i + 1] + pix[i + 2];
            data[j++] = all * 18;
        }
        return data;
    },
    loadTerrain : function(){
        Terrain.heightMap.src = Terrain.heightMapSrc;
        Terrain.heightMap.onload = function () {
            Terrain.heightData = Terrain.getHeightDateFromImg(Terrain.heightMap);

            Terrain.geometry = new THREE.PlaneGeometry(Terrain.width, Terrain.height, Terrain.wSegments, Terrain.hSegments);

            for (var i = 0, l = Terrain.geometry.vertices.length; i < l; i++) {
                Terrain.geometry.vertices[i].z = Terrain.heightData[i];
            }
            Terrain.geometry.computeFaceNormals();
            Terrain.geometry.computeVertexNormals();

            Terrain.texture = THREE.ImageUtils.loadTexture(Terrain.textureSrc);
            Terrain.texture.wrapS = Terrain.texture.wrapT = THREE.RepeatWrapping;
            Terrain.texture.repeat.set(3, 3);

            Terrain.material = new THREE.MeshPhongMaterial({ opacity: 1, map: Terrain.texture, color: 0x999999, ambient: 0xcccccc, specular: 0xfff9c2, shininess: 5, shading: THREE.SmoothShading });

            Terrain.mesh = new THREE.Mesh(Terrain.geometry, Terrain.material);
            Terrain.mesh.rotation.set(-Math.PI / 2, 0, 0);
            Terrain.mesh.position.y = -300;
            Terrain.mesh.position.z = -30000;
            World.add(Terrain.mesh);
        };
    }
}