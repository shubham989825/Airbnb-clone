import { useRef, useState } from "react";
import "../styles/ImageswipeSlider.css";

interface Props {
  images: string[];
}

const ImageSwipeSlider = ({ images }: Props) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log('ImageSwipeSlider - Received images:', images);

  const handleScroll = () => {
    const container = sliderRef.current;
    if (!container) return;

    const index = Math.round(
      container.scrollLeft / container.clientWidth
    );
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <img
        src="https://picsum.photos/seed/fallback/600/400"
        className="slide-image"
      />
    );
  }

  return (
    <div className="swipe-slider">
      <div
        className="slides-container"
        ref={sliderRef}
        onScroll={handleScroll}
      >
        {images.map((img, index) => (
          <div className="slide" key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? "dot active" : "dot"}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSwipeSlider;