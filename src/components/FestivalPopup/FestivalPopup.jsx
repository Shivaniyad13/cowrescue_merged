import { useEffect } from "react";
import styles from "./FestivalPopup.module.css";

const FestivalPopup = ({
  isOpen,
  onClose,
  imageSrc = "/Chhath Puja at Sunrise.png",
  alt = "Chhath Puja at Sunrise",
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default FestivalPopup;

