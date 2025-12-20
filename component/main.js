import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import Detail from "./detail";

export default function Main() {
  const [city, setCity] = useState("patna");
    const navigate = useNavigate();

  const [weather, setWeather] = useState(null);

  async function fetchWeather() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=be600586e4effcabb55e4b8224fd8fd4&units=metric`
      );
      console.log(response);
      const data = await response.json();
      if(data.cod==200){
        navigate("/detail",{state:{weather:data}});
      }
      else{
        alert("city not found");
      }
      
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      alert(error.message);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Weather Search</h2>
      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          height: "45px",
          width: "70%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px 0 0 8px",
          border: "1px solid #ccc",
          outline: "none",
        }}
      />
      
      <button
        onClick={fetchWeather}
    
        style={{
          height: "45px",
          width: "30%",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "0 8px 8px 0",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Search
      </button>
      

      
    </div>
  );
}
