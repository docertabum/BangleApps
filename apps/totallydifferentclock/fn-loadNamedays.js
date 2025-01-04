const storage = require("Storage");
const {logDebug} = require("./fn-logDebug");

// Function to load nameday JSON file
exports.loadNamedays = (isShortVersion) => {
    logDebug("Loading namedays...");
    let fileName = isShortVersion ? "meniny-short.json" : "meniny-long.json";
    try {
        return storage.readJSON(fileName, 1);
    } catch (e) {
        logDebug("Failed to load namedays data from " + fileName);
        return {};  // Fallback in case of error
    }
}
