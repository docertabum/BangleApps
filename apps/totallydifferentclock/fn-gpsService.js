const logDebug = require('fn-logDebug.js').logDebug;

exports.getGPS = (timeout = 10000, powerTag = "totallydifferentclock") => {
    return new Promise((resolve, reject) => {
        logDebug("Enabling GPS...");
        Bangle.setGPSPower(true, powerTag);

        const timer = setTimeout(() => {
            Bangle.removeListener('GPS', handler);
            Bangle.setGPSPower(false, powerTag);
            const errorMessage = "GPS timeout: No data received within " + timeout + "ms.";
            logDebug(errorMessage);
            reject(new Error(errorMessage));
        }, timeout);

        const handler = (gpsData) => {
            clearTimeout(timer); // Cancel the timeout if GPS data is received
            Bangle.removeListener('GPS', handler);
            Bangle.setGPSPower(false, powerTag);
            logDebug("GPS data received: " + JSON.stringify(gpsData));
            resolve(gpsData);
        };

        Bangle.on('GPS', handler);
    });
};
