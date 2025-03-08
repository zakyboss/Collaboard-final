import React from 'react';
import { Link } from "react-router-dom";
import styles from './Footer.module.css';
import Logo from './Logo'; // Importing your Logo component

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo and Description */}
        <div className={styles.logoSection}>
          <Logo />
          <p className={styles.tagline}>
            Empowering developers to innovate and build the future together.
          </p>
        </div>

        {/* Navigation Links */}
        <div className={styles.links}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className={styles.socials}>
          <h3>Follow Us</h3>
          <div className={styles.icons}>
            <a href="#" className={styles.icon}><i className="fab fa-twitter"></i></a>
            <a href="#" className={styles.icon}><i className="fab fa-facebook-f"></i></a>
            <a href="#" className={styles.icon}><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className={styles.icon}><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p>&copy; 2025 Collaboard. All rights reserved.</p>
      </div>
    </footer>
  );
}
