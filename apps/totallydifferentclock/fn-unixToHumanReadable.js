const logDebug = require('fn-logDebug.js').logDebug;

exports.unixToHumanReadable = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    logDebug("Converting Unix timestamp to human readable format: " + date);
    return `${date.getHours()}:${date.getMinutes()}`;
};
