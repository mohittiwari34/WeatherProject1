import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiMapPin, FiNavigation, FiGlobe, FiSun, FiCloud } from "react-icons/fi";
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from "react-icons/wi";

export default function Main() {
  const [city, setCity] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Popular cities for quick selection
  const popularCities = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Dubai", "Mumbai", "Singapore", "Berlin", "Toronto"
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weatherRecentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save to recent searches
  const saveToRecent = (cityName) => {
    const updated = [cityName, ...recentSearches.filter(c => c !== cityName)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("weatherRecentSearches", JSON.stringify(updated));
  };

  async function fetchWeather(cityName = city) {
    if (!cityName.trim()) {
      alert("Please enter a city name");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=be600586e4effcabb55e4b8224fd8fd4&units=metric`
      );
      
      if (!response.ok) throw new Error("City not found");
      
      const data = await response.json();
      
      if (data.cod === "200") {
        saveToRecent(cityName);
        navigate("/detail", { state: { weather: data } });
      }
    } catch (error) {
      alert(error.message || "Failed to fetch weather data");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  const getWeatherIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      return <WiDaySunny size={40} color="#F59E0B" />;
    }
    return <WiCloudy size={40} color="#94A3B8" />;
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
        padding: "40px 30px",
        borderRadius: "24px",
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8)
        `,
        textAlign: "center",
        maxWidth: "500px",
        width: "100%",
        backdropFilter: "blur(10px)",
        animation: "fadeIn 0.8s ease-out",
      }}
    >
      {/* Header Section */}
      <div style={{
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {getWeatherIcon()}
        <h1 style={{
          margin: "15px 0 5px",
          fontSize: "2.5rem",
          fontWeight: 800,
          background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>
          Weather Forecast
        </h1>
        <p style={{
          color: "#64748B",
          fontSize: "1rem",
          marginBottom: "10px",
        }}>
          Get accurate weather information for any city worldwide
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#94A3B8",
          fontSize: "0.875rem",
        }}>
          <FiGlobe size={14} />
          <span>Powered by OpenWeatherMap API</span>
        </div>
      </div>

      {/* Search Section */}
      <div style={{
        position: "relative",
        marginBottom: "30px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "4px",
          boxShadow: isFocused 
            ? "0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)"
            : "0 4px 12px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          border: `2px solid ${isFocused ? "#3B82F6" : "#E2E8F0"}`,
        }}>
          <div style={{
            padding: "0 16px",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
          }}>
            <FiMapPin size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter city name (e.g., New York, London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              height: "56px",
              padding: "0 10px",
              fontSize: "1rem",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#1E293B",
              fontWeight: 500,
            }}
            disabled={isLoading}
          />
          <button
            onClick={() => fetchWeather()}
            disabled={isLoading}
            style={{
              height: "56px",
              padding: "0 28px",
              backgroundColor: isLoading ? "#94A3B8" : "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#2563EB";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "#3B82F6";
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#FFFFFF",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }} />
                Searching...
              </>
            ) : (
              <>
                <FiSearch size={20} />
                Search
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div style={{
            textAlign: "center",
            marginTop: "15px",
            color: "#3B82F6",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              borderTopColor: "#3B82F6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
            Fetching weather data...
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{
            fontSize: "0.875rem",
            color: "#64748B",
            marginBottom: "12px",
            textAlign: "left",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <FiNavigation size={14} />
            Recent Searches
          </h3>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  setCity(search);
                  fetchWeather(search);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#F1F5F9",
                  color: "#475569",
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#E2E8F0";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F1F5F9";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cities */}
      <div>
        <h3 style={{
          fontSize: "0.875rem",
          color: "#64748B",
          marginBottom: "12px",
          textAlign: "left",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <FiGlobe size={14} />
          Popular Cities
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}>
          {popularCities.map((popularCity, index) => (
            <button
              key={index}
              onClick={() => {
                setCity(popularCity);
                fetchWeather(popularCity);
              }}
              style={{
                padding: "12px",
                backgroundColor: "#F8FAFC",
                color: "#1E293B",
                border: "2px solid #E2E8F0",
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#3B82F6";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <FiMapPin size={14} color="#3B82F6" />
              {popularCity}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: "30px",
        paddingTop: "20px",
        borderTop: "2px solid #F1F5F9",
        color: "#94A3B8",
        fontSize: "0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <WiDaySunny size={16} />
          <span>Real-time Data</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <WiCloudy size={16} />
          <span>5-Day Forecast</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <WiRain size={16} />
          <span>Hourly Updates</span>
        </span>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
}