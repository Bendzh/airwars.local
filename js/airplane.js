Airplane = {
    mesh            : null,
    modelSrc        : "js/model/kk1.js",
    geometry        : null,
    material        : null,
    x               : 0,
    y               : 15000,
    z               : 0,

    loadAirPlane    : function(){
        var loader = new THREE.JSONLoader;
        loader.load(Airplane.modelSrc, function(geo, mat){
            Airplane.geometry = geo;
            Airplane.material = new THREE.MeshFaceMaterial( mat );
            Airplane.mesh = new THREE.Mesh(Airplane.geometry, Airplane.material);
            Airplane.setPosition(0, 15000, 0);
            World.add(Airplane.mesh);
        });
    },
    setPosition     : function(x, y, z){
        Airplane.x = (x) ? x : Airplane.x;
        Airplane.y = (x) ? y : Airplane.y;
        Airplane.z = (z) ? z : Airplane.z;

        Airplane.mesh.position.set(Airplane.x, Airplane.y, Airplane.z);
    }
}