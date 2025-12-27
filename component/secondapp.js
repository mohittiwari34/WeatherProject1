import Main from "./main";
import Header from "./header";
import { useState, useEffect } from "react";

export default function Secondd() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const backgrounds = [
    "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070",
    "https://images.unsplash.com/photo-1597220669165-d612ddd7106d?q=80&w=2070",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070",
    "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=2070",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070",
  ];

  // Optional: Auto-cycle backgrounds
  //ui ux
  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${backgrounds[backgroundIndex]}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        transition: "background-image 1s ease-in-out",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
          zIndex: 0,
        }}
      />
      
      {/* Floating Particles */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(3px 3px at 60px 120px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 80px 180px, rgba(255,255,255,0.2), transparent)
          `,
          zIndex: 0,
          animation: "float 20s infinite linear",
        }}
      />
      
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            100% { transform: translateY(-100px) translateX(100px); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6); }
          }
        `}
      </style>

      <Header />
      
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "600px",
        animation: "fadeIn 1s ease-out",
      }}>
        <Main />
      </div>
      
      {/* Background Cycle Indicator */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        display: "flex",
        gap: "8px",
        zIndex: 2,
      }}>
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setBackgroundIndex(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === backgroundIndex ? "#3B82F6" : "rgba(255, 255, 255, 0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            aria-label={`Switch to background ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Weather Info Footer */}
      <footer style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "0.875rem",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span>🌤️</span>
        <span>Real-time Weather Data</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>Powered by OpenWeatherMap</span>
      </footer>
    </div>
  );
}