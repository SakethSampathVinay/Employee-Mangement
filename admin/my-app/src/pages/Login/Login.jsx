import React from "react";
import { useContext } from "react";
import { AppContext } from "../../context/context";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const { token, setToken, backendUrl } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/admin/login", {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/employee-form");
    }
  }, [token]);

  return (
    <div className="form-container">
      <form onSubmit={handleOnSubmit} className="form-card-container">
        <h1 className="form-title">Login</h1>
        <label htmlFor="email">Email</label>
        <input
          placeholder="Please Enter a Email"
          type="email"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
          className="label-input"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Please Enter a Password"
          type="password"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          className="label-input"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
