import React, { useState, useMemo } from "react";
import { useLocation } from "react-router";
import Dates from "../component/dates";
import { 
  WiThermometer, WiHumidity, WiBarometer, WiStrongWind, 
  WiCloudy, WiRain, WiSunrise, WiSunset 
} from "react-icons/wi";
import { FaTemperatureLow, FaTemperatureHigh, FaEye, FaWind, FaRunning } from "react-icons/fa";
import { MdModeNight, MdWbSunny, MdCompress, MdAssistant } from "react-icons/md";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

const Detail = () => {
  const location = useLocation();
  const weather = location.state?.weather;

  if (!weather) return <p>No weather data available.</p>;

  const today = weather.list[0];
  const city = weather.city.name;
  const [mode, setMode] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activityHistory, setActivityHistory] = useState([]);
  const groupedData = useMemo(() => groupByDate(weather.list), [weather]);

  const getTimeOfDay = () => {
    const hour = new Date(today.dt_txt).getHours();
    if (hour >= 6 && hour < 18) return "day";
    return "night";
  };

  // AI Activity Recommendation Function
  const analyzeActivityFeasibility = async (userQuestion) => {
    setIsLoading(true);
    
    // Extract activity from question
    const activities = {
      'run': 'running',
      'jog': 'running',
      'walk': 'walking',
      'hike': 'hiking',
      'cycle': 'cycling',
      'bike': 'cycling',
      'swim': 'swimming',
      'picnic': 'picnic',
      'outdoor': 'outdoor activities',
      'exercise': 'exercise',
      'sports': 'sports',
      'tennis': 'tennis',
      'golf': 'golf',
      'soccer': 'soccer',
      'football': 'football'
    };

    const currentWeather = {
      temp: today.main.temp,
      feels_like: today.main.feels_like,
      condition: today.weather[0].main.toLowerCase(),
      description: today.weather[0].description,
      humidity: today.main.humidity,
      windSpeed: today.wind.speed,
      rainChance: Math.round(today.pop * 100),
      visibility: today.visibility / 1000,
      timeOfDay: getTimeOfDay()
    };

    // Find mentioned activity
    let detectedActivity = 'outdoor activity';
    for (const [keyword, activity] of Object.entries(activities)) {
      if (userQuestion.toLowerCase().includes(keyword)) {
        detectedActivity = activity;
        break;
      }
    }

    // AI Logic for activity recommendations
    let feasibility = '';
    let reasoning = [];
    let recommendation = '';
    let icon = <IoMdCheckmarkCircle />;
    let color = '#10B981'; // Green

    // Temperature checks
    if (currentWeather.temp > 35) {
      reasoning.push(`High temperature (${Math.round(currentWeather.temp)}°C) can lead to heat exhaustion`);
      feasibility = 'Not Recommended';
      color = '#EF4444'; // Red
    } else if (currentWeather.temp < 5) {
      reasoning.push(`Low temperature (${Math.round(currentWeather.temp)}°C) increases risk of hypothermia`);
      feasibility = 'Use Caution';
      color = '#F59E0B'; // Yellow
    } else if (currentWeather.temp >= 15 && currentWeather.temp <= 25) {
      reasoning.push(`Perfect temperature (${Math.round(currentWeather.temp)}°C) for outdoor activities`);
    }

    // Weather condition checks
    if (currentWeather.condition.includes('rain') || currentWeather.condition.includes('storm')) {
      reasoning.push(`${currentWeather.condition.charAt(0).toUpperCase() + currentWeather.condition.slice(1)} makes it unsuitable`);
      feasibility = 'Not Recommended';
      color = '#EF4444';
      icon = <IoMdCloseCircle />;
    } else if (currentWeather.condition.includes('clear') || currentWeather.condition.includes('cloud')) {
      reasoning.push(`Clear/cloudy conditions are good for ${detectedActivity}`);
    }

    // Wind checks
    if (currentWeather.windSpeed > 10 && ['running', 'cycling', 'walking'].includes(detectedActivity)) {
      reasoning.push(`High wind speed (${currentWeather.windSpeed} m/s) may affect your ${detectedActivity}`);
      if (feasibility !== 'Not Recommended') {
        feasibility = 'Use Caution';
        color = '#F59E0B';
      }
    }

    // Visibility checks
    if (currentWeather.visibility < 1) {
      reasoning.push(`Low visibility (${currentWeather.visibility.toFixed(1)} km) can be dangerous`);
      feasibility = 'Not Recommended';
      color = '#EF4444';
      icon = <IoMdCloseCircle />;
    }

    // Time of day checks
    if (currentWeather.timeOfDay === 'night' && ['running', 'cycling', 'hiking'].includes(detectedActivity)) {
      reasoning.push('Limited visibility at night - consider reflective gear and lights');
      if (feasibility !== 'Not Recommended') {
        feasibility = 'Use Caution';
        color = '#F59E0B';
      }
    }

    // Generate final recommendation
    if (!feasibility) {
      feasibility = 'Recommended';
      recommendation = `Yes, it's a good time for ${detectedActivity} in ${city}!`;
      reasoning.push(`Current conditions are favorable for ${detectedActivity}`);
    } else if (feasibility === 'Use Caution') {
      recommendation = `You can go ${detectedActivity}, but take precautions.`;
    } else {
      recommendation = `Not ideal for ${detectedActivity} right now. Consider indoor alternatives.`;
    }

    // Add additional tips based on conditions
    if (currentWeather.humidity > 80) {
      reasoning.push(`High humidity (${currentWeather.humidity}%) - stay hydrated`);
    }

    if (currentWeather.rainChance > 50) {
      reasoning.push(`${currentWeather.rainChance}% chance of rain - carry rain gear`);
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = {
      question: userQuestion,
      activity: detectedActivity,
      feasibility,
      recommendation,
      reasoning,
      timestamp: new Date().toLocaleTimeString(),
      icon,
      color,
      weatherConditions: {
        temperature: `${Math.round(currentWeather.temp)}°C`,
        condition: currentWeather.condition,
        wind: `${currentWeather.windSpeed} m/s`,
        humidity: `${currentWeather.humidity}%`,
        visibility: `${currentWeather.visibility.toFixed(1)} km`,
        rainChance: `${currentWeather.rainChance}%`
      }
    };

    // Save to history
    setActivityHistory(prev => [result, ...prev.slice(0, 4)]);
    setAnswer(result);
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      analyzeActivityFeasibility(question);
    }
  };

  // Pre-defined questions
  const quickQuestions = [
    "Can I go for a run?",
    "Is it good for cycling?",
    "Should I take an umbrella?",
    "Good time for a walk?",
    "Can I have a picnic?"
  ];

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

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* AI ACTIVITY ADVISOR SECTION */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{
            background: mode 
              ? "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)" 
              : "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: mode 
              ? "0 20px 25px -5px rgba(59, 130, 246, 0.3)" 
              : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            border: mode ? "1px solid #60A5FA" : "1px solid #334155",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "25px",
            }}>
              <div style={{
                backgroundColor: mode ? "#FFFFFF20" : "#FFFFFF10",
                padding: "12px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <MdAssistant size={28} color={mode ? "#FFFFFF" : "#E2E8F0"} />
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                }}>
                  AI Activity Advisor
                </h2>
                <p style={{
                  margin: "5px 0 0",
                  color: "#CBD5E1",
                  fontSize: "0.95rem",
                }}>
                  Ask about outdoor activities based on current weather
                </p>
              </div>
            </div>

            {/* QUICK QUESTIONS */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#E2E8F0", marginBottom: "10px", fontSize: "0.95rem" }}>
                Quick questions:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(q);
                      analyzeActivityFeasibility(q);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#FFFFFF20",
                      color: "#FFFFFF",
                      border: "1px solid #FFFFFF40",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF30";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF20";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION INPUT */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Can I go running right now? Is it good for a picnic?"
                  style={{
                    flex: 1,
                    padding: "15px 20px",
                    backgroundColor: mode ? "#FFFFFF10" : "#00000020",
                    color: "#FFFFFF",
                    border: "1px solid #FFFFFF30",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "0 30px",
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#10B981"}
                >
                  {isLoading ? (
                    <>Analyzing...</>
                  ) : (
                    <>
                      <FaRunning size={18} />
                      Ask AI
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* AI RESPONSE */}
            {answer && (
              <div style={{
                backgroundColor: "#FFFFFF10",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #FFFFFF20",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ 
                        color: answer.color,
                        fontSize: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                      }}>
                        {answer.icon}
                      </span>
                      <h3 style={{ 
                        margin: 0, 
                        color: "#FFFFFF",
                        fontSize: "1.3rem",
                        fontWeight: 600,
                      }}>
                        {answer.feasibility}
                      </h3>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      color: "#E2E8F0",
                      fontSize: "1.1rem",
                    }}>
                      {answer.recommendation}
                    </p>
                  </div>
                  <span style={{ 
                    color: "#94A3B8",
                    fontSize: "0.85rem",
                  }}>
                    {answer.timestamp}
                  </span>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ 
                    margin: "0 0 10px 0", 
                    color: "#CBD5E1",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                  }}>
                    Current Conditions:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {answer.weatherConditions && Object.entries(answer.weatherConditions).map(([key, value]) => (
                      <span key={key} style={{
                        padding: "6px 12px",
                        backgroundColor: "#FFFFFF10",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        color: "#E2E8F0",
                      }}>
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ 
                    margin: "0 0 10px 0", 
                    color: "#CBD5E1",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                  }}>
                    Factors Considered:
                  </h4>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: "20px",
                    color: "#E2E8F0",
                    fontSize: "0.9rem",
                  }}>
                    {answer.reasoning?.map((reason, idx) => (
                      <li key={idx} style={{ marginBottom: "5px" }}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* RECENT ACTIVITY HISTORY */}
            {activityHistory.length > 0 && (
              <div style={{ marginTop: "25px" }}>
                <h4 style={{ 
                  margin: "0 0 15px 0", 
                  color: "#CBD5E1",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}>
                  Recent Activity Checks:
                </h4>
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
                  {activityHistory.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setAnswer(item)}
                      style={{
                        flex: "0 0 auto",
                        width: "200px",
                        padding: "15px",
                        backgroundColor: "#FFFFFF10",
                        borderRadius: "12px",
                        border: "1px solid #FFFFFF20",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF20";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FFFFFF10";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ color: item.color }}>
                          {item.icon}
                        </span>
                        <span style={{ 
                          color: "#FFFFFF",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {item.activity}
                        </span>
                      </div>
                      <p style={{ 
                        margin: 0,
                        color: "#E2E8F0",
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {item.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* MAIN WEATHER CARD */}
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
        <p style={{ marginTop: "5px", fontSize: "0.8rem" }}>AI Activity Advisor analyzes weather conditions for outdoor safety</p>
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
//this is it
//helo mohit
//ho are you this moment j k
//git vanc aur north react node express qustion ert reddis db
export default Detail;