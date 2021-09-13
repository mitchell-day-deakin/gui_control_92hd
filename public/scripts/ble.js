function log(msg) {
    container = document.getElementById("msg");

    if (msg == "clear") {
        container.innerHTML = "";
    } else {
        const p = document.createElement('p');
        p.innerHTML = msg;
        container.prepend(p);
    }

    
}



function BLE() {
    let deviceCache = null;
    let characteristicCache = null;


    //connect to device
    let connect = () => {
        return deviceCache ? Promise.resolve(deviceCache) :
            requestBluetoothDevice()
                .then(device => { connectDeviceAndCacheCharacteristic(device) })
                .then(characterristic => { startNotifications(characterristic) })
                .catch(error => console.log(error));

    }



    function handleDisconnection() {
        let device = event.target;

        log('"' + device.name +
            '" bluetooth device disconnected, trying to reconnect...');

        connectDeviceAndCacheCharacteristic(device).
            then(characteristic => startNotifications(characteristic)).
            catch(error => log(error));
    }



    //disconnect from device
    let disconnect = () => {
        if (deviceCache) {
            log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
            deviceCache.removeEventListener('gattserverdisconnected',
                handleDisconnection);

            if (deviceCache.gatt.connected) {
                deviceCache.gatt.disconnect();
                log('"' + deviceCache.name + '" bluetooth device disconnected');
            }
            else {
                log('"' + deviceCache.name +
                    '" bluetooth device is already disconnected');
            }
        }
        log("clear");
        characteristicCache = null;
        deviceCache = null;
    }



    let requestBluetoothDevice = () => {
        log("Request BLE device");

        return navigator.bluetooth.requestDevice({
            filters: [{ services: [0xFFE0] }]
        })
            .then(device => {
                log(device.name);
                deviceCache = device;
                return deviceCache;
            })
    }



    let connectDeviceAndCacheCharacteristic = (device) => {
        if (device.gatt.connected && characteristicCache) {
            return Promise.resolve(characteristicCache);
        }

        log('Connecting to GATT server...');

        return device.gatt.connect().
            then(server => {
                log('GATT server connected, getting service...');

                return server.getPrimaryService(0xFFE0);
            }).
            then(service => {
                log('Service found, getting characteristic...');

                return service.getCharacteristic(0xFFE1);
            }).
            then(characteristic => {
                log('Characteristic found');
                characteristicCache = characteristic;

                return characteristicCache;
            });
    }




    let startNotifications = (characterristic) => {
        log('Starting notifications...');

        return characteristic.startNotifications().
            then(() => {
                log('Notifications started');
            });
    }


    const send = (data) => {
        data = String(data);

        if (!data || !characteristicCache) {
            return;
        }

        data += '\n';

        if (data.length > 20) {
            let chunks = data.match(/(.|[\r\n]){1,20}/g);

            writeToCharacteristic(characteristicCache, chunks[0]);

            for (let i = 1; i < chunks.length; i++) {
                setTimeout(() => {
                    writeToCharacteristic(characteristicCache, chunks[i]);
                }, i * 100);
            }
        }
        else {
            writeToCharacteristic(characteristicCache, data);
        }

        log(data, 'out');
    }




    function writeToCharacteristic(characteristic, data) {
        characteristic.writeValue(new TextEncoder().encode(data));
    }


    //public methods and attributes
    return {
        requestBluetoothDevice,
        connect,
        disconnect,
        send,
        connectDeviceAndCacheCharacteristic,
        startNotifications,
    }
}

//const ble = BLE();

