import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, userData, handleLogout }) {
  const navigate = useNavigate();

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse row" id="navbarNav">
          <ul className="navbar-nav me-5 col-5">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleProtectedClick("/create-project")}
              >
                Create Project
              </span>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => handleProtectedClick("/my-projects")}
              >
                View My Projects
              </span>
            </li>
          </ul>
          <Link className="navbar-brand col-2" to="/">
            CrowdFund
          </Link>
          <ul className="navbar-nav ms-auto col-2 align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span
                    style={{ width: 130 }}
                    className="nav-link text-light"
                  >
                    {userData?.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm ms-2"
                    onClick={handleLogoutAndRedirect}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
} 