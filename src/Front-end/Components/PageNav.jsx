import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import UserSideBar from "./UserSideBar";
import useAuthStore from "../Zustand-api/Authentication";
export default function PageNav() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const toggleSidebar = (e) => {
    e.preventDefault(); // Prevent navigation if the link goes to profile
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className={styles.nav}>
        <Logo />
        <ul>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/contacts">Contacts</NavLink>
          </li>
          {isAuthenticated ? (
            <li>
 <NavLink to="/your-projects"> My Projects </NavLink>
            </li>           
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}

          <li>
            <NavLink
              to="/profile"
              className={styles.profileIcon}
              onClick={toggleSidebar}
            >
              <i className="fas fa-user-circle"></i>
            </NavLink>
          </li>
        </ul>
      </nav>

      <UserSideBar isOpen={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}
