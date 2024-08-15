const storage = require("Storage");

// Constants for the API URL
const config = storage.readJSON('weather-key.json', 1);
const API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=49.2946&lon=21.275&units=metric&exclude=minutely&appid=${config.appid}`;

// Variables for namedays and weather
let namedays;
let isShortVersion = true;  // Track whether we're using the short or long version
let currentTemp = null;
let sunsetTime = null;

// Function to load nameday JSON file
function loadNamedays() {
    let fileName = isShortVersion ? "meniny-short.json" : "meniny-long.json";
    try {
        namedays = storage.readJSON(fileName, 1);
    } catch (e) {
        console.log("Failed to load namedays data from " + fileName);
        namedays = {};  // Fallback in case of error
    }
}

// Function to get the nameday for the current date
function getNameday() {
    const now = new Date();
    const month = now.getMonth();  // 0-11
    const day = now.getDate();     // 1-31
    if (namedays && namedays[month] && namedays[month][day]) {
        return namedays[month][day];
    } else {
        return "No Nameday";
    }
}

// Function to convert Unix timestamp to HH:MM format
function formatTime(unixTime) {
    const date = new Date(unixTime * 1000); // Convert to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
}

// Function to fetch weather data from the API
function fetchWeather() {
    require("http").get(API_URL, function (res) {
        let data = "";

        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('close', function () {
            try {
                // Parse the response
                const weatherData = JSON.parse(data);

                // Extract temperature and sunset time
                currentTemp = weatherData.current.temp;
                sunsetTime = formatTime(weatherData.current.sunset);

                // Redraw the screen with the new weather data
                drawClock();
            } catch (e) {
                console.log("Error parsing weather data: " + e);
            }
        });
    });
}

// Function to draw the clock, nameday, and weather
function drawClock() {
    g.clear();

    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Format time to HH:MM
    const timeStr = ("0" + hours).substr(-2) + ":" + ("0" + minutes).substr(-2);

    // Display time at the top
    g.setFont("Vector", 40);      // Set font size for the clock
    g.setFontAlign(0, 0);         // Center alignment
    g.drawString(timeStr, g.getWidth() / 2, g.getHeight() / 8); // Draw in upper part

    // Display nameday
    const nameday = getNameday();
    const fontSize = isShortVersion ? 30 : 15;  // 30 for short version, 15 for long version
    g.setFont("Vector", fontSize);   // Set the appropriate font size
    g.drawString(nameday, g.getWidth() / 2, g.getHeight() / 2); // Draw in middle part

    // Display weather (temperature and sunset) at the bottom
    if (currentTemp !== null && sunsetTime !== null) {
        g.setFont("Vector", 20);  // Set smaller font size for weather
        g.drawString(`${currentTemp.toFixed(1)}°C, Sunset: ${sunsetTime}`, g.getWidth() / 2, (7 * g.getHeight()) / 8);
    } else {
        g.setFont("Vector", 20);
        g.drawString("Loading weather...", g.getWidth() / 2, (7 * g.getHeight()) / 8);
    }

    // Update display
    g.flip();
}

// Function to handle screen tap (switch nameday version)
function onScreenTap() {
    // Toggle between short and long versions of the nameday
    isShortVersion = !isShortVersion;

    // Reload the nameday data
    loadNamedays();

    // Redraw the clock with updated nameday and font size
    drawClock();
}

// Attach the tap event handler
Bangle.on('touch', onScreenTap);

// Initial loading of namedays
loadNamedays();

// Fetch weather data when the app starts
fetchWeather();

// Refresh the clock every second
setInterval(drawClock, 1000);

// Optionally, refresh weather every 10 minutes
setInterval(fetchWeather, 10 * 60 * 1000);

// Draw immediately when the app starts
drawClock();
