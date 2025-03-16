// File: src/utils/taskAPI.js

export async function fetchTasksForProject(proj_id) {
  try {
    const response = await fetch(
      `https://collaboard-php-production.up.railway.app/GetTasks.php?proj_id=${proj_id}`
    );
    const data = await response.json();
    return data.tasks; // returns an array of tasks
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function markTaskDone(task_id, is_done) {
  try {
    const response = await fetch(
      "https://collaboard-php-production.up.railway.app/MarkTaskDone.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id, is_done }),
      }
    );
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error marking task done:", error);
    return false;
  }
}
