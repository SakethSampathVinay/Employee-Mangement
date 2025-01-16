import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/context";
import "./Navbar.css";

const Navbar = () => {
  const { token, setToken } = useContext(AppContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
    if (token) {
      setToken("");
      localStorage.removeItem("token");
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-brand">
        <h1 onClick={() => navigate("/")} className="navbar-title">
          Employee Management System
        </h1>
      </div>
      <button onClick={logout} className="navbar-logout">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
