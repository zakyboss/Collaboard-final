// File: src/Front-end/Pages/UserSideBar.jsx
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

  // These console logs help you verify that updated data is coming through
  console.log("User object:", user);
  console.log("Profile photo:", user?.profilePhoto);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h3>{isAuthenticated ? "User Profile" : "Welcome Guest!"}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.avatarContainer}>
            {isAuthenticated && user?.profilePhoto ? (
              // Render updated profile photo; if you're storing a URL you can use it directly.
              <img
                src={user.profilePhoto}
                alt="Profile"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.guestAvatarWrapper}>
                <img src="/guest.png" alt="Guest" className={styles.avatar} />
                <div className={styles.guestBadge}>Guest</div>
              </div>
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
                {user?.firstName} {user?.lastName}
              </h4>
              <p>{user?.email}</p>
            </>
          ) : (
            <div className={styles.guestWelcome}>
              <h4 className={styles.guestTitle}>Explore as a Guest</h4>
              <p className={styles.guestMessage}>
                Sign in to create projects and access all features
              </p>
              <div className={styles.guestActions}>
                <Link
                  to="/login"
                  className={styles.primaryBtn}
                  onClick={onClose}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={styles.secondaryBtn}
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {isAuthenticated ? (
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
            ) : (
              <>
                <li className={styles.featureItem}>
                  <Link to="/" onClick={onClose} className={styles.featureLink}>
                    <div className={styles.featureIcon}>
                      <i className="fas fa-home"></i>
                    </div>
                    <div className={styles.featureText}>
                      <span className={styles.featureTitle}>Home</span>
                      <span className={styles.featureDesc}>
                        Return to homepage
                      </span>
                    </div>
                  </Link>
                </li>
                <li className={styles.featureItem}>
                  <Link
                    to="/explore"
                    onClick={onClose}
                    className={styles.featureLink}
                  >
                    <div className={styles.featureIcon}>
                      <i className="fas fa-compass"></i>
                    </div>
                    <div className={styles.featureText}>
                      <span className={styles.featureTitle}>Explore</span>
                      <span className={styles.featureDesc}>
                        Discover amazing projects
                      </span>
                    </div>
                  </Link>
                </li>
                <li className={styles.featureItem}>
                  <Link
                    to="/about"
                    onClick={onClose}
                    className={styles.featureLink}
                  >
                    <div className={styles.featureIcon}>
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <div className={styles.featureText}>
                      <span className={styles.featureTitle}>About Us</span>
                      <span className={styles.featureDesc}>
                        Learn about our platform
                      </span>
                    </div>
                  </Link>
                </li>
                <li className={styles.featureItem}>
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className={styles.featureLink}
                  >
                    <div className={styles.featureIcon}>
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className={styles.featureText}>
                      <span className={styles.featureTitle}>Contact</span>
                      <span className={styles.featureDesc}>
                        Get in touch with us
                      </span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {!isAuthenticated && (
          <div className={styles.guestFooter}>
            <p className={styles.guestFooterText}>
              Join our community of creators and builders today!
            </p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className={styles.socialIcon}>
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
