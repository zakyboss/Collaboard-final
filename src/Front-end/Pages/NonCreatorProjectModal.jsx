// File: src/Front-end/Components/NonCreatorProjectModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Zustand-api/Authentication";
import { fetchTasksForProject } from "../../utils/taskAPI";
import VolunteerForm from "./VolunteerForm";
import styles from "./NonCreatorProjectModal.module.css";

export default function NonCreatorProjectModal({ project, onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [tasks, setTasks] = useState([]);
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  // volunteerStatus can be "none", "pending", or "approved"
  const [volunteerStatus, setVolunteerStatus] = useState("none");

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

  // Fetch volunteers for the project and determine status for the current user.
  async function loadVolunteerStatus() {
    try {
      const response = await fetch(
        `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${project.proj_id}`
      );
      const data = await response.json();
      const volunteers = data.volunteers || [];
      // Compare user IDs as strings to avoid type issues
      const volunteer = volunteers.find(
        (v) => String(v.user_id) === String(user.id)
      );
      if (volunteer) {
        if (volunteer.is_approved === "1" || volunteer.is_approved === 1) {
          setVolunteerStatus("approved");
        } else {
          setVolunteerStatus("pending");
        }
      } else {
        setVolunteerStatus("none");
      }
    } catch (error) {
      console.error("Error checking volunteer status:", error);
      setVolunteerStatus("none");
    }
  }

  function handleDownloadPDF() {
    if (project.pdf_file) {
      // PDF files are stored in "/uploads"
      window.open(
        `https://collaboard-php-production.up.railway.app/uploads/${project.pdf_file}`,
        "_blank"
      );
    }
  }

  // When approved, clicking messages shows the WhatsApp group link
  const handleMessagesClick = () => {
    if (project.whatsapp_link) {
      alert(`Join the WhatsApp group: ${project.whatsapp_link}`);
    } else {
      alert("No WhatsApp group link has been set for this project.");
    }
  };

  // Callback after volunteer form submission
  const onVolunteerSuccess = () => {
    setShowVolunteerForm(false);
    // After volunteering, set status to pending (unless auto-approved)
    setVolunteerStatus("pending");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Show volunteer form if user clicks "Volunteer" */}
        {showVolunteerForm && (
          <VolunteerForm
            projId={project.proj_id}
            tasks={tasks}
            onClose={onVolunteerSuccess}
          />
        )}

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {/* Display project thumbnail (from "uploads") unconditionally */}
        {project.thumbnail && (
          <img
            src={`https://collaboard-php-production.up.railway.app/uploads/${project.thumbnail}`}
            alt="Project Thumbnail"
            style={{ width: "100%", maxWidth: "400px", marginBottom: "10px" }}
          />
        )}

        <h2 className={styles.modalTitle} style={{ color: "black" }}>
          {project.proj_name}
        </h2>
        <p className={styles.modalDescription}>{project.description}</p>

        {project.pdf_file && (
          <button className={styles.actionButton} onClick={handleDownloadPDF}>
            Download PDF
          </button>
        )}

        <h3 className={styles.tasksTitle} style={{ color: "black" }}>
          Tasks
        </h3>
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.task_id} className={styles.taskItem}>
              {task.is_done == 1 ? "✓" : "✗"} <strong>{task.task_name}</strong>{" "}
              - {task.duration} days
            </li>
          ))}
        </ul>

        {/* Conditional rendering based on volunteerStatus */}
        <div className={styles.buttonRow}>
          {volunteerStatus === "none" && isAuthenticated && (
            <button
              className={styles.actionButton}
              onClick={() => setShowVolunteerForm(true)}
            >
              Volunteer
            </button>
          )}
          {volunteerStatus === "pending" && (
            <div className={styles.pendingLabel}>Pending</div>
          )}
          {volunteerStatus === "approved" && (
            <button
              className={styles.actionButton}
              onClick={handleMessagesClick}
            >
              <i className="fas fa-comments"></i> Messages
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
