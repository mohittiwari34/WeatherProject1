
import Main from "./main"
import Header from "./header"

export default function Secondd(){
    return(
        <div
              style={{
                backgroundImage: `url("https://wallpaperbat.com/img/8617973-weather-wallpaper.jpg")`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <Header></Header>

            
              <Main></Main>
        </div>
    )
}