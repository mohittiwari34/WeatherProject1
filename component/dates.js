import React from "react";
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind, WiRain } from "react-icons/wi";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

export default function Dates({ date, items, mode }) {
  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Get average temperature for the day
  const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
  const minTemp = Math.min(...items.map(item => item.main.temp_min));
  const maxTemp = Math.max(...items.map(item => item.main.temp_max));
  
  // Get dominant weather condition
  const getDominantWeather = () => {
    const conditions = items.map(item => item.weather[0].main);
    const counts = {};
    conditions.forEach(cond => counts[cond] = (counts[cond] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const dominantWeather = getDominantWeather();
  
  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Fog': '🌁',
    };
    return iconMap[condition] || '🌤️';
  };

  return (
    <div
      style={{
        backgroundColor: mode ? "#FFFFFF" : "#1E293B",
        color: mode ? "#1E293B" : "#F8FAFC",
        borderRadius: "20px",
        boxShadow: mode 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 5px 10px -5px rgba(0, 0, 0, 0.2)",
        width: "100%",
        minHeight: "320px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        border: mode ? "1px solid #E2E8F0" : "1px solid #334155",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = mode 
          ? "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)"
          : "0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 10px 20px -5px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = mode 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 5px 10px -5px rgba(0, 0, 0, 0.2)";
      }}
    >
      {/* Decorative Background Element */}
      <div style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: "100px",
        height: "100px",
        background: mode 
          ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)"
          : "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
        borderRadius: "0 20px 0 100px",
        zIndex: 0,
      }} />
      
      {/* Header Section */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: mode ? "#1E293B" : "#F8FAFC",
              marginBottom: "4px",
            }}>
              {formattedDate}
            </div>
            <div style={{
              fontSize: "0.875rem",
              color: mode ? "#64748B" : "#94A3B8",
            }}>
              {items.length} forecast periods
            </div>
          </div>
          <div style={{
            fontSize: "2.5rem",
            marginLeft: "10px",
          }}>
            {getWeatherIcon(dominantWeather)}
          </div>
        </div>

        {/* Weather Summary */}
        <div style={{
          backgroundColor: mode ? "#F1F5F9" : "#0F172A",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "0.75rem",
              color: mode ? "#64748B" : "#94A3B8",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}>
              <FaTemperatureLow size={12} /> Avg
            </div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: mode ? "#1E293B" : "#F8FAFC",
            }}>
              {avgTemp.toFixed(1)}°C
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "0.75rem",
              color: mode ? "#64748B" : "#94A3B8",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}>
              <WiThermometer size={14} /> Low
            </div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: mode ? "#3B82F6" : "#60A5FA",
            }}>
              {minTemp.toFixed(1)}°C
            </div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "0.75rem",
              color: mode ? "#64748B" : "#94A3B8",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}>
              <FaTemperatureHigh size={12} /> High
            </div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color: mode ? "#EF4444" : "#F87171",
            }}>
              {maxTemp.toFixed(1)}°C
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "0.875rem",
          fontWeight: "600",
          color: mode ? "#64748B" : "#94A3B8",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: `2px solid ${mode ? "#E2E8F0" : "#334155"}`,
        }}>
          Hourly Forecast
        </div>
        
        <div style={{
          maxHeight: "220px",
          overflowY: "auto",
          paddingRight: "8px",
        }}>
          {items.slice(0, 8).map((item, index) => (
            <div
              key={item.dt}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: index < items.length - 1 ? `1px solid ${mode ? "#E2E8F0" : "#334155"}` : "none",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = mode ? "#F8FAFC" : "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: mode ? "#475569" : "#CBD5E1",
                  minWidth: "60px",
                }}>
                  {new Date(item.dt_txt).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  }).toLowerCase()}
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].description}
                  style={{ width: "32px", height: "32px" }}
                />
                <div style={{
                  fontSize: "0.875rem",
                  color: mode ? "#64748B" : "#94A3B8",
                }}>
                  {item.weather[0].main}
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: mode ? "#1E293B" : "#F8FAFC",
                  minWidth: "60px",
                  textAlign: "right",
                }}>
                  {Math.round(item.main.temp)}°C
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    color: mode ? "#64748B" : "#94A3B8",
                  }}>
                    <WiHumidity size={16} />
                    <span>{item.main.humidity}%</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.75rem",
                    color: mode ? "#64748B" : "#94A3B8",
                  }}>
                    <WiRain size={16} />
                    <span>{Math.round(item.pop * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {items.length > 8 && (
            <div style={{
              textAlign: "center",
              padding: "12px",
              fontSize: "0.875rem",
              color: mode ? "#64748B" : "#94A3B8",
              fontStyle: "italic",
              borderTop: `1px solid ${mode ? "#E2E8F0" : "#334155"}`,
              marginTop: "8px",
            }}>
              +{items.length - 8} more time slots
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div style={{
        marginTop: "16px",
        paddingTop: "16px",
        borderTop: `2px solid ${mode ? "#E2E8F0" : "#334155"}`,
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.75rem",
        color: mode ? "#64748B" : "#94A3B8",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <WiBarometer size={14} />
          <span>Avg Pressure: {Math.round(items.reduce((sum, item) => sum + item.main.pressure, 0) / items.length)} hPa</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <WiStrongWind size={14} />
          <span>Avg Wind: {Math.round(items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length)} m/s</span>
        </div>
      </div>
    </div>
  );
}