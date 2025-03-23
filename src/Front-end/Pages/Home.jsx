import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import PageNav from "../Components/PageNav";
import Footer from "../Components/Footer";

// Import your OutputProjects component
import OutputProjects from "./OutputProjects";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Replace these with your actual image paths in public/ folder
  const slides = [
    {
      image: "/image1.png",
      title: "Welcome to Our Portfolio",
      subtitle: "Discover amazing projects and creative solutions",
      buttonText: "Explore Now",
      buttonLink: "/projects"
    },
    {
      image: "/image2.png",
      title: "Creative Design Solutions",
      subtitle: "Transforming ideas into stunning visual experiences",
      buttonText: "View Designs",
      buttonLink: "/about"
    },
    {
      image: "/image3.png",
      title: "Let's Work Together",
      subtitle: "Building the future through collaboration and innovation",
      buttonText: "Contact Us",
      buttonLink: "/contacts"
    },
  ];

  // Move to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // Move to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <PageNav />

      {/* Carousel container */}
      <div className={styles.carouselContainer}>
        <button className={styles.prevButton} onClick={prevSlide}>
          &#10094;
        </button>
        <div className={styles.slide}>
          <img
            src={slides[currentIndex].image}
            alt={`Slide ${currentIndex + 1}`}
            className={styles.image}
          />
          <div className={styles.textOverlay}>
            <h1 className={styles.slideTitle}>{slides[currentIndex].title}</h1>
            <p className={styles.slideSubtitle}>{slides[currentIndex].subtitle}</p>
            <a href={slides[currentIndex].buttonLink} className={styles.slideButton}>
              {slides[currentIndex].buttonText}
            </a>
          </div>
        </div>
        <button className={styles.nextButton} onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      {/* Projects Section */}
      <OutputProjects />

      {/* Footer at the bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}