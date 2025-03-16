// File: src/Front-end/Pages/CreateProjects.jsx
import React, { useState, useEffect } from "react";
import styles from "./CreateProjects.module.css";
import useAuthStore from "../Zustand-api/Authentication";
import { useNavigate } from "react-router-dom";

export default function CreateProjects() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  // Each task has task_name and task_description
  const [tasks, setTasks] = useState([{ task_name: "", task_description: "" }]);
  const [thumbnail, setThumbnail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [devNeeded, setDevNeeded] = useState(1);
  const [daysToComplete, setDaysToComplete] = useState(30);

  useEffect(() => {
    if (!isAuthenticated) {
      alert("You must be logged in to create a project.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const addTask = () => {
    setTasks([...tasks, { task_name: "", task_description: "" }]);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("tasks", JSON.stringify(tasks));
    formData.append("devNeeded", devNeeded);
    formData.append("daysToComplete", daysToComplete);
    formData.append("userId", user.id); // ***IMPORTANT***

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (pdfFile) {
      formData.append("pdfFile", pdfFile);
    }

    try {
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/CreateProject.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Project created successfully!");
        setProjectName("");
        setDescription("");
        setTasks([{ task_name: "", task_description: "" }]);
        setThumbnail(null);
        setPdfFile(null);
        setDevNeeded(1);
        setDaysToComplete(30);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Developers Needed</label>
        <input
          type="number"
          min="1"
          value={devNeeded}
          onChange={(e) => setDevNeeded(e.target.value)}
          required
        />

        <label>Days to Complete</label>
        <input
          type="number"
          min="1"
          value={daysToComplete}
          onChange={(e) => setDaysToComplete(e.target.value)}
          required
        />

        <label>Thumbnail (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <label>PDF File (Optional)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />

        <h3>Tasks</h3>
        {tasks.map((task, index) => (
          <div key={index} className={styles.taskRow}>
            <input
              type="text"
              placeholder="Task Name"
              value={task.task_name}
              onChange={(e) =>
                handleTaskChange(index, "task_name", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Task Description"
              value={task.task_description}
              onChange={(e) =>
                handleTaskChange(index, "task_description", e.target.value)
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
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}
