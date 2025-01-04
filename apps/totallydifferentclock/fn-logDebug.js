const storage = require("Storage");
const LOG_FILE = "debug.log";

// Function to write a debug message to a file
exports.logDebug = (message) => {
    let date = new Date();
    date.setHours(date.getHours() + 1);
    let logEntry = date.toISOString() + " - " + message + "\n";
    // Read the existing log file, if it exists
    let existingLog = storage.read(LOG_FILE) || "";
    // Append the new log entry

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
