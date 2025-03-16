import React, { useState } from "react";
import useAuthStore from "../Zustand-api/Authentication";
import styles from "./VolunteerForm.module.css";

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
        if (onClose) onClose(); // Notify parent to update volunteer status
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error volunteering:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2 className={styles.title}>Volunteer</h2>

        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>GitHub Username</label>
          <input
            type="text"
            className={styles.formInput}
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            required
          />

          <label className={styles.formLabel}>Select Task (Optional)</label>
          <select
            className={styles.formInput}
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

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
