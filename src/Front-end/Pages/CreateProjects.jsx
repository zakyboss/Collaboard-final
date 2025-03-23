import React, { useState, useEffect } from "react";
import styles from "./CreateProjects.module.css";
import useAuthStore from "../Zustand-api/Authentication";
import { useNavigate } from "react-router-dom";
import BackButton from "../Components/BackButton";

export default function CreateProjects() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
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
    formData.append("projName", projectName);
    formData.append("description", description);
    formData.append("tasks", JSON.stringify(tasks));
    formData.append("devNeeded", devNeeded);
    formData.append("daysToComplete", daysToComplete);
    formData.append("userId", user.id);

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (pdfFile) formData.append("pdf_file", pdfFile);

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
      <BackButton />
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Project Name</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            placeholder="Describe your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Developers Needed</label>
          <input
            type="number"
            min="1"
            value={devNeeded}
            onChange={(e) => setDevNeeded(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Days to Complete</label>
          <input
            type="number"
            min="1"
            value={daysToComplete}
            onChange={(e) => setDaysToComplete(e.target.value)}
            required
          />
        </div>

        <div className={styles.fileUpload}>
          <label>Thumbnail (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        <div className={styles.fileUpload}>
          <label>PDF File (Optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </div>

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
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeTask(index)}
            >
              ✖
            </button>
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addTask}>
          + Add Task
        </button>
        <button type="submit" className={styles.submitBtn}>
          Create Project
        </button>
      </form>
    </div>
  );
}
