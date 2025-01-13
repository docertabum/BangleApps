const unixToHumanReadable = require('fn-unixToHumanReadable.js').unixToHumanReadable;
const logDebug = require('fn-logDebug.js').logDebug;
const getNameday = require('fn-calendarService.js').getNameday;
const resolveCalendarData = require('fn-calendarService.js').resolveCalendarData;


// Function to draw the clock, nameday, and weather (176x176px)
exports.drawClock = (isShortVersion, currentTemp, sunsetTime, gpsData, weatherUpdatedAt) => {
    logDebug("Drawing the clock...");
    g.clear();

    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Format time to HH:MM
    const timeStr = ("0" + hours).substr(-2) + ":" + ("0" + minutes).substr(-2);

    // Display time at the top
    g.setBgColor(1, 1, 1); // White background
    g.setColor(0, 0, 0);   // Black text                                // Set background color
    g.setFont("Vector", 40);                                   // Set font size for the clock
    g.setFontAlign(0, 0);                                           // Center alignment
    g.drawString(timeStr, g.getWidth() / 2, g.getHeight() / 8);    // Draw in upper part

    // Display nameday
    const nameday = getNameday(resolveCalendarData(isShortVersion)); // Get nameday
    const fontSize = isShortVersion ? 30 : 15;                      // 30 for short version, 15 for long version
    g.setFont("Vector", fontSize);                                    // Set the appropriate font size
    g.drawString(nameday, g.getWidth() / 2, g.getHeight() / 2);     // Draw in middle part

    // Display weather (temperature and sunset) at the bottom
    g.setFont("Vector", 10);
    if (gpsData !== undefined && gpsData !== null && gpsData.lat !== 0 && gpsData.lon !== 0) {
        g.drawString("GPS: " + gpsData, g.getWidth() / 2, (5 * g.getHeight()) / 8);
    } else {
        g.drawString("GPS data missing...", g.getWidth() / 2, (5 * g.getHeight()) / 8);
    }

    // Display current temperature and sunset time
    if (currentTemp !== null && currentTemp !== undefined && sunsetTime !== null) {
        g.drawString(`${currentTemp.toFixed(1)}°C, Sunset: ${sunsetTime}`, g.getWidth() / 2, (6 * g.getHeight()) / 8);
    } else {
        g.drawString("Loading weather...", g.getWidth() / 2, (6 * g.getHeight()) / 8);
    }

    // Time when the weather was last updated
    if (weatherUpdatedAt !== null && weatherUpdatedAt !== undefined) {
        g.drawString("Updated at: " + unixToHumanReadable(weatherUpdatedAt), g.getWidth() / 2, (7 * g.getHeight()) / 8);
    } else {
        g.drawString("Update time unknown...", g.getWidth() / 2, (7 * g.getHeight()) / 8);
    }

    // Draw a line at the bottom and top
    g.drawString("Bottom line", g.getWidth() / 2, g.getHeight() - 6); // Draw at the bottom
    g.setColor(0.5,0,5,0.5);
    g.drawLine(0, g.getHeight() - 1, g.getWidth(), g.getHeight() - 2); // Draw a line at the bottom

    // Update display
    g.flip();
}
