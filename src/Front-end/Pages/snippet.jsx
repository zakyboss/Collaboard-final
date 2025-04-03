import React, { useState, useEffect } from "react";
import useProjects from "../Zustand-api/useProjects";
import useAuthStore from "../Zustand-api/Authentication";
import styles from "./OutputProjectsModal.module.css";

export default function OutputProjectsModal({ onClose }) {
  const { selectedProject, updateProject } = useProjects();
  const { user, isAuthenticated } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [projName, setProjName] = useState("");
  const [description, setDescription] = useState("");
  const isCreator = isAuthenticated && user?.id === selectedProject?.user_id;
  useEffect(() => {
    if (selectedProject) {
      setProjName(selectedProject.proj_name);
      setDescription(selectedProject.description);
    }
  }, [selectedProject]);

  const saveChanges = async () => {
    await updateProject(selectedProject.proj_id, projName, description);
    setEditMode(false);
  };
  if (!selectedProject) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        {editMode ? (
          <>
            <input value={projName} onChange={(e) => setProjName(e.target.value)} />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <button onClick={saveChanges}>Save</button>
          </>
        ) : (
          <>
            <h2>{projName}</h2>
            <p>{description}</p>
            {isCreator && <button onClick={() => setEditMode(true)}>Edit Project</button>}
          </>
        )}
      </div>
    </div>
  );
}
