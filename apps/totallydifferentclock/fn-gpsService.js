const logDebug = require('fn-logDebug.js').logDebug;

exports.getGPS = () => {
    return new Promise((resolve, reject) => {
        Bangle.setGPSPower(true, "totallydifferentclock");
        Bangle.on('GPS', function handler(gpsData) {
            Bangle.removeListener('GPS', handler);
            Bangle.setGPSPower(false, "totallydifferentclock"); // Turn off GPS to save battery
            resolve(gpsData);
            logDebug("GPS data received: " + JSON.stringify(gpsData));
        });
    });
}
