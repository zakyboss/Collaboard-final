import React from 'react';
import styles from './Map.module.css';

export default function Map() {
  return (
    <div className={styles.mapContainer}>
      <h2 className={styles.heading}>Find Us Here</h2>
      <div className={styles.mapWrapper}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8144184307916!2d36.81076392531396!3d-1.285333472759648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d1c9bfc985%3A0x2e40e8b0df5ba2ef!2sCentral%20Park%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1741071179590!5m2!1sen!2ske"
          className={styles.mapFrame}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
