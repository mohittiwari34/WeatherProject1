export default function Dates({ date, items }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        width: "320px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "auto",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <h2 style={{ fontSize: "20px", textAlign: "center", marginBottom: "16px" }}>
        📅 {date}
      </h2>

      {items.map((item) => (
        <div
          key={item.dt}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            padding: "8px 12px",
            backgroundColor: "#F8F9FA",
            borderRadius: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>🕒 {item.dt_txt.split(" ")[1]}</span>
          <span style={{ fontSize: "14px" }}>🌡️ {item.main.temp}°C</span>
        </div>
      ))}
    </div>
  );
}
