import React, { useState, useMemo } from "react";
import { useLocation } from "react-router";
import Dates from "../component/dates";

const Detail = () => {
  const location = useLocation();
  const weather = location.state?.weather;

  if (!weather) return <p>No weather data available.</p>;

  const today = weather.list[0];
  const city = weather.city.name;

  const [mode, setMode] = useState(true);

  const groupedData = useMemo(() => groupByDate(weather.list), [weather]);

  return (
    <div
      style={{
        backgroundColor: mode ? "#F0F8FF" : "#000",
        color: mode ? "#000" : "#fff",
        minHeight: "100vh",
        padding: "30px 10px",
      }}
    >
      {/* DARK MODE BUTTON */}
      <button
        onClick={() => setMode(!mode)}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          height: "40px",
          width: "120px",
          backgroundColor: mode ? "#000" : "#fff",
          color: mode ? "#fff" : "#000",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {mode ? "Dark" : "Normal"}
      </button>

      {/* MAIN CARD */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            width: "90%",
            maxWidth: "900px",
            backgroundColor: mode ? "#fff" : "#111",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Weather in {city}</h1>

          <h3 style={{ textAlign: "center" }}>
            Forecast Time: {today.dt_txt}
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            {/* LEFT SECTION */}
            <div style={{ textAlign: "center", flex: "1 1 250px" }}>
              <img
                src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}
                alt="weather"
                style={{ width: "120px" }}
              />
              <h2>{today.main.temp}°C</h2>
              <h4>Feels Like: {today.main.feels_like}°C</h4>
              <h4>
                {today.sys.pod === "d" ? "☀️ Day" : "🌙 Night"}
              </h4>
            </div>

            {/* RIGHT SECTION (ALL API DATA) */}
            <div style={{ flex: "1 1 300px" }}>
              <h3>Condition: {today.weather[0].main}</h3>
              <h4>Description: {today.weather[0].description}</h4>
              <h4>Weather Code: {today.weather[0].id}</h4>

              <h4>Min Temp: {today.main.temp_min}°C</h4>
              <h4>Max Temp: {today.main.temp_max}°C</h4>

              <h4>Humidity: {today.main.humidity}%</h4>
              <h4>Pressure: {today.main.pressure} hPa</h4>
              <h4>Sea Level: {today.main.sea_level} hPa</h4>
              <h4>Ground Level: {today.main.grnd_level} hPa</h4>

              <h4>Cloud Coverage: {today.clouds.all}%</h4>
              <h4>Visibility: {(today.visibility / 1000).toFixed(1)} km</h4>

              <h4>
                Wind Speed: {today.wind.speed} m/s (
                {getWindDirection(today.wind.deg)})
              </h4>

              {today.wind.gust && (
                <h4>Wind Gust: {today.wind.gust} m/s</h4>
              )}

              <h4>Rain Probability: {Math.round(today.pop * 100)}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY FORECAST CARDS */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "50px",
        }}
      >
        {Object.entries(groupedData).map(([date, items]) => (
          <Dates key={date} date={date} items={items} />
        ))}
      </div>
    </div>
  );
};

/* ---------------- HELPER FUNCTIONS ---------------- */

function groupByDate(list) {
  const grouped = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  });
  return grouped;
}

function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export default Detail;