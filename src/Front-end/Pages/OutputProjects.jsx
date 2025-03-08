// File: src/Front-end/Pages/OutputProjects.jsx
import React, { useEffect } from "react";
import useProjects from "../Zustand-api/useProjects";
import OutputProjectsModal from "./OutputProjectsModal";
import styles from "./OutputProjects.module.css";
import useAuthStore from "../Zustand-api/Authentication";

export default function OutputProjects() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    projects = [], // Ensure projects is always an array
    selectedProject,
    fetchProjects,
    selectProject,
    clearSelectedProject,
  } = useProjects();

  useEffect(() => {
    if (fetchProjects) {
      fetchProjects();
    }
  }, [fetchProjects]);

  const handleCardClick = (project) => {
    selectProject(project);
  };

  return (
    <div className={styles.container}>
      <h2 style={{ color: "#fff" }}>Projects</h2>
      <div className={styles.cardGrid}>
        {projects.length > 0 ? (
          projects.map((project) => (
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
        ) : (
          <p style={{ color: "#fff" }}>No projects found.</p>
        )}
      </div>

      {selectedProject && (
        <OutputProjectsModal
          project={selectedProject}
          onClose={clearSelectedProject}
        />
      )}
    </div>
  );
}
