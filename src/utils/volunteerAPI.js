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
      const response = await fetch( "https://collaboard-php-production.up.railway.app/ApproveVolunteer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volunteer_id, approve }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error approving volunteer:", error);
      return false;
    }
  }
  
  // Check if user is accepted
  export async function checkIfUserIsAccepted(proj_id, user_id) {
    try {
      // Simple approach: fetch volunteers, see if user is_approved=1
      const response = await fetch(
        `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${proj_id}`
      );
      const data = await response.json();
      const volunteers = data.volunteers || [];
      const found = volunteers.find(
        (v) => v.user_id === user_id && v.is_approved === "1"
      );
      return !!found;
    } catch (error) {
      console.error("Error checking volunteer status:", error);
      return false;
    }
  }
  
  // Check if user is accepted or creator for messages
  export async function checkIfUserIsAcceptedOrCreator(proj_id, user_id) {
    try {
      // 1) Possibly fetch project to see if user_id == user
      // 2) Or fetch volunteers to see if user is_approved=1
      // This is a naive approach:
      const projectResp = await fetch( "https://collaboard-php-production.up.railway.app/GetProjects.php");
      const projectData = await projectResp.json();
      const allProjects = projectData.projects || [];
      const project = allProjects.find((p) => p.proj_id == proj_id);
  
      if (!project) return false;
      if (project.user_id == user_id) return true; // creator
  
      // Otherwise check volunteer
      const volunteersResp = await fetch(
       `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${proj_id}`
      );
      const volunteersData = await volunteersResp.json();
      const volunteers = volunteersData.volunteers || [];
      const found = volunteers.find(
        (v) => v.user_id == user_id && v.is_approved == 1
      );
      return !!found;
    } catch (error) {
      console.error("Error checking messages access:", error);
      return false;
    }
  }
  