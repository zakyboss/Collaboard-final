import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../Zustand-api/Authentication";
import useProjects from "../Zustand-api/useProjects";
import { markTaskDone, fetchTasksForProject } from "../../utils/taskAPI";
import VolunteersList from "./VolunteersList";
import styles from "./CreatorProjectModal.module.css";

/**
 * This modal appears when a logged-in user (the project creator) clicks on their project.
 * It displays:
 *  - A list of tasks with "done" checkboxes and who is assigned to them
 *  - Buttons to edit the project, open Volunteers & WhatsApp Link sub-modal, and open Messages
 */
export default function CreatorProjectModal({ project, onClose }) {
  const { user, isAuthenticated } = useAuthStore();
  const { updateProject } = useProjects();
  const navigate = useNavigate();

  // Fetched tasks for this project
  const [tasks, setTasks] = useState([]);
  // Fetched volunteers for this project (for showing assigned volunteers)
  const [volunteers, setVolunteers] = useState([]);

  // Edit mode fields
  const [editMode, setEditMode] = useState(false);
  const [projName, setProjName] = useState(project.proj_name);
  const [description, setDescription] = useState(project.description);
  const [tempTasks, setTempTasks] = useState([]);

  // For showing the Volunteers sub-modal
  const [showVolunteers, setShowVolunteers] = useState(false);

  // WhatsApp link for this project
  const [whatsappLink, setWhatsAppLink] = useState(project.whatsapp_link || "");

  // 1) Load tasks & volunteers when modal opens
  useEffect(() => {
    loadTasks(project.proj_id);
    loadVolunteers(project.proj_id);
  }, [project.proj_id]);

  async function loadTasks(proj_id) {
    const data = await fetchTasksForProject(proj_id);
    setTasks(data || []);
  }

  async function loadVolunteers(proj_id) {
    try {
      const response = await fetch(
        `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${proj_id}`
      );
      const json = await response.json();
      setVolunteers(json.volunteers || []);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  }

  // 2) For marking tasks as done/undone
  async function handleMarkDone(task_id, is_done) {
    const success = await markTaskDone(task_id, is_done);
    if (success) {
      // Refresh tasks
      loadTasks(project.proj_id);
    }
  }

  // 3) Editing the project & tasks
  function startEdit() {
    setEditMode(true);
    setTempTasks(tasks.map((t) => ({ ...t }))); // clone tasks
  }

  function cancelEdit() {
    setEditMode(false);
  }

  function handleTaskChange(index, field, value) {
    const updated = [...tempTasks];
    updated[index][field] = value;
    setTempTasks(updated);
  }

  function addTask() {
    setTempTasks([...tempTasks, { task_name: "", duration: "" }]);
  }

  function removeTask(index) {
    setTempTasks(tempTasks.filter((_, i) => i !== index));
  }

  async function saveChanges() {
    // We only pass name, description, tasks
    const cleanedTasks = tempTasks.map((task) => ({
      task_name: task.task_name,
      duration: task.duration,
      // add more fields if your DB requires them
    }));
    await updateProject(project.proj_id, projName, description, cleanedTasks);
    setEditMode(false);
    loadTasks(project.proj_id);
  }

  // 4) Download PDF
  function handleDownloadPDF() {
    if (project.pdf_file) {
      window.open(
        `https://collaboard-php-production.up.railway.app/uploads/${project.pdf_file}`,
        "_blank"
      );
    }
  }

  // 5) Update WhatsApp link in DB
  async function updateWhatsAppLink(newLink) {
    try {
      const payload = { proj_id: project.proj_id, whatsapp_link: newLink };
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/UpdateWhatsAppGroup.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("WhatsApp group link updated!");
        setWhatsAppLink(newLink);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating WhatsApp link:", error);
      alert("Failed to update WhatsApp link.");
    }
  }

  // 6) Determine who is assigned to each task
  // A volunteer is assigned if: volunteer.task_id === task.task_id && volunteer.is_approved == 1
  function getAssignedVolunteerName(task_id) {
    const vol = volunteers.find(
      (v) => v.task_id === String(task_id) || v.task_id === task_id
    );
    if (vol && (vol.is_approved === "1" || vol.is_approved === 1)) {
      return `${vol.first_name} ${vol.last_name}`;
    }
    return "Not assigned yet";
  }

  // 7) Render
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Volunteers sub-modal */}
        {showVolunteers && (
          <VolunteersList
            projId={project.proj_id}
            onClose={() => {
              setShowVolunteers(false);
              // Refresh volunteer list after sub-modal closes
              loadVolunteers(project.proj_id);
            }}
            isCreator={true}
            whatsappLink={whatsappLink}
            onUpdateWhatsAppLink={updateWhatsAppLink}
          />
        )}

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {/* If not editing and not showing volunteers sub-modal */}
        {!editMode && !showVolunteers && (
          <>
            <h2 className={styles.modalTitle}>{project.proj_name}</h2>
            <p className={styles.modalDescription}>{project.description}</p>

            {project.pdf_file && (
              <button className={styles.actionButton} onClick={handleDownloadPDF}>
                Download PDF
              </button>
            )}

            <h3 className={styles.tasksTitle}>Tasks</h3>
            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Done?</th>
                  <th>Task Name</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.task_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={task.is_done === 1}
                        onChange={(e) =>
                          handleMarkDone(task.task_id, e.target.checked ? 1 : 0)
                        }
                      />
                    </td>
                    <td>{task.task_name}</td>
                    <td>{getAssignedVolunteerName(task.task_id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.buttonRow}>
              <button className={styles.actionButton} onClick={startEdit}>
                Edit Project
              </button>
              <button
                className={styles.actionButton}
                onClick={() => setShowVolunteers(true)}
              >
                Volunteers & WhatsApp Link
              </button>
              <button
                className={styles.actionButton}
                onClick={() => navigate(`/project-messages/${project.proj_id}`)}
              >
                Messages
              </button>
            </div>
          </>
        )}

        {/* Edit mode */}
        {editMode && (
          <>
            <h2 className={styles.modalTitle}>Edit Project</h2>
            <input
              className={styles.textInput}
              type="text"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
            />
            <textarea
              className={styles.textArea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h3 className={styles.tasksTitle}>Tasks</h3>
            {tempTasks.map((task, index) => (
              <div key={index} className={styles.taskRow}>
                <input
                  className={styles.textInput}
                  type="text"
                  value={task.task_name}
                  onChange={(e) =>
                    handleTaskChange(index, "task_name", e.target.value)
                  }
                />
                <input
                  className={styles.textInput}
                  type="text"
                  value={task.duration || ""}
                  placeholder="Duration or Description"
                  onChange={(e) =>
                    handleTaskChange(index, "duration", e.target.value)
                  }
                />
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeTask(index)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              className={styles.actionButton}
              type="button"
              onClick={addTask}
            >
              + Add Task
            </button>

            <div className={styles.buttonRow}>
              <button className={styles.actionButton} onClick={saveChanges}>
                Save
              </button>
              <button className={styles.actionButton} onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
