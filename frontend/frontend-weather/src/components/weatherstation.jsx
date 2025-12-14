import { useEffect, useState } from "react";
import "./weatherstation.css";

export default function WeatherStation() {
  // ----- LOCAL SENSOR WEATHER -----
  const [localData, setLocalData] = useState(null);

  // ----- INTERNET WEATHER -----
  const [city, setCity] = useState("");
  const [internetWeather, setInternetWeather] = useState(null);
  const [loadingInternet, setLoadingInternet] = useState(false);

  // ----- BACKGROUND IMAGE -----
  const [backgroundImage, setBackgroundImage] = useState("");

  const bgImages = {
    morning: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg",
    afternoon:
      "https://images.pexels.com/photos/34275940/pexels-photo-34275940.jpeg",
    evening: "https://images.pexels.com/photos/3214944/pexels-photo-3214944.jpeg",
    night: "https://images.pexels.com/photos/2670898/pexels-photo-2670898.jpeg",
  };

  // ----- FETCH LOCAL SENSOR WEATHER -----
  useEffect(() => {
    async function fetchLocalWeather() {
      try {
        const res = await fetch("http://192.168.0.103/current_data");
        const data = await res.json();
        setLocalData(data);
      } catch (err) {
        console.error("Local API error:", err);
      }
    }

    fetchLocalWeather();
    const interval = setInterval(fetchLocalWeather, 5000);
    return () => clearInterval(interval);
  }, []);

  // ----- FETCH INTERNET WEATHER -----
  const fetchInternetWeather = async () => {
    if (!city) return;
    setLoadingInternet(true);

    // ✅ API KEY inserted here
    const API_KEY = "5b6acd2592b94a4db4564321251311";

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setInternetWeather(data);
    } catch (error) {
      console.error("Internet weather error:", error);
    }

    setLoadingInternet(false);
  };

  // ----- SET BACKGROUND BASED ON TIME -----
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setBackgroundImage(bgImages.morning);
    else if (hour >= 12 && hour < 17) setBackgroundImage(bgImages.afternoon);
    else if (hour >= 17 && hour < 20) setBackgroundImage(bgImages.evening);
    else setBackgroundImage(bgImages.night);
  }, []);

  return (
    <div
      className="ws-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="ws-content">
        {/* LOCAL SENSOR WEATHER */}
        <div className="glass-card">
          <h2 className="ws-title">Local Sensor Weather</h2>

          {localData ? (
            <div className="ws-info-grid">
              <div className="ws-info-item">
                <span>Temperature</span>
                <h3>{localData.temperature} °C</h3>
              </div>

              <div className="ws-info-item">
                <span>Humidity</span>
                <h3>{localData.humidity} %</h3>
              </div>

              <div className="ws-info-item wide">
                <span>Pressure</span>
                <h3>{localData.pressure_mmHg} mmHg</h3>
              </div>
            </div>
          ) : (
            <p className="ws-loading">Loading sensor data...</p>
          )}
        </div>

        {/* INTERNET WEATHER */}
        <div className="glass-card">
          <h2 className="ws-title">Internet Weather</h2>

          <div className="ws-input-row">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="ws-input"
            />

            <button onClick={fetchInternetWeather} className="ws-btn">
              Search
            </button>
          </div>

          {loadingInternet && <p className="ws-loading">Fetching weather...</p>}

          {internetWeather && internetWeather.main && (
            <div className="ws-info-grid">
              <div className="ws-info-item">
                <span>Temperature</span>
                <h3>{internetWeather.main.temp} °C</h3>
              </div>

              <div className="ws-info-item">
                <span>Humidity</span>
                <h3>{internetWeather.main.humidity} %</h3>
              </div>

              <div className="ws-info-item wide">
                <span>Pressure</span>
                <h3>{internetWeather.main.pressure} hPa</h3>
              </div>

              <div className="ws-info-item wide">
                <span>Condition</span>
                <h3>{internetWeather.weather[0].description}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
