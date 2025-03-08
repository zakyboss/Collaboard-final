// File: src/Front-end/Pages/modals/CreatorProjectModal.jsx
import React, { useState, useEffect } from "react";
import useProjects from "../Zustand-api/useProjects";
import styles from "./ModalCommon.module.css";
import VolunteersList from "./VolunteersList";
import { markTaskDone, fetchTasksForProject } from "../../utils/taskAPI";
import { useNavigate } from "react-router";

export default function CreatorProjectModal({ project, onClose }) {
  const { updateProject } = useProjects();
  const navigate = useNavigate();
  // Tasks
  const [tasks, setTasks] = useState([]);
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [projName, setProjName] = useState(project.proj_name);
  const [description, setDescription] = useState(project.description);
  const [tempTasks, setTempTasks] = useState([]);

  // Volunteers
  const [showVolunteers, setShowVolunteers] = useState(false);

  useEffect(() => {
    loadTasks(project.proj_id);
  }, [project.proj_id]);

  async function loadTasks(proj_id) {
    const data = await fetchTasksForProject(proj_id);
    setTasks(data || []);
  }

  function startEdit() {
    setEditMode(true);
    setTempTasks(tasks.map((t) => ({ ...t })));
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
    const cleanedTasks = tempTasks.map((task) => ({
      task_name: task.task_name,
      duration: task.duration,
    }));

    await updateProject(project.proj_id, projName, description, cleanedTasks);
    setEditMode(false);
    loadTasks(project.proj_id);
  }

  // Mark a task done/undone
  async function handleMarkDone(task_id, is_done) {
    const success = await markTaskDone(task_id, is_done);
    if (success) {
      loadTasks(project.proj_id);
    }
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Volunteers List */}
        {showVolunteers && (
          <VolunteersList
            projId={project.proj_id}
            onClose={() => setShowVolunteers(false)}
          />
        )}

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {!editMode && !showVolunteers && (
          <>
            <h2>{project.proj_name}</h2>
            <p>{project.description}</p>
            {project.pdf_file && (
              <button onClick={handleDownloadPDF}>Download PDF</button>
            )}

            <h3>Tasks</h3>
            <ul>
              {tasks.map((task) => (
                <li key={task.task_id} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={task.is_done === 1}
                    onChange={(e) =>
                      handleMarkDone(task.task_id, e.target.checked ? 1 : 0)
                    }
                  />
                  <strong>{task.task_name}</strong> - {task.duration} days
                </li>
              ))}
            </ul>

            <button onClick={startEdit}>Edit Project</button>
            <button onClick={() => setShowVolunteers(true)}>Volunteers</button>
            {/* Optionally: a messages button if you want the creator to have a chat */}
            <button
              onClick={() => navigate(`/project-messages/${project.proj_id}`)}
            >
              Messages
            </button>
          </>
        )}

        {/* Edit Mode */}
        {editMode && (
          <>
            <h2>Edit Project</h2>
            <input
              type="text"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <h3>Tasks</h3>
            {tempTasks.map((task, index) => (
              <div key={index} className={styles.taskRow}>
                <input
                  type="text"
                  value={task.task_name}
                  onChange={(e) =>
                    handleTaskChange(index, "task_name", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={task.duration}
                  onChange={(e) =>
                    handleTaskChange(index, "duration", e.target.value)
                  }
                />
                <button type="button" onClick={() => removeTask(index)}>
                  ✖
                </button>
              </div>
            ))}
            <button type="button" onClick={addTask}>
              + Add Task
            </button>
            <div className={styles.editButtons}>
              <button onClick={saveChanges}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
