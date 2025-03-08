// File: src/Front-end/Pages/modals/NonCreatorProjectModal.jsx
import React, { useState, useEffect } from "react";
import styles from "./ModalCommon.module.css";
import VolunteerForm from "./VolunteerForm";
import { fetchTasksForProject } from "../../utils/taskAPI";
import { checkIfUserIsAccepted } from "../../utils/volunteerAPI";
import useAuthStore from "../Zustand-api/Authentication";
import { useNavigate } from "react-router-dom";

export default function NonCreatorProjectModal({ project, onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    loadTasks(project.proj_id);
    if (isAuthenticated) {
      loadVolunteerStatus();
    }
  }, [project.proj_id, isAuthenticated]);

  async function loadTasks(proj_id) {
    const data = await fetchTasksForProject(proj_id);
    setTasks(data || []);
  }

  async function loadVolunteerStatus() {
    const accepted = await checkIfUserIsAccepted(project.proj_id, user.id);
    setIsAccepted(accepted);
  }

  // Download PDF
  function handleDownloadPDF() {
    if (project.pdf_file) {
      window.open(
       `https://collaboard-php-production.up.railway.app/uploads/${project.pdf_file}`,
        "_blank"
      );
    }
  }

  // If user is accepted, show a messages icon
  const handleMessagesClick = () => {
    // e.g. navigate to /project-messages/:proj_id
    navigate(`/project-messages/${project.proj_id}`);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {showVolunteerForm && (
          <VolunteerForm
            projId={project.proj_id}
            tasks={tasks}
            onClose={() => setShowVolunteerForm(false)}
          />
        )}

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        <h2>{project.proj_name}</h2>
        <p>{project.description}</p>
        {project.pdf_file && (
          <button onClick={handleDownloadPDF}>Download PDF</button>
        )}

        <h3>Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.task_id} className={styles.taskItem}>
              {task.is_done === 1 ? "✓" : "✗"}
              <strong>{task.task_name}</strong> - {task.duration} days
            </li>
          ))}
        </ul>

        {/* If user is not accepted, show volunteer button */}
        {!isAccepted && isAuthenticated && (
          <button onClick={() => setShowVolunteerForm(true)}>
            Volunteer
          </button>
        )}

        {/* If accepted, show messages icon */}
        {isAccepted && (
          <button onClick={handleMessagesClick}>
            <i className="fas fa-comments"></i> Messages
          </button>
        )}
      </div>
    </div>
  );
}
