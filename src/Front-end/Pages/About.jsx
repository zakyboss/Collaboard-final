import React from "react";
import PageNav from "../Components/PageNav";
import styles from "./About.module.css";
import Footer from "../Components/Footer";

export default function About() {
  return (
    <div>
      <PageNav />

      {/* First Section */}
      <section className={styles.container}>
        <div className={styles.imageContainer}>
          <div className={`${styles.imageBox} ${styles.raisedImage}`}>
            <img
              src="/image5.jpg"
              alt="Coding Session"
              className={styles.image}
            />
          </div>
          <div className={styles.imageBox}>
            <img
              src="/image4.jpg"
              alt="Collaboration"
              className={styles.image}
            />
          </div>
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.heading}>
            Empowering Developers to Build Together
          </h2>
          <p className={styles.description}>
            At Collaboard, we believe in the power of teamwork. Our platform has
            enabled developers worldwide to collaborate, share ideas, and bring
            innovative projects to life. Whether it's building a startup or
            contributing to open-source, we're here to support every coder.
          </p>

          <div className={styles.stats}>
            <div>
              <h3 className={styles.statNumber}>500+</h3>
              <p className={styles.statLabel}>Engineers Helped</p>
            </div>
            <div>
              <h3 className={styles.statNumber}>120+</h3>
              <p className={styles.statLabel}>Projects Built</p>
            </div>
            <div>
              <h3 className={styles.statNumber}>80+</h3>
              <p className={styles.statLabel}>Active Teams</p>
            </div>
          </div>

          <button className={styles.button}>Learn More</button>
        </div>
      </section>

      {/* Second Section (Text Left, Big Image Right) */}
      <section className={styles.containerAlt}>
        <div className={styles.textContainer}>
          <h2 className={styles.heading}>Innovating for a Brighter Future</h2>
          <p className={styles.description}>
            Innovation is at the core of what we do. By fostering a culture of
            creativity and exploration, we help developers turn ambitious ideas
            into reality. Our tools and community-driven support empower you to
            take your projects to the next level.
          </p>

          <div className={styles.stats}>
            <div>
              <h3 className={styles.statNumber}>300+</h3>
              <p className={styles.statLabel}>Tech Innovations</p>
            </div>
            <div>
              <h3 className={styles.statNumber}>200+</h3>
              <p className={styles.statLabel}>Hackathons Hosted</p>
            </div>
            <div>
              <h3 className={styles.statNumber}>150+</h3>
              <p className={styles.statLabel}>Startups Launched</p>
            </div>
          </div>

          <button className={styles.button}>Join Us</button>
        </div>

        <div className={styles.imageContainerAlt}>
          <img
            src="/image1.png"
            alt="Innovation Lab"
            className={styles.bigImage}
          />
        </div>
      </section>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
