import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FinalCTASection.module.css';

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-label="Final Call to Action">
      <div className={styles.container}>
        <div className={styles.ctaBox}>
          <div className={styles.content}>
            <span className={styles.badge}>Join the Transformation</span>
            <h2 className={styles.title}> Panchgavya Se Panchparivartan</h2>
            <p className={styles.description}>
              Explore our comprehensive programs, governmental partnerships, community initiatives, and collaborative consultation frameworks shaping a self-reliant Bharat.
            </p>

            <div className={styles.btnGroup}>
              <button
                className={styles.primaryBtn}
                onClick={() => navigate('/about')}
              >
                Learn About Our Mission
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button
                className={styles.secondaryBtn}
                onClick={() => navigate('/initiative')}
              >
                Explore Initiatives
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button
                className={styles.accentBtn}
                onClick={() => navigate('/donation')}
              >
                Support the Cause
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
