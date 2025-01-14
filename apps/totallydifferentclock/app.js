const storage = require("Storage");
const isWeatherOld = require("fn-timeService.js").isWeatherOld;
const unixToHumanReadable = require("fn-timeService.js").unixToHumanReadable;
const logDebug = require("fn-logDebug.js").logDebug;
const loadNamedays = require("fn-calendarService.js").resolveCalendarData;
const getGPS = require("fn-gpsService.js").getGPS;
const drawClock = require("fn-drawClock.js").drawClock;

// Constants for the API URL
const config = storage.readJSON("weather-key.json", 1);

let isShortVersion = true; // Track whether we're using the short or long version
let namedays = loadNamedays(isShortVersion);
let currentTemp = null;
let sunsetTime = null;
let gps = null;
let weatherUpdatedAt = null;

// Function to convert Unix timestamp to HH:MM format
function fetchWeather() {
  if (!isWeatherOld(weatherUpdatedAt, new Date().getTime())) return;
  logDebug("Fetching weather data...");
  getGPS()
    .then((gpsData) => {
      logDebug("Fetching with gps data: " + JSON.stringify(gpsData));
      let gpsString = JSON.stringify(gpsData);
      gps = JSON.parse(gpsString);
      console.log("GPS data: " + gps.lon);
      logDebug("GPS.lon data: " + gps.lon);
      if (gps.lat !== null || gps.lon !== null) {
        let API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=${gps.lat}&lon=${gps.lon}&units=metric&exclude=minutely,hourly,daily&appid=${config.appid}`;
        logDebug("Starting weather fetch from " + API_URL);
        Bangle.http(API_URL)
          .then((response) => {
            // logDebug("Weather response payload received stringify: " + JSON.stringify(response));
            const responseStringified = JSON.stringify(response);
            const responseParsed = JSON.parse(responseStringified);
            logDebug("Printujem resp: " + responseParsed.resp);
            const weatherData = JSON.parse(responseParsed.resp);

            currentTemp = weatherData.current.temp;
            sunsetTime = unixToHumanReadable(weatherData.current.sunset);
            weatherUpdatedAt = gps.time;
          })
          .catch((error) => {
            logDebug("Error fetching weather data: " + error);
          });
      } else {
        logDebug("Weather fetch disabled. Mocking the weather...");
        const weatherPayload =
          '{"t":"http","id":"90505003137","resp":"{\\"lat\\":49.2946,\\"lon\\":21.275,\\"timezone\\":\\"Europe/Bratislava\\",\\"timezone_offset\\":3600,\\"current\\":{\\"dt\\":1735949164,\\"sunrise\\":1735972189,\\"sunset\\":1736002171,\\"temp\\":-0.32,\\"feels_like\\":-2.92,\\"pressure\\":1015,\\"humidity\\":89,\\"dew_point\\":-1.72,\\"uvi\\":0,\\"clouds\\":31,\\"visibility\\":10000,\\"wind_speed\\":2.07,\\"wind_deg\\":271,\\"wind_gust\\":3.43,\\"weather\\":[{\\"id\\":802,\\"main\\":\\"Clouds\\",\\"description\\":\\"scattered clouds\\",\\"icon\\":\\"03n\\"}]},\\"alerts\\":[{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate icing warning\\",\\"start\\":1735924500,\\"end\\":1735977600,\\"description\\":\\"We expect icing in district Bardejov.\\\\nGround ice represents potential risk for human activities.\\",\\"tags\\":[\\"Snow/Ice\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate warning\\",\\"start\\":1735935900,\\"end\\":1735974000,\\"description\\":\\"We expect snow-drifts in district Bardejov.\\\\nSnow-drifts represent potential risk for transport activities.\\",\\"tags\\":[\\"Other dangers\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate low temperature warning\\",\\"start\\":1736103600,\\"end\\":1736136000,\\"description\\":\\"We expect frost -15 - -16 \u00B0C in district Bardejov,\\\\nthat represents potential risk for human health during outdoor activities.\\",\\"tags\\":[\\"Extreme low temperature\\"]},{\\"sender_name\\":\\"Slovensk\u00FD Hydrometeorologick\u00FD \u00FAstav\\",\\"event\\":\\"Moderate icing warning\\",\\"start\\":1736092800,\\"end\\":1736161200,\\"description\\":\\"We expect icing in district Bardejov.\\\\nGround ice represents potential risk for human activities.\\",\\"tags\\":[\\"Snow/Ice\\"]}]}"}';

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
          currentTemp = weatherData.current.temp;
          sunsetTime = unixToHumanReadable(weatherData.current.sunset);
        } catch (error) {
          logDebug("Error processing weather payload:" + error);
        }
      }
    })
    .catch((error) => {
      console.error("GPS Error: ", error.message);
    });
}

// Function to handle screen tap (switch nameday version)
function onScreenTap() {
  // Toggle between short and long versions of the nameday
  isShortVersion = !isShortVersion;

  // Load short/long version of the nameday data
  namedays = loadNamedays(isShortVersion);

  // Redraw the clock with updated nameday and font size
  drawClock(isShortVersion, currentTemp, sunsetTime, gps, weatherUpdatedAt);
}

// Clear the screen once, at startup
g.clear();

// Attach the tap event handler
Bangle.on("touch", onScreenTap);

// Initial loading of namedays
//loadNamedays(isShortVersion);

// Fetch weather data when the app starts
// fetchWeather();

// Refresh the clock every minute
setInterval(() => {
  drawClock(isShortVersion, currentTemp, sunsetTime, gps, weatherUpdatedAt);
}, 60000);

// Optionally, refresh weather every 1.5 minutes
setInterval(fetchWeather, 1.5 * 60 * 1000);

// Show launcher when button pressed
Bangle.setUI("clock");
Bangle.loadWidgets();
Bangle.drawWidgets();
// Draw immediately when the app starts
drawClock(isShortVersion, currentTemp, sunsetTime, gps, weatherUpdatedAt);
logDebug(
  "--------------- Totally Different Clock app started.--------------------",
);
