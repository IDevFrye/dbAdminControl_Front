import React, { useState } from "react";
import "./LoginPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../AdminPage/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      document.cookie = `token=${response.data.token}; path=/;`;

      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role); 
      
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-page">
      <img src={logo} alt="" />
      <h1>Авторизация</h1>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Логин:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Войти</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
