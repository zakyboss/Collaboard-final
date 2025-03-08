import React from "react";
import styles from "./ContactUsForm.module.css";

export default function ContactUsForm() {
  return (
    <div className={styles.contactFormContainer}>
      <h2 className={styles.heading}>Get in Touch</h2>
      <p className={styles.subtext}>
        We'd love to hear from you! Fill in the form and we'll get back to you
        soon.
      </p>

      <form className={styles.form}>
        {/* Name Field */}
        <div className={styles.inputGroup}>
          <i
            className="fas fa-user"
            style={{ color: " rgb(68, 241, 126)" }}
          ></i>
          <input type="text" placeholder="Your Name" required />
        </div>

        {/* Email Field */}
        <div className={styles.inputGroup}>
          <i
            className="fas fa-envelope"
            style={{ color: " rgb(68, 241, 126)" }}
          ></i>
          <input type="email" placeholder="Your Email" required />
        </div>

        {/* Message Field */}
        <div className={styles.inputGroup}>
          <i
            className="fas fa-comment-alt"
            style={{ color: " rgb(68, 241, 126)" }}
          ></i>
          <textarea placeholder="Your Message" required></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Send Message
        </button>
      </form>
    </div>
  );
}
