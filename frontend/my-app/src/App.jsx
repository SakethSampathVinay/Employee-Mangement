import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login"; // Login component
import Home from "./pages/home"; // Example Home component (replace with your actual component)

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
      </Routes>
    </div>
  );
}

export default App;
