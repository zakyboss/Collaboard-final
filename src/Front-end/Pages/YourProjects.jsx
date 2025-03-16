// File: src/Front-end/Pages/YourProjects.jsx
import React, { useEffect } from "react";
import useAuthStore from "../Zustand-api/Authentication";
import useProjects from "../Zustand-api/useProjects";
import { useNavigate } from "react-router-dom";
import styles from "./YourProjects.module.css";
import OutputProjectsModal from "./OutputProjectsModal";

export default function YourProjects() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    projects,
    selectedProject,
    selectProject,
    clearSelectedProject,
    fetchProjects,
  } = useProjects();

  useEffect(() => {
    if (!isAuthenticated) {
      alert("You must be logged in to view your projects.");
      navigate("/login");
    } else {
      fetchProjects();
    }
  }, [isAuthenticated, fetchProjects, navigate]);

  // Filter only user's projects
  const userProjects = projects.filter(
    (p) => Number(p.user_id) === Number(user?.id)
  );
  console.log(userProjects);
  console.log(user);
  console.log(projects);
  const handleCardClick = (project) => {
    selectProject(project);
  };

  return (
    <div className={styles.container}>
      <h2>My Projects</h2>
      <div className={styles.cardGrid}>
        {userProjects.length === 0 ? (
          <p>No projects found. Create one?</p>
        ) : (
          userProjects.map((project) => (
            <div
              key={project.proj_id}
              className={styles.card}
              onClick={() => handleCardClick(project)}
            >
              {project.thumbnail && (
                <img
                  src={`https://collaboard-php-production.up.railway.app/uploads/${project.thumbnail}`}
                  alt="Project Thumbnail"
                  className={styles.thumbnail}
                />
              )}
              <h3>{project.proj_name}</h3>
              <p>{project.description}</p>
              <p>Developers Needed: {project.dev_needed}</p>
              <p>Days to Complete: {project.days_to_complete}</p>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <OutputProjectsModal onClose={clearSelectedProject} />
      )}
    </div>
  );
}
