const storage = require("Storage");
const LOG_FILE = "debug.log";

// Function to write a debug message to a file
exports.logDebug = (message) => {
    // Get current date
    let date = new Date();

    // Format date with local timezone offset
    // This creates a more readable timestamp in local time
    let timeStr = date.toLocaleString();

    let logEntry = timeStr + " - " + message + "\n";

    // Read the existing log file, if it exists
    let existingLog = storage.read(LOG_FILE) || "";

    // Check if the log file exceeds 10,000 bytes
    if (existingLog.length > 10000) {
        // Split the log into lines
        let logLines = existingLog.split("\n");
        // Remove the first ten lines
        logLines = logLines.slice(10);
        // Join the remaining lines back into a string
        existingLog = logLines.join("\n");
    }

    storage.write(LOG_FILE, existingLog + logEntry);
}
