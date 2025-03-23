import React, { useState, useEffect } from "react";
import useAuthStore from "../Zustand-api/Authentication";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";

export default function EditProfile() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      alert("You must be logged in to edit your profile.");
      navigate("/login");
    } else {
      console.log("Current user object:", user); // Debug user object
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError("");
    
    // Determine the correct user ID property
    const userId = user.id || user.userId || user.user_id || user.ID;
    
    console.log("User object:", user);
    console.log("User ID being used:", userId);
    
    // Validate user ID before submitting
    if (!userId || userId <= 0) {
      setError("Invalid user ID. Please log in again.");
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    
    // For debugging - log the form data
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    
    try {
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/UpdateProfile.php",
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) {
        console.error("Server response not OK:", response.status, response.statusText);
      }
      
      const result = await response.json();
      console.log("Server response:", result);
      
      if (result.success) {
        alert("Profile updated successfully! Please re-login to see changes.");
        navigate("/");
      } else {
        setError(result.message || "Failed to update profile");
        console.error("Server error details:", result);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while connecting to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>Edit Profile</h2>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
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
        
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
      
      {/* Debug section - you can remove this in production */}
      <div className={styles.debugInfo} style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f5f5f5' }}>
        <h3>Debug Information</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User available: {user ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p>User ID properties found:</p>
            <ul>
              <li>user.id: {user.id || 'Not found'}</li>
              <li>user.userId: {user.userId || 'Not found'}</li>
              <li>user.user_id: {user.user_id || 'Not found'}</li>
              <li>user.ID: {user.ID || 'Not found'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}