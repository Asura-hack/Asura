import React, { useState, useEffect } from "react";
import { pic1, pic2, pic3, pic4, pic5, pic6 } from "../data/images";

const Slider = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [userClicked, setUserClicked] = useState(false);

  const images = [pic1, pic2, pic3, pic4, pic5, pic6];

  // Handle swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentImage((prev) => (prev + 1) % images.length);
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setUserClicked(false);
      },
      userClicked ? 5000 : 3000
    );

    return () => clearInterval(interval);
  }, [userClicked]);

  return (
    <div className="w-full relative overflow-hidden rounded-lg shadow-md">
      {/* Main Image */}
      <div
        className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImage]}
          alt={`Banner ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center sm:hidden"
          onClick={() =>
            setCurrentImage((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
        >
          ←
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center sm:hidden"
          onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
        >
          →
        </button>

        {/* Dots for mobile */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? "bg-white w-4" : "bg-white/50"
              }`}
              onClick={() => setCurrentImage(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail navigation for tablet and desktop */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden sm:flex flex-col">
          {images.map((imagePath, index) => (
            <button
              key={index}
              className={`w-12 sm:w-24 lg:w-48 h-6 sm:h-12 lg:h-16 border-2 transition-all ${
                index === currentImage
                  ? "border-blue-500 opacity-100"
                  : "border-white/50 opacity-70 hover:opacity-100"
              }`}
              onClick={() => {
                setCurrentImage(index);
                setUserClicked(true);
              }}
              onMouseEnter={() => {
                setCurrentImage(index);
                setUserClicked(true);
              }}
              style={{
                backgroundImage: `url(${imagePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
