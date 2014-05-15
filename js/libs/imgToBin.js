var oReq = new XMLHttpRequest();
oReq.open("GET", "assets/besseggen.png", true);
oReq.responseType = "arraybuffer";
var array = [];
oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteArray.byteLength; i++) {
            array[i] = byteArray[i] / 65535 * 100;
        }
    }
    console.log(array);
};

oReq.send(null);