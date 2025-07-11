import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ isLoggedIn, userData, handleLogout }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogoutAndRedirect = () => {
    handleLogout();
    navigate("/");
  };

  // Dynamic styles based on theme
  const navbarStyle = {
    background: isDarkMode 
      ? 'rgba(40, 38, 60, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: isDarkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)' 
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: isDarkMode 
      ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' 
      : '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
  };

  const textColor = isDarkMode ? '#fff' : '#212529';
  const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const glassBg = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={navbarStyle}>
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            border: `1px solid ${borderColor}`,
            borderRadius: '8px'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse row" id="navbarNav">
          <ul className="navbar-nav me-5 col-5">
            <li className="nav-item">
              <Link className="nav-link active fw-semibold" to="/" style={{
                color: textColor,
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                padding: '8px 16px',
                margin: '0 4px'
              }}>
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link fw-semibold"
                style={{ 
                  cursor: "pointer",
                  color: textColor,
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  margin: '0 4px'
                }}
                onClick={() => handleProtectedClick("/create-project")}
              >
                ➕ Create Project
              </span>
            </li>
            <li className="nav-item">
              <span
                className="nav-link fw-semibold"
                style={{ 
                  cursor: "pointer",
                  color: textColor,
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  margin: '0 4px'
                }}
                onClick={() => handleProtectedClick("/my-projects")}
              >
                📋 My Projects
              </span>
            </li>
          </ul>
          <Link className="navbar-brand col-2 text-center" to="/" style={{
            color: textColor,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🚀 CrowdFund
          </Link>
          <ul className="navbar-nav ms-auto col-2 align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span
                    style={{ 
                      width: 130,
                      color: textColor,
                      fontWeight: '500',
                      padding: '8px 8px',
                      borderRadius: '8px',
                      background: glassBg,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${borderColor}`
                    }}
                    className="nav-link"
                  >
                    👤 {userData?.name}
                  </span>
                </li>
                <li className="nav-item me-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleLogoutAndRedirect}
                    style={{
                      margin: '0 4px',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      background: glassBg,
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                      color: textColor
                    }}
                  >
                     Logout
                  </button>
                </li>
                {/* Theme Toggle Button */}
                <li className="nav-item">
                  <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{
                      background: glassBg,
                      border: `1px solid ${borderColor}`,
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      color: textColor
                    }}
                  >
                    {isDarkMode ? "☀️" : "🌙"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link fw-semibold" to="/login" style={{
                    color: textColor,
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}>
                    🔐 Login
                  </Link>
                </li>
                {/* Theme Toggle Button */}
                <li className="nav-item">
                  <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    style={{
                      background: glassBg,
                      border: `1px solid ${borderColor}`,
                      backdropFilter: 'blur(10px)',
                      borderRadius: '8px',
                      color: textColor
                    }}
                  >
                    {isDarkMode ? "☀️" : "🌙"}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 