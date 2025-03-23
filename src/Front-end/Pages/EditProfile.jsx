// File: src/Front-end/Pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import useAuthStore from "../Zustand-api/Authentication";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";
import BackButton from "../Components/BackButton";

export default function EditProfile() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      alert("You must be logged in to edit your profile.");
      navigate("/login");
    } else {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    try {
      const response = await fetch(
         "https://collaboard-php-production.up.railway.app/UpdateProfile.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (result.success) {
        // Update the user in the auth store with new info
        if (result.user) {
          updateUser(result.user);
        }
        alert("Profile updated successfully!");
        // Optionally, navigate to another page if needed:
        // navigate("/profile");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* <BackButton/> */}
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Profile Photo (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
