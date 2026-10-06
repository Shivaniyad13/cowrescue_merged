import React from 'react';
import styles from './IntroSection.module.css';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const introArt = cloudinaryAssets["images/ChatGPT Image Aug 6, 2026, 03_20_17 PM.png"];
// [moved-to-cloudinary] import introArt from '../../assets/images/ChatGPT Image Aug 6, 2026, 03_20_17 PM.png';

const IntroSection = () => {
  return (
    <section id="intro-section" className={styles.introSection} aria-label="Initiative Introduction">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Our Philosophy</span>
          <h2 className={styles.title}>
            Rooted in Ancestral Wisdom,<br />Driven by Modern Purpose
          </h2>
          <div className={styles.titleLine}></div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.textContent}>
            <p className={styles.leadText}>
              <strong>Panchgavya Se Panchparivartan</strong> is a social-impact and sustainability movement inspired by India's timeless bio-knowledge system.
            </p>
            <p className={styles.bodyText}>
              Rather than viewing traditional practices through a purely historical lens, our initiative connects ancient ecological understanding with modern scientific thinking, green technology, and community-led innovation.
            </p>
            
            <div className={styles.pillarsGrid}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h3 className={styles.pillarTitle}>Traditional Science</h3>
                  <p className={styles.pillarDesc}>Bio-based knowledge systems refined over millennia.</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 2 4.12 2 7 0 6-5 11-10 11z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <div>
                  <h3 className={styles.pillarTitle}>Ecological Balance</h3>
                  <p className={styles.pillarDesc}>Regenerative models that nurture soil, water, and air.</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h3 className={styles.pillarTitle}>Rural Livelihoods</h3>
                  <p className={styles.pillarDesc}>Empowering local farmers, artisans, and micro-entrepreneurs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.imageCol}>
            <div className={styles.imageFrame}>
              <img
                src={introArt}
                alt="Rural empowerment and natural ecosystem harmony"
                className={styles.introImg}
                loading="lazy"
              />
              <div className={styles.imageOverlayBadge}>
                <span className={styles.badgeText}>Traditional Knowledge ↓ Modern Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
