import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

export default function Home() {
  const { isLoggedIn, userData } = useOutletContext();
  const [projects, setProjects] = useState([]);
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
    // Fetch projects from backend here
    const dummyProjects = [
      {
        id: 1,
        title: "Build a School",
        description: "Help build a school in rural Egypt.",
        image: "https://picsum.photos/300/180?random=1",
        donation: 3500,
        target: 10000,
      },
      {
        id: 2,
        title: "Water Wells Project",
        description: "Provide clean water to remote villages.",
        image: "https://picsum.photos/300/180?random=2",
        donation: 9000,
        target: 12000,
      },
      {
        id: 3,
        title: "Medical Aid",
        description: "Donate for basic medical supplies.",
        image: "https://picsum.photos/300/180?random=3",
        donation: 7000,
        target: 7000,
      },
    ];
    setProjects(dummyProjects);
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Latest Campaigns</h2>
      <div className="row g-4">
        {projects.map((project) => {
          const { id, title, description, image, donation, target, userId } = project;
          const progress = Math.min(Math.round((donation / target) * 100), 100);
          const isOwner = true; // userId === userData?.id;

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