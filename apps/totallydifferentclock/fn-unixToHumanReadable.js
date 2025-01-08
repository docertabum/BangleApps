const logDebug = require('fn-logDebug.js').logDebug;

exports.unixToHumanReadable = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    logDebug("Converting Unix timestamp to human readable format: " + date);
    return `${date.getHours()}:${date.getMinutes()}`;
};

exports.isWeatherOld = (unixTimestampOld, unixTimestampNew) => {
    logDebug("Checking if the weather is old...");
    // return unixTimestampNew - unixTimestampOld > 3600; // If the difference is more than 1 hour, the weather is considered old
    return unixTimestampNew - unixTimestampOld > 120; // If the difference is more than 2 minutes, the weather is considered old
};

