import React from "react";
import styles from "./CowRescueHome.module.css";

// Cow icon (inline SVG)
const CowIcon = () => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    {/* Horns */}
    <path d="M4 6c0-1.5 1-2.5 2-2.5" />
    <path d="M20 6c0-1.5-1-2.5-2-2.5" />
    {/* Ears */}
    <path d="M6 7c-1.5 0-2.5.8-2.5 2 0 .8.6 1.4 1.5 1.6" />
    <path d="M18 7c1.5 0 2.5.8 2.5 2 0 .8-.6 1.4-1.5 1.6" />
    {/* Head */}
    <path d="M6 8h12c.6 0 1 .4 1 1v3.5c0 3.6-3.1 6.5-7 6.5s-7-2.9-7-6.5V9c0-.6.4-1 1-1z" />
    {/* Eyes */}
    <circle cx="9.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="11.5" r="0.9" fill="currentColor" stroke="none" />
    {/* Snout / nose */}
    <ellipse cx="12" cy="15.5" rx="2.2" ry="1.5" />
    <circle cx="11.2" cy="15.5" r="0.35" fill="currentColor" stroke="none" />
    <circle cx="12.8" cy="15.5" r="0.35" fill="currentColor" stroke="none" />
  </svg>
);

// Plus icon (inline SVG)
const PlusIcon = () => (
  <svg
    width="32"
    height="32"
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
    width="32"
    height="32"
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

const CowRescueHome = () => {
  const handleOpenReport = () => {
    window.dispatchEvent(new CustomEvent("openReportCowWidget"));
  };

  const handleOpenTrack = () => {
    window.dispatchEvent(new CustomEvent("openTrackCowWidget"));
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
       <h1 className={styles.title}>
  <img
    src="/campaign-panchgavy.png"
    alt="Cow Rescue Network"
    className={styles.titleLogo}
  />
  Cow Rescue Network
</h1>
        <p className={styles.lead}>
          Report an injured cow or track your existing rescue case
        </p>

        <div className={styles.actionGrid}>
          <button
            className={`${styles.card} ${styles.cardJoin}`}
            onClick={handleOpenReport}
          >
            <div className={styles.cardIcon}>
              <PlusIcon />
            </div>
            <h3>Report Incident</h3>
            <p>Spotted a sick, injured, or trapped cow? Submit a rescue request now.</p>
            <span className={styles.btnAction}>Open Report Form →</span>
          </button>

          <button
            className={`${styles.card} ${styles.cardJoin}`}
            onClick={handleOpenTrack}
          >
            <div className={styles.cardIcon}>
              <ProfileIcon />
            </div>
            <h3>Track Your Status</h3>
            <p>Already reported a cow? Enter your Case ID to see live status.</p>
            <span className={styles.btnAction}>Open Track Form →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CowRescueHome;