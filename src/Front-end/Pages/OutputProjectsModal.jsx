import React, { useState, useEffect } from "react";

import useProjects from "../Zustand-api/useProjects";

import styles from "./OutputProjectsModal.module.css";

import useAuthStore from "../Zustand-api/Authentication";

import VolunteersList from "./VolunteersList";

import VolunteerForm from "./VolunteerForm";

export default function OutputProjectsModal({ onClose }) {
  const { selectedProject, updateProject } = useProjects();
  // console.log(selectedProject);
  const { user, isAuthenticated } = useAuthStore();

  const [tasks, setTasks] = useState([]);

  const [editMode, setEditMode] = useState(false);

  // For editing tasks

  const [projName, setProjName] = useState("");

  const [description, setDescription] = useState("");

  const [tempTasks, setTempTasks] = useState([]);

  // Show/Hide volunteers list, volunteer form, etc.

  const [showVolunteers, setShowVolunteers] = useState(false);

  const [showVolunteerForm, setShowVolunteerForm] = useState(false);

  // Check if user is an approved volunteer

  const [isApprovedVolunteer, setIsApprovedVolunteer] = useState(false);

  useEffect(() => {
    if (!selectedProject) return;

    setProjName(selectedProject.proj_name);

    setDescription(selectedProject.description);

    fetchTasks(selectedProject.proj_id);

    // If user is logged in and not the creator, check if they're approved

    if (isAuthenticated && user && user.id !== selectedProject.user_id) {
      checkIfApprovedVolunteer(selectedProject.proj_id, user.id);
    } else {
      setIsApprovedVolunteer(false);
    }
  }, [selectedProject]);

  const checkIfApprovedVolunteer = async (projId, userId) => {
    try {
      const payload = { proj_id: projId, user_id: userId };

      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/CheckVolunteerStatus.php",
        {
          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      setIsApprovedVolunteer(result.isApprovedVolunteer);
    } catch (error) {
      console.error("Error checking volunteer status:", error);
    }
  };

  const fetchTasks = async (proj_id) => {
    try {
      const response = await fetch(
        `https://collaboard-php-production.up.railway.app/GetTasks.php?proj_id=${proj_id}`
      );

      const data = await response.json();

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const isCreator = isAuthenticated && user?.id === selectedProject?.user_id;

  const startEdit = () => {
    setEditMode(true);

    setTempTasks(tasks.map((t) => ({ ...t }))); // clone tasks
  };

  const cancelEdit = () => {
    setEditMode(false);
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...tempTasks];

    updated[index][field] = value;

    setTempTasks(updated);
  };

  const addTask = () => {
    setTempTasks([...tempTasks, { task_name: "", duration: "" }]);
  };

  const removeTask = (index) => {
    setTempTasks(tempTasks.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    const cleanedTasks = tempTasks.map((task) => ({
      task_name: task.task_name,

      duration: task.duration,
    }));

    await updateProject(
      selectedProject.proj_id,
      projName,
      description,
      cleanedTasks
    );

    setEditMode(false);

    fetchTasks(selectedProject.proj_id);
  };

  if (!selectedProject) return null;

  // PDF Download

  const handleDownloadPDF = () => {
    if (selectedProject.pdf_file) {
      window.open(
        `https://collaboard-php-production.up.railway.app/uploads/${selectedProject.pdf_file}`,

        "_blank"
      );
    }
  };

  // A placeholder for chat

  const handleMessages = () => {
    // you might route to: navigate(`/project/${selectedProject.proj_id}/messages`);

    alert("Open the chat page for this project!");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {/* Volunteers modal */}

        {showVolunteers && (
          <VolunteersList
            projId={selectedProject.proj_id}
            onClose={() => setShowVolunteers(false)}
          />
        )}

        {/* Volunteer form */}

        {showVolunteerForm && (
          <VolunteerForm
            projId={selectedProject.proj_id}
            tasks={tasks}
            onClose={() => setShowVolunteerForm(false)}
          />
        )}

        {!editMode && !showVolunteers && !showVolunteerForm && (
          <>
            <h2>{selectedProject.proj_name}</h2>

            <p>{selectedProject.description}</p>

            <p>
              <strong>Developers Needed:</strong> {selectedProject.dev_needed}
            </p>

            <p>
              <strong>Days to Complete:</strong>{" "}
              {selectedProject.days_to_complete}
            </p>

            {selectedProject.pdf_file && (
              <button onClick={handleDownloadPDF}>Download PDF</button>
            )}

            <h3>Tasks</h3>

            <ul>
              {tasks.map((task) => (
                <li key={task.task_id}>
                  {/* If you want to show is_done logic, do it here */}
                  {task.task_name} - {task.duration} days
                </li>
              ))}
            </ul>

            {/* If creator, show Edit + Volunteers */}

            {isCreator && (
              <>
                <button onClick={startEdit}>Edit Project</button>

                <button onClick={() => setShowVolunteers(true)}>
                  View Volunteers
                </button>
              </>
            )}

            {/* If not creator but logged in, show volunteer */}

            {!isCreator && isAuthenticated && (
              <button onClick={() => setShowVolunteerForm(true)}>
                Volunteer
              </button>
            )}

            {/* If creator or isApprovedVolunteer => show messages */}

            {(isCreator || isApprovedVolunteer) && (
              <button onClick={handleMessages}>
                <i className="fas fa-comments"></i> Messages
              </button>
            )}
          </>
        )}

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
