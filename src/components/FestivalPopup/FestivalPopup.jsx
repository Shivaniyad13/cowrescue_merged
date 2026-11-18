
import { useEffect, useState } from "react";
import styles from "./FestivalPopup.module.css";

const FestivalPopup = ({
  isOpen,
  onClose,
  imageSrc = "",
  alt = "Festival Image",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check whether image actually exists
  useEffect(() => {
    setImageLoaded(false);

    if (!isOpen || !imageSrc || !imageSrc.trim()) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      setImageLoaded(true);
    };

    img.onerror = () => {
      setImageLoaded(false);
    };

    img.src = imageSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isOpen, imageSrc]);

  // Prevent scrolling only when a valid image is loaded
  useEffect(() => {
    if (!isOpen || !imageLoaded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, imageLoaded, onClose]);

  // Do not display popup if image is missing or unavailable
  if (!isOpen || !imageSrc || !imageLoaded) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      data-no-translate="true"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close popup"
          title="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <img
          src={imageSrc}
          alt={alt}
          className={styles.image}
          loading="eager"
        />
      </div>
    </div>
  );
};

export default FestivalPopup;
