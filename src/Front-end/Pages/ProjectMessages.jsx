// File: src/Front-end/Pages/ProjectMessages.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../Zustand-api/Authentication";
import { checkIfUserIsAcceptedOrCreator } from "../../utils/volunteerAPI";
export default function ProjectMessages() {
  const { proj_id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    } else {
      checkAccess();
    }
  }, [isAuthenticated, user]);

  async function checkAccess() {
    const canAccess = await checkIfUserIsAcceptedOrCreator(parseInt(proj_id), user.id);
    if (!canAccess) {
      alert("You are not approved for messages on this project.");
      navigate("/");
    } else {
      setAllowed(true);
    }
  }

  if (!allowed) return null;

  return (
    <div style={{ color: "#fff", padding: "2rem" }}>
      <h2>Project #{proj_id} Messages</h2>
      <p>Here you can implement a chat or message board for volunteers and the creator.</p>
    </div>
  );
}
