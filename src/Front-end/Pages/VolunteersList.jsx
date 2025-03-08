// File: src/Front-end/Pages/VolunteersList.jsx
import React, { useState, useEffect } from "react";

export default function VolunteersList({ projId, onClose }) {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch(
       `https://collaboard-php-production.up.railway.app/GetVolunteers.php?proj_id=${projId}`
      );
      const data = await response.json();
      setVolunteers(data.volunteers || []);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const handleApprove = async (volunteer_id, approve) => {
    try {
      const payload = { volunteer_id, approve };
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
        fetchVolunteers();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Volunteers</h2>
        <ul>
          {volunteers.map((v) => (
            <li key={v.volunteer_id} style={styles.item}>
              <strong>{v.first_name} {v.last_name}</strong>
              <br /> GitHub: {v.github_username}
              <br /> Approved: {v.is_approved ? "Yes" : "No"}
              <div style={styles.actions}>
                <button onClick={() => handleApprove(v.volunteer_id, 1)}>Approve</button>
                <button onClick={() => handleApprove(v.volunteer_id, 0)}>Unapprove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "2rem",
    borderRadius: "8px",
    width: "500px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  item: {
    marginBottom: "1rem",
  },
  actions: {
    marginTop: "0.5rem",
  },
};
