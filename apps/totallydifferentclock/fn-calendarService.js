const storage = require("Storage");
const logDebug = require('fn-logDebug.js').logDebug;

// Function to load nameday JSON file
exports.resolveCalendarData = (isShortVersion) => {
    logDebug("Loading calendar data...");
    let fileName = isShortVersion ? "meniny-short.json" : "meniny-long.json";
    try {
        return storage.readJSON(fileName, 1);
    } catch (e) {
        logDebug("Failed to load calendar data from " + fileName);
        return {};  // Fallback in case of error
    }
}

// Function to get the nameday for the current date
exports.getNameday = (calendar) => {
    logDebug("Getting nameday...");
    const now = new Date();
    const month = now.getMonth();  // 0-11
    const day = now.getDate();     // 1-31
    if (calendar && calendar[month] && calendar[month][day]) {
        return calendar[month][day];
    } else {
        return "No Nameday";
    }
}
