import React from "react";
import ReactDOM from "react-dom/client";
import Secondd from "./component/secondapp";
import { useEffect } from "react";
import Detail from "./component/detail";
import { BrowserRouter, Routes, Route } from "react-router";



function App() {
    useEffect(() => {
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            document.body.style.overflowX = 'hidden';
            document.body.style.height='100vh'
        }, []);

  return (
    <BrowserRouter><Routes>
        <Route path="/" element={<Secondd></Secondd>}></Route>
        <Route path="/detail" element={<Detail></Detail>}></Route>
        </Routes></BrowserRouter>
    
    
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
