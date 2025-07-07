import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, userData, handleLogout }) {
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
              <Link className="nav-link" to="/create-project">
                Create Project
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-projects">
                View My Projects
              </Link>
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
                    onClick={handleLogout}
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