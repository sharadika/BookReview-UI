// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/AuthConfig";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import User from "./components/users/Users";
import Book from "./components/books/Books";
import Review from "./components/reviews/Review";
import Login from "./components/login/LoginPage";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import InitializeAuth from "./auth/InitializeAuth";

// ---------------------------
// Layout wrapper to hide header on login
// ---------------------------
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderPaths = ["/login"]; // hide header on login page

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <main>{children}</main>
      <Footer />
    </>
  );
};

// ---------------------------
// Main App
// ---------------------------
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      {/* This restores session on refresh */}
      <InitializeAuth />

      <Router>
        <Layout>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />

            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Book />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Review />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </MsalProvider>
  );
}

export default App;
