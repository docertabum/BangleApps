const storage = require("Storage");

// Constants for the API URL
const config = storage.readJSON('weather-key.json', 1);
const API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=49.2946&lon=21.275&units=metric&exclude=minutely,hourly,daily&appid=${config.appid}`;

// Variables for namedays and weather
let namedays;
let isShortVersion = true;  // Track whether we're using the short or long version
let currentTemp = null;
let sunsetTime = null;

// debuging
// Define the log file name
const LOG_FILE = "debug.log";

// Function to write a debug message to a file
function logDebug(message) {
    let logEntry = new Date().toISOString() + " - " + message + "\n";

    // Read the existing log file, if it exists
    let existingLog = storage.read(LOG_FILE) || "";

    // Append the new log entry
    storage.write(LOG_FILE, existingLog + logEntry);
}

// Function to load nameday JSON file
function loadNamedays() {
    logDebug("Loading namedays...");
    let fileName = isShortVersion ? "meniny-short.json" : "meniny-long.json";
    try {
        namedays = storage.readJSON(fileName, 1);
    } catch (e) {
        logDebug("Failed to load namedays data from " + fileName);
        namedays = {};  // Fallback in case of error
    }
}

// Function to get the nameday for the current date
function getNameday() {
    logDebug("Getting nameday...");
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
function fetchWeather() {
    if (true) {
        logDebug("Starting weather fetch from " + API_URL);
        Bangle.http(API_URL)
            .then(response => {
                logDebug("Weather response payload received stringify: " + JSON.stringify(response));
                const responseStringified = JSON.stringify(response);
                const responseParsed = JSON.parse(responseStringified);
                logDebug("Printujem resp: " + responseParsed.resp);
                const weatherData = JSON.parse(responseParsed.resp);

                currentTemp = weatherData.current.temp;
                sunsetTime = unixToHumanReadable(weatherData.current.sunset);
                // drawWeather(currentTemp, sunsetTime);
            })
            .catch(error => {
                logDebug("Error fetching weather data: " + error);
                // drawWeather(null, null);
            });
    } else {
        logDebug("Weather fetch disabled. Mocking the weather...");
        const weatherPayload = '{"t":"http","id":"90505003137","resp":"{\\"lat\\":49.2946,\\"lon\\":21.275,\\"timezone\\":\\"Europe/Bratislava\\",\\"timezone_offset\\":3600,\\"current\\":{\\"dt\\":1735949164,\\"sunrise\\":1735972189,\\"sunset\\":1736002171,\\"temp\\":-0.32,\\"feels_like\\":-2.92,\\"pressure\\":1015,\\"humidity\\":89,\\"dew_point\\":-1.72,\\"uvi\\":0,\\"clouds\\":31,\\"visibility\\":10000,\\"wind_speed\\":2.07,\\"wind_deg\\":271,\\"wind_gust\\":3.43,\\"weather\\":[{\\"id\\":802,\\"main\\":\\"Clouds\\",\\"description\\":\\"scattered clouds\\",\\"icon\\":\\"03n\\"}]},\\"alerts\\":[{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate icing warning\\",\\"start\\":1735924500,\\"end\\":1735977600,\\"description\\":\\"We expect icing in district Bardejov.\\\\nGround ice represents potential risk for human activities.\\",\\"tags\\":[\\"Snow/Ice\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate warning\\",\\"start\\":1735935900,\\"end\\":1735974000,\\"description\\":\\"We expect snow-drifts in district Bardejov.\\\\nSnow-drifts represent potential risk for transport activities.\\",\\"tags\\":[\\"Other dangers\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate low temperature warning\\",\\"start\\":1736103600,\\"end\\":1736136000,\\"description\\":\\"We expect frost -15 - -16 \u00B0C in district Bardejov,\\\\nthat represents potential risk for human health during outdoor activities.\\",\\"tags\\":[\\"Extreme low temperature\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate icing warning\\",\\"start\\":1736092800,\\"end\\":1736161200,\\"description\\":\\"We expect icing in district Bardejov.\\\\nGround ice represents potential risk for human activities.\\",\\"tags\\":[\\"Snow/Ice\\"]}]}"}';

        try {
            logDebug("Weather payload before parsing:\n" + weatherPayload);

            // Parse the outer JSON
            const parsedPayload = JSON.parse(weatherPayload);
            logDebug("Parsed payload:\n" + parsedPayload);

            // Parse the "resp" field
            const weatherData = JSON.parse(parsedPayload.resp); // Parse "resp" here
            logDebug("Parsed weather data:\n" + weatherData);

            // Access the keys and properties
            logDebug("Keys in weatherData:" + Object.keys(weatherData));
            logDebug("Current weather data:" + weatherData.current);
            logDebug("Current temperature:" + weatherData.current.temp); // Access temperature here
        } catch (error) {
            logDebug("Error processing weather payload:" + error);
        }
    }
}

function performHttpBin() {
    logDebug("Performing HTTP request to httpbin.org...");
    Bangle.http("https://httpbin.org/get")
        .then(response => {
            logDebug("Response: " + JSON.parse(response));
        })
        .catch(error => {
            logDebug("Error: " + error);
        });
}

// Function to draw the weather data on the screen
function drawWeather(temp, sunsetTime) {
    logDebug("Drawing weather on the screen: " + temp + " " + sunsetTime);
    g.clear();

    // Display temperature at the top
    g.setFont("Vector", 40);      // Set large font size for temperature
    g.setFontAlign(0, 0);         // Center alignment
    g.drawString(temp !== null ? `${temp.toFixed(1)}°C` : "Loading temp...", g.getWidth() / 2, g.getHeight() / 4); // Draw in upper part

    // Display sunset time at the bottom
    g.setFont("Vector", 30);      // Set font size for sunset time
    g.drawString(sunsetTime !== null ? `Sunset: ${sunsetTime}` : "Loading sunset...", g.getWidth() / 2, (3 * g.getHeight()) / 4); // Draw in lower part

    // Update display
    g.flip();
}

// Function to draw the clock, nameday, and weather
function drawClock() {
    logDebug("Drawing the clock...");
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
        g.setFont("Vector", 10);  // Set smaller font size for weather
        g.drawString(`${currentTemp.toFixed(1)}°C, Sunset: ${sunsetTime}`, g.getWidth() / 2, (7 * g.getHeight()) / 8);
    } else {
        g.setFont("Vector", 10);
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

function unixToHumanReadable(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    logDebug("Converting Unix timestamp to human readable format: " + date);
    return date.toLocaleDateString("sk-SK");
}

// Attach the tap event handler
Bangle.on('touch', onScreenTap);

// Initial loading of namedays
loadNamedays();

// Fetch weather data when the app starts
// fetchWeather();

// Refresh the clock every minute
setInterval(drawClock, 60000);

// Optionally, refresh weather every 1.5 minutes
setInterval(fetchWeather, 1.5 * 60 * 1000);


// Show launcher when button pressed
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
// Draw immediately when the app starts
drawClock();
