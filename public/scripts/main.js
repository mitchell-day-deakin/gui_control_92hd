const ble = BLE();
const timeDiv = document.getElementById("time");


function sendCommand(msg){
    const time = timeDiv.value;
    console.log(time)
    if(!time || time==null || time==undefined) return;
    setTimeout(()=>{
        ble.send("stop")
    }, time*1000);

    ble.send(msg);
    return
}



document.getElementById("forward").onclick = (_=>{
    log("Sending forward command for "+ timeDiv.value);
    sendCommand("forward")
})

document.getElementById("reverse").onclick = (_=>{
    log("Sending reverse command for "+ timeDiv.value);
    sendCommand("backward")
})

document.getElementById("left").onclick = (_=>{
    log("Sending left command for "+ timeDiv.value);
    sendCommand("left")
})
document.getElementById("right").onclick = (_=>{
    log("Sending right command for "+ timeDiv.value);
    sendCommand("right")
})