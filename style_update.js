const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

const regex = /\/\* ===========================[\s\S]*?WEATHER BAR[\s\S]*?=========================== \*\/[\s\S]*?(?=\/\* ===========================|$)/;

const newStyles = `/* ===========================
   WEATHER BAR
   =========================== */
.weather-bar {
  background: linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  position: relative;
  z-index: 100;
}
.weather-bar-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.weather-date {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
}
.date-main {
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.5px;
}
.time-main {
  background: rgba(255,255,255,0.1);
  padding: 2px 8px;
  border-radius: 6px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  color: #cbd5e1;
}
.weather-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.weather-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.3));
}
.weather-city {
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.5px;
}
.weather-temp {
  background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%);
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(244, 63, 94, 0.4);
}
.weather-desc {
  color: #bae6fd;
  font-style: italic;
  font-weight: 400;
}
.weather-wind {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
  background: rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 12px;
}

`;

if(regex.test(css)) {
   css = css.replace(regex, newStyles);
   fs.writeFileSync('styles.css', css, 'utf8');
   console.log("Weather bar design successfully updated!");
} else {
   console.log("Could not find the weather bar CSS section.");
}
