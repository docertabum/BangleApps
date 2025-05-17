const logDebug = require('fn-logDebug.js').logDebug;

exports.unixToHumanReadable = (unixTimestamp) => {
    // Check if the timestamp is in milliseconds or seconds
    const timestamp = unixTimestamp > 9999999999 ? unixTimestamp : unixTimestamp * 1000;
    const date = new Date(timestamp);
    logDebug("Converting Unix timestamp to human readable format: " + date);
    return `${date.getHours()}:${date.getMinutes()}`;
};

// TODO check if undefined is necessary to check
exports.isWeatherOld = (unixTimestampOld, unixTimestampNew) => {
    if (unixTimestampOld === undefined || unixTimestampOld === null) {
        logDebug("Old weather timestamp is missing...");
        return true;
    }
    logDebug("Checking if the weather is old...");
    // return unixTimestampNew - unixTimestampOld > 3600; // If the difference is more than 1 hour, the weather is considered old
    return unixTimestampNew - unixTimestampOld > 120; // If the difference is more than 2 minutes, the weather is considered old
};

// convert ISO date ("2025-01-14T08:16:48.087Z") to time
exports.isoToTime = (isoDate) => {
    const date = new Date(isoDate);

// Extract hours and minutes
    const hours = date.getUTCHours(); // Use `getHours()` if you want the local time
    const minutes = date.getUTCMinutes(); // Use `getMinutes()` for local time

// Format as "hour:minute" with leading zero for minutes if needed
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

exports.isoTimeToUnixTime = (isoToTime) => {
   // const isoDate = "2025-01-14T08:16:48.087Z";
    const date = new Date(isoToTime);

// Convert to milliseconds since Unix Epoch
    return date.getTime();
}
