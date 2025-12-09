// Header.js
import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const Header = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  // const handleAppLogout = async () => {
  //   try {
  //     // Clear app storage
  //     localStorage.clear();
  //     sessionStorage.clear();

  //     // MSAL logout using popup
  //     await instance.logoutPopup({
  //       postLogoutRedirectUri: "/login", // Redirect after logout
  //     });

  //     // After logout, navigate to login page (optional)
  //     navigate("/login", { replace: true });
  //   } catch (error) {
  //     console.error("Logout failed, navigating to login anyway", error);
  //     navigate("/login", { replace: true });
  //   }
  // };
  const handleAppLogout = async () => {
  try {
    // Clear app storage
    localStorage.clear();
    sessionStorage.clear();

    // MSAL logout using redirect (clears AAD session too)
    await instance.logoutPopup({
      postLogoutRedirectUri: "/login", // Redirect after logout
    });

    // Navigate to login page (optional, since redirect will handle it)
    navigate("/login", { replace: true });
  } catch (error) {
    console.error("Logout failed, navigating to login anyway", error);
    navigate("/login", { replace: true });
  }
};

  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="app-header">
      <h1 className="app-title">Ink Mirror</h1>
      <div className="header-buttons">
        <button className="home-button" onClick={goHome}>
          Home
        </button>
        <button className="logout-button" onClick={handleAppLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
