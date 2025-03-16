// File: src/Front-end/Pages/Home.jsx

import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PageNav from "../Components/PageNav";
import Footer from "../Components/Footer";

// Import your OutputProjects component
import OutputProjects from "./OutputProjects";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Replace these with your actual image paths in public/ folder
  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
  ];

  // Move to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Move to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Your navigation bar at the top */}
      <PageNav />

      {/* Carousel container */}
      <div className={styles.carouselContainer}>
        <button className={styles.prevButton} onClick={prevSlide}>
          &#10094;
        </button>
        <div className={styles.slide}>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className={styles.image}
          />
        </div>
        <button className={styles.nextButton} onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* Projects Section */}
      {/* <h1 className={styles.heading}>Projects</h1> */}
      <OutputProjects />

      {/* Footer at the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
