// File: src/Pages/Signup.jsx
import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
    yearsOfExperience: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch(
        "https://collaboard-php-production.up.railway.app/Signup.php",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          onChange={handleChange}
          value={formData.firstName}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          onChange={handleChange}
          value={formData.lastName}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
        />

        <label>Profile Photo (Optional)</label>
        <input
          type="file"
          name="profilePhoto"
          accept="image/*"
          onChange={handleChange}
        />

        <label>Years of Experience (Optional)</label>
        <input
          type="number"
          name="yearsOfExperience"
          onChange={handleChange}
          value={formData.yearsOfExperience}
        />

        <button type="submit" className={styles.btn}>
          Register
        </button>
      </form>
    </div>
  );
}
