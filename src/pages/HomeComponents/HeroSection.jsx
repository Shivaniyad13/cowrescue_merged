import React, { useState, useRef } from 'react';
import styles from './HeroSection.module.css';
import bgVideo from '../../assets/videos/213713_medium.mp4';
import heroImageFallback from '../../assets/images/Gemini_Generated_Image_1kxmsi1kxmsi1kxm.png';

const HeroSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // Swipe handling can remain here if needed
    if (Math.abs(diff) > 50) {
      // No carousel now, so nothing to slide
    }

    touchStartXRef.current = null;
  };

  const scrollToNext = () => {
    const introElement = document.getElementById('intro-section');

    if (introElement) {
      introElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      className={styles.hero}
      aria-label="Hero Section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.heroInnerContent}>
        <div className={styles.mediaContainer}>
          <video
            className={styles.bgMedia}
            autoPlay
            loop
            muted
            playsInline
            poster={heroImageFallback}
          >
            <source src={bgVideo} type="video/mp4" />

            <img
              src={heroImageFallback}
              alt="Indigenous Indian cow in a pristine green meadow"
              className={styles.bgMedia}
            />
          </video>

          <div className={styles.overlay}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.content}>

            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Traditional Wisdom • Modern Innovation
            </div>

            <h1 className={styles.title}>
              <span className={styles.accentText}>
                Panchgavya
              </span>{' '}
              Se
              <br />
              <span className={styles.highlightText}>
                Panchparivartan
              </span>
            </h1>

            <p className={styles.tagline}>
              Honouring tradition. Inspiring innovation. Transforming tomorrow.
            </p>

            <p className={styles.description}>
              Connecting traditional knowledge, sustainable practices, and
              responsible modern science to spark a holistic transformation
              across health, agriculture, environment, and rural empowerment.
            </p>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={scrollToNext}
              >
                Discover the Vision

                <svg
                  className={styles.btnIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </button>
            </div>

          </div>

          <div className={styles.heroFeatureCard}>
            <div className={styles.featureStat}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>
                Core Elements
              </span>
            </div>

            <div className={styles.featureDivider}></div>

            <div className={styles.featureStat}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>
                Transformations
              </span>
            </div>

            <div className={styles.featureDivider}></div>

            <div className={styles.featureStat}>
              <span className={styles.statText}>1</span>
              <span className={styles.statLabel}>
                Self-Reliant Bharat
              </span>
            </div>
          </div>
        </div>

        <button
          className={styles.scrollIndicator}
          onClick={scrollToNext}
          aria-label="Scroll down to introduction"
        >
          <span className={styles.mouse}>
            <span className={styles.wheel}></span>
          </span>

          <span className={styles.scrollText}>
            Scroll to explore
          </span>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;