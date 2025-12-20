import { useState, useEffect } from "react";
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiStrongWind } from "react-icons/wi";
import { FiSunrise, FiSunset, FiNavigation2, FiThermometer } from "react-icons/fi";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherIcon, setWeatherIcon] = useState(<WiDaySunny />);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Set weather icon based on time
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) {
      setWeatherIcon(<FiSunrise size={28} color="#F59E0B" />);
    } else if (hour >= 12 && hour < 18) {
      setWeatherIcon(<WiDaySunny size={28} color="#F59E0B" />);
    } else if (hour >= 18 && hour < 21) {
      setWeatherIcon(<FiSunset size={28} color="#F97316" />);
    } else {
      setWeatherIcon(<WiCloudy size={28} color="#94A3B8" />);
    }

    return () => clearInterval(timer);
  }, [currentTime]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "16px 32px",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "30px",
      }}>
        
        {/* Left Section - Brand */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flex: 1,
        }}>
          <div style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
            animation: "pulse 2s infinite",
          }}>
            {weatherIcon}
          </div>
          
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}>
              WeatherSphere
            </h1>
            <p style={{
              margin: "4px 0 0",
              fontSize: "0.75rem",
              color: "#94A3B8",
              letterSpacing: "0.5px",
            }}>
              Real-time global weather intelligence
            </p>
          </div>
        </div>

        {/* Center Section - Time & Date */}
        <div style={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "6px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#F8FAFC",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}>
              <FiThermometer size={20} color="#3B82F6" />
              <span>{formatTime(currentTime)}</span>
            </div>
            
            <div style={{
              width: "4px",
              height: "4px",
              backgroundColor: "#475569",
              borderRadius: "50%",
            }} />
            
            <div style={{
              color: "#F8FAFC",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}>
              {formatDate(currentTime)}
            </div>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "#CBD5E1",
              padding: "4px 12px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
            }}>
              <FiNavigation2 size={12} />
              <span>Live Updates</span>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "#CBD5E1",
              padding: "4px 12px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderRadius: "20px",
            }}>
              <WiStrongWind size={14} />
              <span>Global Coverage</span>
            </div>
          </div>
        </div>

        {/* Right Section - Weather Stats */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "24px",
        }}>
          {/* Weather Indicators */}
          <div style={{
            display: "flex",
            gap: "16px",
          }}>
            <div style={{
              textAlign: "center",
            }}>
              <WiDaySunny size={20} color="#F59E0B" />
              <div style={{
                fontSize: "0.7rem",
                color: "#94A3B8",
                marginTop: "2px",
              }}>
                Sunny
              </div>
            </div>
            
            <div style={{
              textAlign: "center",
            }}>
              <WiCloudy size={20} color="#94A3B8" />
              <div style={{
                fontSize: "0.7rem",
                color: "#94A3B8",
                marginTop: "2px",
              }}>
                Cloudy
              </div>
            </div>
            
            <div style={{
              textAlign: "center",
            }}>
              <WiRain size={20} color="#60A5FA" />
              <div style={{
                fontSize: "0.7rem",
                color: "#94A3B8",
                marginTop: "2px",
              }}>
                Rain
              </div>
            </div>
          </div>
          
          {/* Live Indicator */}
          <div style={{
            position: "relative",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.15)";
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#22C55E",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
              }} />
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#22C55E",
              }}>
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B)",
        animation: "gradientShift 3s infinite linear",
        backgroundSize: "400% 100%",
      }} />

      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
            }
            50% { 
              opacity: 0.8; 
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          
          .weather-icon {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </header>
  );
}