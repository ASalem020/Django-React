import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [userData, setUserData] = useState({
    name: "Ahmed Salem",
    email: "ahmed@example.com",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("redirectAfterLogin");
    setIsLoggedIn(false);
    setUserData(null);
  };
  const navigate = useNavigate();

  const handleDonateClick = (projectId) => {
    if (isLoggedIn) {
      navigate(`/donate/${projectId}`);
    } else {
      localStorage.setItem("redirectAfterLogin", `/donate/${projectId}`);
      navigate("/login");
    }
  };

  useEffect(() => {
    // Replace dummyProjects with fetch from backend (to be implemented)
    // Use userData from context (to be implemented)
    // Only show Edit/Delete if user is owner
    // Only allow donate if logged in
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Latest Campaigns</h2>
      <div className="row g-4">
        {projects.map((project) => {
          const { id, title, description, image, donation, target, userId } = project;
          const progress = Math.min(Math.round((donation / target) * 100), 100);
          const isOwner = true; // userId === loggedInUserId;

          return (
            <div className="col-md-4" key={id}>
              <div className="card h-100">
                <img src={image} className="card-img-top" alt={title} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">{description}</p>
                  <div className="d-flex justify-content-between">
                    <div className="card-text">
                      <p className="mb-4">
                        <strong>Raised:</strong> ${donation.toLocaleString()}
                      </p>
                      <p>
                        <strong>Target:</strong> ${target.toLocaleString()}
                      </p>
                    </div>
                    {isOwner && (
                      <div className="d-flex gap-1 flex-column">
                        <button className="btn btn-warning">Edit Project</button>
                        <button className="btn btn-danger">Delete Project</button>
                      </div>
                    )}
                  </div>
                  <div className="progress mb-2" style={{ height: "20px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {progress}%
                    </div>
                  </div>
                  <div className="mt-auto d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDonateClick(id)}
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 