// File: src/Front-end/Pages/VolunteerForm.jsx
import React, { useState } from "react";
import useAuthStore from "../Zustand-api/Authentication";

export default function VolunteerForm({ projId, tasks, onClose }) {
  const { user, isAuthenticated } = useAuthStore();
  const [githubUsername, setGithubUsername] = useState("");
  const [selectedTask, setSelectedTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert("You must be logged in to volunteer.");
      return;
    }

    try {
      const payload = {
        proj_id: projId,
        user_id: user.id,
        github_username: githubUsername,
        task_id: selectedTask ? parseInt(selectedTask) : null,
      };

      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/Volunteer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("You have volunteered successfully!");
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error volunteering:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Volunteer</h2>
        <form onSubmit={handleSubmit}>
          <label>GitHub Username</label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            required
          />

          <label>Select Task (Optional)</label>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">-- No Specific Task --</option>
            {tasks.map((t) => (
              <option key={t.task_id} value={t.task_id}>
                {t.task_name}
              </option>
            ))}
          </select>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "2rem",
    borderRadius: "8px",
    width: "400px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};
