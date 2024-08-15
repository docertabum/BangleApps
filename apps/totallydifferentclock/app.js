const storage = require("Storage");

let namedays;
let isShortVersion = true;  // Track whether we're using the short or long version

// Function to load nameday JSON file
function loadNamedays() {
  let fileName = isShortVersion ? "./resources/meniny-short.json" : "./resources/meniny-long.json";
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

// Function to draw the clock
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
  g.drawString(timeStr, g.getWidth() / 2, g.getHeight() / 4); // Draw in upper part

  // Display nameday at the bottom
  const nameday = getNameday();

  // Adjust font size depending on whether short or long version
  const fontSize = isShortVersion ? 30 : 15;  // 30 for short version, 15 for long version
  g.setFont("Vector", fontSize);   // Set the appropriate font size
  g.drawString(nameday, g.getWidth() / 2, (3 * g.getHeight()) / 4); // Draw in lower part

  // Update display
  g.flip();
}

// Function to handle screen tap
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

// Refresh the clock every second
setInterval(drawClock, 1000);

// Draw immediately when the app starts
drawClock();
