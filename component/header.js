export default function Header(){
    return(
        <div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  backgroundColor: "#1a1a1a",
  width: "100%",
  height: "70px",
  position: "absolute",
  top: "0px"
}}>
  <img src="https://cdn-icons-png.flaticon.com/128/869/869869.png" alt="sun" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
  <h1 style={{ margin: 0, fontSize: "24px", color: "#ffffff" }}>Accurate Weather</h1>
</div>

        

    )
}