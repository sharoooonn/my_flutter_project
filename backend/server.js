// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Allow requests from local dev frontend origin (adjust port if needed)
app.use(cors());

// Example current_data endpoint. Replace this with actual sensor/device response if you have it.
app.get('/current_data', (req, res) => {
  // Example JSON - adjust fields to match your real endpoint structure
  const sample = {
    location: "Local Sensor",
    temperature_c: 27.4,
    humidity: 62,
    pressure: 1013,
    wind_speed: 2.5,
    description: "Partly cloudy",
    timestamp: new Date().toISOString()
  };
  res.json(sample);
});

// Optional: health check
app.get('/', (req, res) => res.send('Backend running'));

// Start server on all interfaces (0.0.0.0) at port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
