import React from "react";
import PageNav from "../Components/PageNav";
import Map from "../Components/Map";
import ContactUsForm from "../Components/ContactUsForm";
import styles from "./Contacts.module.css";
import Footer from "../Components/Footer";

export default function Contacts() {
  return (
    <div>
      <PageNav />

      <div className={styles.contactsPage}>
        <div className={styles.container}>
          {/* Map Section */}
          <div className={styles.mapSection}>
            <Map />
          </div>

          {/* Contact Form Section */}
          <div className={styles.formSection}>
            <ContactUsForm />
          </div>
        </div>
      </div>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}
