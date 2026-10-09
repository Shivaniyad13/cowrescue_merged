import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

// Project Images
// [moved-to-cloudinary] import heroImg from "../assets/images/cow1.jpg";

// ─── Cloudinary assets ───
import cloudinaryAssets from '../cloudinary.js';
const heroImg = cloudinaryAssets["images/cow1.jpg"];

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection} aria-label="About Hero">
        <img
          src={heroImg}
          alt="Indigenous Indian cow in a peaceful natural pasture"
          className={styles.heroBgImage}
        />
        <div className={styles.heroOverlay}></div>

        <div className={`${styles.container} ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Traditional Wisdom • Scientific Vision
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroHighlight}>Panchgavya</span>
              <br />
              Se<span className={styles.heroHighlight}>Panchparivartan</span>
            </h1>

            <div className={styles.heroActions}>
              <a href="#vision" className={styles.btnPrimary}>
                Explore Our Vision
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </a>
              <a
                href="https://govigyan.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                Visit Go Vigyan Kendra
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.heroVisualCard}>
            <img
              src={heroImg}
              alt="Cattle and agricultural harmony in rural India"
              className={styles.heroVisualImg}
            />
            <div className={styles.heroVisualCaption}>
              <div className={styles.heroVisualCaptionTitle}>Honoring Traditional Roots</div>
              <div className={styles.heroVisualCaptionText}>
                Integrating indigenous cattle care with eco-friendly rural development.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VISION & MISSION SECTION */}
      <section id="vision" className={styles.sectionAlt} aria-label="Our Vision and Mission">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Purpose &amp; Direction</span>
            <h2 className={styles.sectionTitle}>Vision &amp; Mission</h2>
          </div>

          <div className={styles.visionMissionGrid}>
            {/* VISION CARD */}
            <div className={styles.visionMissionCard}>
              <div className={styles.visionMissionIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className={styles.visionMissionLabel}>Our Vision</span>
              <h3 className={styles.visionMissionHeading}>A Sustainable &amp; Aware Society</h3>
              <p className={styles.visionMissionText}>
                “To build a sustainable and aware society where India's traditional knowledge surrounding cows, <strong>Panchgavya</strong>, agriculture and natural practices is responsibly understood, scientifically explored and transformed into <strong>meaningful opportunities</strong> for communities and future generations.”
              </p>
              <p className={styles.visionMissionText}>
                By empowering agrarian communities with documented traditional wisdom and modern bio-resource practices, we strive to bridge the gap between ancient heritage and sustainable economic progress.
              </p>
            </div>

            {/* MISSION CARD */}
            <div className={styles.visionMissionCard}>
              <div className={styles.visionMissionIcon}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <span className={styles.visionMissionLabel}>Our Mission</span>
              <h3 className={styles.visionMissionHeading}>From Tradition to Transformation</h3>
              <p className={styles.visionMissionText}>
                To preserve India's time-tested cow-based wisdom through responsible <strong>scientific validation</strong>, promote <strong>sustainable and regenerative agricultural practices</strong>, and create decentralized rural livelihood opportunities anchored in natural resource stewardship.
              </p>
              <p className={styles.visionMissionText}>
                We work to raise grassroots awareness, connect heritage with innovation, and build self-reliant, ecologically balanced communities across Bharat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSPIRED BY GO VIGYAN ANUSANDHAN KENDRA */}
      <section className={styles.inspirationSection} aria-label="Inspiration Source">
        <div className={styles.container}>
          <div className={styles.inspirationCard}>
            <div className={styles.inspirationBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Inspiration & Scientific Reference
            </div>

            <h2 className={styles.inspirationTitle}>
              Inspired by Go Vigyan Anusandhan Kendra
            </h2>

            <p className={styles.inspirationSubtitle}>
              Our broader vision draws significant inspiration from the landmark research work of <strong>Go Vigyan Anusandhan Kendra, Deolapar, Nagpur</strong>. Their pioneering work serves as an exemplary benchmark in scientifically exploring the multifaceted utility of indigenous cows, Panchgavya, and sustainable rural economic models.
            </p>

            <div className={styles.inspirationThemesHeader}>
              Key Themes & Focus Areas Of Inspiration:
            </div>

            <div className={styles.inspirationPills}>
              <span className={styles.pill}><span className={styles.pillDot}></span> Indian Cow Significance</span>
              <span className={styles.pill}><span className={styles.pillDot}></span> Cow-Based Economy</span>
              <span className={styles.pill}><span className={styles.pillDot}></span> Rural Self-Employment</span>
              <span className={styles.pill}><span className={styles.pillDot}></span> Organic Agriculture</span>
              <span className={styles.pill}><span className={styles.pillDot}></span> Bio-Fertilizers & Soil Health</span>
              <span className={styles.pill}><span className={styles.pillDot}></span> Scientific Research & Awareness</span>
            </div>

            <div className={styles.inspirationNotice}>
              <strong>Note on Organization & Partnership:</strong> Panchgavya Se Panchparivartan is an independent initiative inspired by the research principles and rural employment models demonstrated by Go Vigyan Anusandhan Kendra. To explore their direct research papers, educational literature, or official product catalog, visit their official portal below.
            </div>

            <div className={styles.inspirationActions}>
              <a
                href="https://govigyan.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Visit Official Go Vigyan Platform
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      

      {/* 5. CALL TO ACTION */}
      <section className={styles.ctaSection} aria-label="Call to Action">
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Be Part of the Change</h2>
          <p className={styles.ctaText}>
            Explore, learn and participate in the journey from traditional knowledge to sustainable transformation across Bharat.
          </p>
          <div className={styles.ctaBtnGroup}>
            <Link to="/initiative" className={styles.btnPrimary}>
              Explore Initiatives
            </Link>
            <Link to="/consultation" className={styles.btnSecondary}>
              Learn More
            </Link>
            <Link to="/donation" className={styles.btnSecondary}>
              Support Initiative
            </Link>
            <a
              href="https://govigyan.com/en/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              Visit Go Vigyan
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;