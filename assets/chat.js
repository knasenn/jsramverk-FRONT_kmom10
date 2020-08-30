//connection
var socket = io.connect("http://localhost:4000");
//Dom element
var output = document.getElementById("output");
//Listen
console.log("test");
socket.on("korv", function(data){
    // let korv = data.toFixed(2);
    console.log("korv");
    console.log(data[7]);
    console.log(data[7][1]);
    let korv = data[7][1].toFixed(2);
    output.innerHTML = String(korv)+" kr";
});
