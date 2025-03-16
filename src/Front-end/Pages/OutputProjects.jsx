import React, { useEffect } from "react";
import useProjects from "../Zustand-api/useProjects";
import useAuthStore from "../Zustand-api/Authentication";
import CreatorProjectModal from "./CreatorProjectModal";
import NonCreatorProjectModal from "./NonCreatorProjectModal";

import styles from "./OutputProjects.module.css";

export default function OutputProjects() {
  const { user } = useAuthStore();
  const {
    projects = [],
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

  console.log("User object:", user);
  console.log("Selected project:", selectedProject);
  console.log(
    "Comparing project.user_id vs user.id:",
    selectedProject?.user_id,
    "vs",
    user?.id
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Projects</h2>
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
              <h3 className={styles.cardTitle}>{project.proj_name}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <p className={styles.cardMeta}>
                Developers Needed: {project.dev_needed}
              </p>
              <p className={styles.cardMeta}>
                Days to Complete: {project.days_to_complete}
              </p>
            </div>
          ))
        ) : (
          <p className={styles.noProjects}>No projects found.</p>
        )}
      </div>

      {selectedProject && (
        <>
          {Number(selectedProject.user_id) === Number(user?.id) ? (
            <CreatorProjectModal
              project={selectedProject}
              onClose={clearSelectedProject}
            />
          ) : (
            <NonCreatorProjectModal
              project={selectedProject}
              onClose={clearSelectedProject}
            />
          )}
        </>
      )}
    </div>
  );
}
