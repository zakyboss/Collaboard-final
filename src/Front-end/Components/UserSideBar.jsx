// File: src/Front-end/Components/UserSideBar.jsx
import React from "react";
import styles from "./UserSideBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../Zustand-api/Authentication";

export default function UserSideBar({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleEditProfile = () => {
    onClose();
    navigate("/edit-profile");
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h3>User Profile</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            {isAuthenticated && user?.profile_photo ? (
              <img
                src={`https://collaboard-php-production.up.railway.app/uploads/${user.profile_photo}`}
                alt="Profile"
                className={styles.avatar}
              />
            ) : (
              <img src="/guest.png" alt="Guest" className={styles.avatar} />
            )}
            {isAuthenticated && (
              <i
                className={`fas fa-pen ${styles.editIcon}`}
                onClick={handleEditProfile}
                title="Edit Profile"
              ></i>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <h4>
                {user.firstName} {user.lastName}
              </h4>
              <p>{user.email}</p>
            </>
          ) : (
            <>
              <h4>Guest</h4>
              <p>
                Please <Link to="/login">Login</Link> or{" "}
                <Link to="/signup">Sign Up</Link>
              </p>
            </>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/projectCreation" onClick={onClose}>
                    <i className="fas fa-plus-circle"></i> Create Project
                  </Link>
                </li>
                <li>
                  <Link to="/your-projects" onClick={onClose}>
                    <i className="fas fa-folder"></i> My Projects
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={onClose}>
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                </li>
                <li className={styles.divider}></li>
                <li>
                  <button onClick={handleLogout} className={styles.logout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/login" onClick={onClose}>
                    <i className="fas fa-user"></i> Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
