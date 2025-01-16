import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/context";
import { useState, useEffect} from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const { token, setToken, backendUrl } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/employee/login", {
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
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={handleOnSubmit}>
      <label htmlFor="email">Email</label>
      <input
        placeholder="Please Enter a Email"
        type="email"
        id="email"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        placeholder="Please Enter a Email"
        type="password"
        id="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
