// LoginPage.js
import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../auth/AuthConfig";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import loginBg from "../../assets/loginPage.jpg";

const LoginPage = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  // ---------------------------
  // Prevent back button after logout
  // ---------------------------
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // ---------------------------
  // Login function
  // ---------------------------
  const handleLogin = async () => {
    try {
      await instance.loginPopup({
        ...loginRequest,
        prompt: "select_account", // forces user to pick an account every time
      });

      // Navigate to home page and replace history entry
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-card">
        <h2 className="login-title">Welcome to Ink Mirror</h2>
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
        <p className="login-subtitle">Sign in with your Microsoft Account</p>
      </div>
    </div>
  );
};

export default LoginPage;
