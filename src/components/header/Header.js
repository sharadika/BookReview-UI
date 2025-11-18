import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom"; 

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <h1 className="app-title">InkMirror</h1>
       <div className="header-buttons">
      <button className="home-button" onClick={() => navigate("/")}>Home</button>
      <button className="register-button">Register</button>
  </div>
    </header>
  );
};

export default Header;
