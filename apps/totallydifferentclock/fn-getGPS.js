const logDebug = require('fn-logDebug.js').logDebug;

exports.getGPS = () => {
    return new Promise((resolve, reject) => {
        Bangle.on('GPS', function handler(gpsData) {
            Bangle.removeListener('GPS', handler);
            resolve(gpsData);
            logDebug("GPS data received: " + JSON.stringify(gpsData));
        });
        Bangle.setGPSPower(1);
    });
}
