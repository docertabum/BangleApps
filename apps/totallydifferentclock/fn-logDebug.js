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
    storage.write(LOG_FILE, existingLog + logEntry);
}
