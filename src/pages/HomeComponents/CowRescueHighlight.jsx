import React, { useState, useEffect } from "react";
import styles from "./CowRescueHighlight.module.css";
import { getPublicConfig } from "../../services/api";

// Plus icon (inline SVG)
const PlusIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Profile / user icon (inline SVG)
const ProfileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CowRescueHighlight = () => {
  const [emergencyNumber, setEmergencyNumber] = useState("1962");
  const [emergencyLabel, setEmergencyLabel] = useState("Govt. Animal Ambulance");

  useEffect(() => {
    getPublicConfig()
      .then((res) => {
        if (res.data) {
          setEmergencyNumber(res.data.emergency_number || "1962");
          setEmergencyLabel(res.data.emergency_label || "Govt. Animal Ambulance");
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenReport = () => {
    window.dispatchEvent(new CustomEvent("openReportCowWidget"));
  };

  const handleOpenTrack = () => {
    window.dispatchEvent(new CustomEvent("openTrackCowWidget"));
  };

  return (
    <section className={styles.highlightSection}>
      <div className={styles.bgPattern}></div>

      <div className={styles.container}>
        {/* Spiritual Quote */}
        <div className={styles.quoteBlock}>
          <p className={styles.quoteText}>
           "गौ का संरक्षण एवं संवर्धन हमारा परम कर्तव्य है।"
          </p>
          <p className={styles.quoteTranslation}>
            "Protecting and promoting the welfare of cows is our sacred duty."
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
          Our verified Gaushala &amp; NGO network is ready 24×7 to rescue injured,
          sick, or distressed cows across India. Your one report can save a life.
        </p>

        <div className={styles.actionGrid}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleOpenReport}
          >
            <span className={styles.btnIcon}>
              <PlusIcon />
            </span>
            <span className={styles.btnText}>
              <strong>Report Incident</strong>
              <small>Takes less than 60 seconds</small>
            </span>
            <span className={styles.btnArrow}>→</span>
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={handleOpenTrack}
          >
            <span className={styles.btnIcon}>
              <ProfileIcon />
            </span>
            <span className={styles.btnText}>
              <strong>Track Your Status</strong>
              <small>Enter Case ID to see status</small>
            </span>
            <span className={styles.btnArrow}>→</span>
          </button>
        </div>

        {/* Emergency Strip — .env se dynamic */}
        <div className={styles.emergencyStrip}>
          <span className={styles.emergencyLabel}>🚑 {emergencyLabel}:</span>
          <a href={`tel:${emergencyNumber}`} className={styles.emergencyNumber}>
            {emergencyNumber}
          </a>
          <span className={styles.emergencyNote}>
            (Directly call for immediate assistance)
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