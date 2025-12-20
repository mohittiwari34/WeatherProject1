import React, { useState, useMemo } from "react";
import { useLocation } from "react-router";
import Dates from "../component/dates";
import { 
  WiThermometer, WiHumidity, WiBarometer, WiStrongWind, 
  WiCloudy, WiRain, WiSunrise, WiSunset 
} from "react-icons/wi";
import { FaTemperatureLow, FaTemperatureHigh, FaEye, FaWind } from "react-icons/fa";
import { MdModeNight, MdWbSunny, MdCompress } from "react-icons/md";

const Detail = () => {
  const location = useLocation();
  const weather = location.state?.weather;

  if (!weather) return <p>No weather data available.</p>;

  const today = weather.list[0];
  const city = weather.city.name;
  const [mode, setMode] = useState(true);
  const groupedData = useMemo(() => groupByDate(weather.list), [weather]);

  const getTimeOfDay = () => {
    const hour = new Date(today.dt_txt).getHours();
    if (hour >= 6 && hour < 18) return "day";
    return "night";
  };

  const weatherCards = [
    { icon: <WiThermometer size={24} />, label: "Feels Like", value: `${today.main.feels_like}°C` },
    { icon: <FaTemperatureLow size={20} />, label: "Min Temp", value: `${today.main.temp_min}°C` },
    { icon: <FaTemperatureHigh size={20} />, label: "Max Temp", value: `${today.main.temp_max}°C` },
    { icon: <WiHumidity size={24} />, label: "Humidity", value: `${today.main.humidity}%` },
    { icon: <WiBarometer size={24} />, label: "Pressure", value: `${today.main.pressure} hPa` },
    { icon: <FaWind size={20} />, label: "Wind Speed", value: `${today.wind.speed} m/s` },
    { icon: <WiCloudy size={24} />, label: "Clouds", value: `${today.clouds.all}%` },
    { icon: <FaEye size={20} />, label: "Visibility", value: `${(today.visibility / 1000).toFixed(1)} km` },
    { icon: <WiRain size={24} />, label: "Rain Chance", value: `${Math.round(today.pop * 100)}%` },
  ];

  return (
    <div
      style={{
        backgroundColor: mode ? "#F8FAFC" : "#0F172A",
        color: mode ? "#1E293B" : "#E2E8F0",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* HEADER WITH DARK MODE */}
      <header style={{
        maxWidth: "1200px",
        margin: "0 auto 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 0",
        borderBottom: `2px solid ${mode ? "#E2E8F0" : "#334155"}`,
      }}>
        <div>
          <h1 style={{
            fontSize: "2.5rem",
            margin: 0,
            background: mode ? "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" : "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
          }}>
            {city}
          </h1>
          <p style={{
            margin: "5px 0 0",
            color: mode ? "#64748B" : "#94A3B8",
            fontSize: "0.9rem",
          }}>
            {new Date(today.dt_txt).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <button
          onClick={() => setMode(!mode)}
          style={{
            padding: "10px 24px",
            backgroundColor: mode ? "#1E293B" : "#F1F5F9",
            color: mode ? "#F1F5F9" : "#1E293B",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
            boxShadow: mode 
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
              : "0 4px 6px -1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {mode ? (
            <>
              <MdModeNight size={18} />
              Switch to Dark
            </>
          ) : (
            <>
              <MdWbSunny size={18} />
              Switch to Light
            </>
          )}
        </button>
      </header>

      {/* MAIN WEATHER CARD */}
      <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          background: mode 
            ? "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)" 
            : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: mode 
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
            : "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
          marginBottom: "40px",
        }}>
          {/* CURRENT WEATHER OVERVIEW */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            alignItems: "center",
            marginBottom: "40px",
          }}>
            <div style={{ flex: "1 1 300px", textAlign: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                marginBottom: "20px",
              }}>
                <img
                  src={`https://openweathermap.org/img/wn/${today.weather[0].icon}@4x.png`}
                  alt="weather"
                  style={{ width: "140px", height: "140px" }}
                />
                <div>
                  <div style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1 }}>
                    {Math.round(today.main.temp)}°C
                  </div>
                  <div style={{
                    fontSize: "1.5rem",
                    color: mode ? "#3B82F6" : "#60A5FA",
                    fontWeight: 600,
                    marginTop: "10px",
                  }}>
                    {today.weather[0].main}
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: "1.1rem",
                color: mode ? "#64748B" : "#94A3B8",
                maxWidth: "400px",
                margin: "0 auto",
              }}>
                {today.weather[0].description.charAt(0).toUpperCase() + today.weather[0].description.slice(1)}
              </p>
            </div>

            {/* WEATHER METRICS GRID */}
            <div style={{ flex: "1 1 400px" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
              }}>
                {weatherCards.map((card, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: mode ? "#F1F5F9" : "#1E293B",
                      borderRadius: "16px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "transform 0.2s ease",
                      cursor: "pointer",
                      border: mode ? "1px solid #E2E8F0" : "1px solid #334155",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{
                      color: mode ? "#3B82F6" : "#60A5FA",
                      marginBottom: "12px",
                    }}>
                      {card.icon}
                    </div>
                    <div style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "8px",
                      color: mode ? "#1E293B" : "#F8FAFC",
                    }}>
                      {card.value}
                    </div>
                    <div style={{
                      fontSize: "0.85rem",
                      color: mode ? "#64748B" : "#94A3B8",
                      textAlign: "center",
                    }}>
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ADDITIONAL DETAILS */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}>
            <div style={{
              backgroundColor: mode ? "#F1F5F9" : "#1E293B",
              borderRadius: "16px",
              padding: "20px",
              border: mode ? "1px solid #E2E8F0" : "1px solid #334155",
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: "15px",
                color: mode ? "#3B82F6" : "#60A5FA",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <WiStrongWind size={24} />
                Wind Details
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: mode ? "#475569" : "#CBD5E1" }}>Direction</span>
                <span style={{ fontWeight: 600, color: mode ? "#1E293B" : "#F8FAFC" }}>
                  {getWindDirection(today.wind.deg)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: mode ? "#475569" : "#CBD5E1" }}>Wind Gust</span>
                <span style={{ fontWeight: 600, color: mode ? "#1E293B" : "#F8FAFC" }}>
                  {today.wind.gust || "N/A"} m/s
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: mode ? "#F1F5F9" : "#1E293B",
              borderRadius: "16px",
              padding: "20px",
              border: mode ? "1px solid #E2E8F0" : "1px solid #334155",
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: "15px",
                color: mode ? "#3B82F6" : "#60A5FA",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <MdCompress size={24} />
                Pressure Levels
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: mode ? "#475569" : "#CBD5E1" }}>Sea Level</span>
                <span style={{ fontWeight: 600, color: mode ? "#1E293B" : "#F8FAFC" }}>
                  {today.main.sea_level || "N/A"} hPa
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: mode ? "#475569" : "#CBD5E1" }}>Ground Level</span>
                <span style={{ fontWeight: 600, color: mode ? "#1E293B" : "#F8FAFC" }}>
                  {today.main.grnd_level || "N/A"} hPa
                </span>
              </div>
            </div>

            <div style={{
              backgroundColor: mode ? "#F1F5F9" : "#1E293B",
              borderRadius: "16px",
              padding: "20px",
              border: mode ? "1px solid #E2E8F0" : "1px solid #334155",
            }}>
              <h3 style={{
                marginTop: 0,
                marginBottom: "15px",
                color: mode ? "#3B82F6" : "#60A5FA",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                {getTimeOfDay() === "day" ? <WiSunrise size={24} /> : <WiSunset size={24} />}
                Time of Day
              </h3>
              <div style={{ 
                fontSize: "1.2rem", 
                fontWeight: 600,
                textAlign: "center",
                padding: "12px",
                backgroundColor: getTimeOfDay() === "day" 
                  ? (mode ? "#FEF3C7" : "#78350F") 
                  : (mode ? "#1E293B" : "#0F172A"),
                color: getTimeOfDay() === "day" 
                  ? (mode ? "#92400E" : "#FBBF24") 
                  : (mode ? "#E2E8F0" : "#CBD5E1"),
                borderRadius: "12px",
                border: getTimeOfDay() === "day" 
                  ? (mode ? "1px solid #FDE68A" : "1px solid #92400E") 
                  : (mode ? "1px solid #334155" : "1px solid #1E293B"),
              }}>
                {getTimeOfDay() === "day" ? "☀️ Daytime" : "🌙 Nighttime"}
              </div>
            </div>
          </div>
        </div>

        {/* DAILY FORECAST SECTION */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{
            fontSize: "1.8rem",
            marginBottom: "30px",
            color: mode ? "#1E293B" : "#E2E8F0",
            paddingBottom: "10px",
            borderBottom: `2px solid ${mode ? "#E2E8F0" : "#334155"}`,
          }}>
            📅 5-Day Forecast
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "25px",
          }}>
            {Object.entries(groupedData).map(([date, items]) => (
              <Dates key={date} date={date} items={items} mode={mode} />
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{
        maxWidth: "1200px",
        margin: "40px auto 0",
        padding: "20px 0",
        borderTop: `2px solid ${mode ? "#E2E8F0" : "#334155"}`,
        textAlign: "center",
        color: mode ? "#64748B" : "#94A3B8",
        fontSize: "0.9rem",
      }}>
        <p>Data provided by OpenWeatherMap • Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
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
  const dirs = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
  return dirs[Math.round(deg / 45) % 8];
}

export default Detail;