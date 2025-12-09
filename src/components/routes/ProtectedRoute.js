import React from "react";
import { Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const ProtectedRoute = ({ children }) => {
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();

  // If no logged-in accounts → redirect to login
  if (!accounts || accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
