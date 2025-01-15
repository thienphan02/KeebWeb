// src/components/Carousel.jsx
import { useState, useEffect } from 'react';

export default function Carousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      updateIndex(currentIndex + 1); // Automatically cycle images every 3 seconds
    }, 3000);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentIndex]);

  const updateIndex = (newIndex) => {
    const index = (newIndex + images.length) % images.length;
    setCurrentIndex(index);
  };

  return (
    <div className="carousel-container" aria-label="Image carousel">
      <div className="carousel">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <button
        className="prev"
        onClick={() => updateIndex(currentIndex - 1)}
        aria-label="Previous image"
      >
        &#10094;
      </button>
      <button
        className="next"
        onClick={() => updateIndex(currentIndex + 1)}
        aria-label="Next image"
      >
        &#10095;
      </button>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}
