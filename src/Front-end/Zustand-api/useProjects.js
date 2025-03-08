// File: src/Zustand-api/useProjects.js
import { create } from "zustand";

const useProjects = create((set) => ({
  projects: [],
  selectedProject: null,

  fetchProjects: async () => {
    try {
      const response = await fetch("https://collaboard-php-production.up.railway.app/GetProjects.php");
      const data = await response.json();
      set({ projects: data.projects || [] });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  },

  selectProject: (project) => set({ selectedProject: project }),
  clearSelectedProject: () => set({ selectedProject: null }),

  // updateProject modifies name/description/tasks
  updateProject: async (proj_id, projectName, description, tasks) => {
    try {
      const payload = { proj_id, projectName, description, tasks };
      const response = await fetch(
         "https://collaboard-php-production.up.railway.app/UpdateProject.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        set((state) => {
          const updated = state.projects.map((p) =>
            p.proj_id === proj_id
              ? { ...p, proj_name: projectName, description }
              : p
          );
          return { projects: updated, selectedProject: null };
        });
        alert("Project updated successfully!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project.");
    }
  },
}));

export default useProjects;
