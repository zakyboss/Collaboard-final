// File: src/Front-end/Components/VolunteersList.jsx
import React, { useState, useEffect } from "react";
import styles from "./VolunteersList.module.css";

/**
 * A sub-modal that shows:
 *  - A list of volunteers for this project
 *  - The tasks they want to do
 *  - A checkbox to approve them
 *  - A text field to update the WhatsApp link
 */
export default function VolunteersList({
  projId,
  onClose,
  isCreator = false,
  whatsappLink = "",
  onUpdateWhatsAppLink,
}) {
  const [volunteers, setVolunteers] = useState([]);
  const [localWhatsAppLink, setLocalWhatsAppLink] = useState(whatsappLink);

  useEffect(() => {
    fetchVolunteers();
    // eslint-disable-next-line
  }, [projId]);

  // 1) Fetch volunteers from DB
  async function fetchVolunteers() {
    try {
      const response = await fetch(
        `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${projId}`
      );
      const data = await response.json();
      setVolunteers(data.volunteers || []);
      console.log(volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  }

  // 2) Approve/unapprove volunteer
  async function handleCollaboratorChange(volunteer_id, checked) {
    try {
      const payload = { volunteer_id, approve: checked ? 1 : 0 };
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/ApproveVolunteer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (result.success) {
        // Refresh volunteers
        fetchVolunteers();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating collaborator status:", error);
    }
  }

  // 3) Save updated WhatsApp link
  function handleSaveWhatsAppLink() {
    if (onUpdateWhatsAppLink) {
      onUpdateWhatsAppLink(localWhatsAppLink);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2 className={styles.title}>Volunteers</h2>

        <table className={styles.volunteerTable}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>GitHub</th>
              <th>Task ID</th>
              <th>Approved?</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v) => (
              <tr key={v.volunteer_id}>
                {/* Photo */}
                <td>
                  <img
                    src={`https://collaboard-php-production.up.railway.app/ProfileUploads/${v.profile_photo}`}
                    alt="Volunteer"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>

                {/* Name */}
                <td>
                  {v.first_name} {v.last_name}
                </td>

                {/* GitHub */}
                <td>{v.github_username}</td>

                {/* Task */}
                <td>{v.task_id || "None"}</td>

                {/* Approved? */}
                <td>
                  {isCreator ? (
                    <input
                      type="checkbox"
                      checked={v.is_approved === "1" || v.is_approved === 1}
                      onChange={(e) =>
                        handleCollaboratorChange(
                          v.volunteer_id,
                          e.target.checked
                        )
                      }
                    />
                  ) : v.is_approved ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* If creator, show the WhatsApp link editing */}
        {isCreator && (
          <div className={styles.whatsappSection}>
            <label className={styles.whatsappLabel}>WhatsApp Group Link:</label>
            <input
              type="text"
              className={styles.whatsappInput}
              value={localWhatsAppLink}
              onChange={(e) => setLocalWhatsAppLink(e.target.value)}
            />
            <button
              className={styles.saveButton}
              onClick={handleSaveWhatsAppLink}
            >
              Save Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
