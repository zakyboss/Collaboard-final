import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Zustand-api/Authentication";
import styles from "./EditProfile.module.css";

export default function EditProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError]         = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Make sure user is logged in
    if (!isAuthenticated || !user) {
      alert("You must be logged in to edit your profile.");
      navigate("/login");
      return;
    }
    // Initialize fields
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Ensure we have a valid user ID
    const userId = user.id || user.userId || user.user_id;
    if (!userId || userId <= 0) {
      setError("Invalid user ID. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      // Debug
      console.log("Submitting form data:", {
        userId,
        firstName,
        lastName,
        profilePhoto,
      });

      // Make the request
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/UpdateProfile.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Server response:", result);

      if (result.success) {
        alert("Profile updated successfully! Please re-login to see changes.");
        navigate("/");
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Profile</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}

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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
