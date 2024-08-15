const storage = require("Storage");
let namedays, helloText;

try {
  // Load namedays data
  namedays = storage.readJSON("meniny-short.json", 1);

  // Load hello.txt content
  helloText = storage.read("hello.txt") || "No message";
} catch (e) {
  console.log("Failed to load data:", e);
  helloText = "Error loading message";
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

  // Display nameday in the middle
  const nameday = getNameday();
  g.setFont("Vector", 30);      // Set font size for the nameday
  g.drawString(nameday, g.getWidth() / 2, (2 * g.getHeight()) / 4); // Draw in middle part

  // Display hello.txt content at the bottom
  g.setFont("Vector", 20);      // Set font size for the message
  g.drawString(helloText, g.getWidth() / 2, (3 * g.getHeight()) / 4); // Draw in lower part

  // Update display
  g.flip();
}

// Refresh the clock every second
setInterval(drawClock, 1000);

// Draw immediately when the app starts
drawClock();
