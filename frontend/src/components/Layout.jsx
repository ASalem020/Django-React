import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("userData"));
    if (loginStatus && user) {
      setIsLoggedIn(true);
      setUserData(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("redirectAfterLogin");
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userData={userData}
        handleLogout={handleLogout}
      />
      <Outlet context={{ isLoggedIn, userData }} />
    </>
  );
} 