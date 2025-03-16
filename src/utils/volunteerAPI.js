// File: src/utils/volunteerAPI.js

// Submit volunteer request
export async function volunteerForProject(payload) {
  try {
    const response = await fetch("https://collaboard-php-production.up.railway.app/Volunteer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error volunteering:", error);
    return { success: false, message: "Network error" };
  }
}

// Fetch volunteers
export async function getVolunteers(proj_id) {
  try {
    const response = await fetch(
      `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${proj_id}`
    );
    const data = await response.json();
    return data.volunteers;
  } catch (error) {
    console.error("Error getting volunteers:", error);
    return [];
  }
}

// Approve or unapprove volunteer
export async function approveVolunteer(volunteer_id, approve) {
  try {
    const response = await fetch(
      "https://collaboard-php-production.up.railway.app/ApproveVolunteer.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id, approve }),
      }
    );
    const result = await response.json();
    return result; // { success: boolean, message: string }
  } catch (error) {
    console.error("Error approving volunteer:", error);
    return { success: false, message: "Network error" };
  }
}

// Check if user is accepted or the project creator
export async function checkIfUserIsAcceptedOrCreator(proj_id, user_id) {
  try {
    // 1) Fetch all projects to find the correct project
    const projectsResp = await fetch("https://collaboard-php-production.up.railway.app/GetProjects.php");
    const projectsData = await projectsResp.json();
    const project = projectsData.projects.find(p => p.proj_id == proj_id);
    if (!project) return false;

    // 2) If user is the project creator
    if (project.user_id == user_id) return true;

    // 3) Otherwise, check volunteers
    const volunteersResp = await fetch(
      `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${proj_id}`
    );
    const volunteersData = await volunteersResp.json();
    const volunteers = volunteersData.volunteers || [];
    const found = volunteers.find(
      (v) => v.user_id == user_id && (v.is_approved == "1" || v.is_approved == 1)
    );
    return !!found;
  } catch (error) {
    console.error("Error checking user acceptance:", error);
    return false;
  }
}
