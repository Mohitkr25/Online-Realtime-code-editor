import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Editorspage from "./pages/Editorspage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            sucess: {
              theme: {
                primary: "#4aedBB",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<Editorspage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
