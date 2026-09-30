import React from "react";
import { Link } from "react-router-dom";
import styles from "./CowRescueHighlight.module.css";

const CowRescueHighlight = () => {
  return (
    <section className={styles.highlightSection}>
      <div className={styles.bgPattern}></div>

      <div className={styles.container}>
        {/* Spiritual Quote */}
        <div className={styles.quoteBlock}>
          <span className={styles.quoteSymbol}>🕉️</span>
          <p className={styles.quoteText}>
            "गौ माता की रक्षा हमारा परम धर्म है"
          </p>
          <p className={styles.quoteTranslation}>
            Protecting Mother Cow is our sacred duty
          </p>
        </div>

        <div className={styles.badgeRow}>
          <span className={styles.badge}>
            <span className={styles.pulseDot}></span>
            LIVE RESCUE NETWORK
          </span>
        </div>

        <h2 className={styles.title}>
          Every Second Counts.
          <br />
          <span className={styles.titleAccent}>Report an Injured Cow Now.</span>
        </h2>

        <p className={styles.subtitle}>
          Our verified Gaushala & NGO network is ready 24×7 to rescue injured,
          sick, or distressed cows across India. Your one report can save a life.
        </p>

        <div className={styles.actionGrid}>
          <Link to="/cow-rescue/report" className={styles.primaryBtn}>
            <span className={styles.btnIcon}>🐄</span>
            <span className={styles.btnText}>
              <strong>Report Injured Cow</strong>
              <small>Takes less than 60 seconds</small>
            </span>
            <span className={styles.btnArrow}>→</span>
          </Link>

          <Link to="/cow-rescue/track" className={styles.secondaryBtn}>
            <span className={styles.btnIcon}>🔍</span>
            <span className={styles.btnText}>
              <strong>Track Your Case</strong>
              <small>Enter Case ID to see status</small>
            </span>
            <span className={styles.btnArrow}>→</span>
          </Link>
        </div>

        <div className={styles.emergencyStrip}>
          <span className={styles.emergencyLabel}>🚑 Govt. Animal Ambulance:</span>
          <a href="tel:1962" className={styles.emergencyNumber}>1962</a>
          <span className={styles.emergencyNote}>
            (Directly call for immediate government assistance)
          </span>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>24×7</span>
            <span className={styles.statLabel}>Rescue Support</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>GPS</span>
            <span className={styles.statLabel}>Precise Location</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Verified NGOs</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CowRescueHighlight;