import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./CowRescueHome.module.css";

const CowRescueHome = () => {
  const [trackInput, setTrackInput] = useState("");
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/cow-rescue/track?case=${encodeURIComponent(trackInput.trim())}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <span className={styles.tag}>🐄 Panchgavya Parivartan Network</span>
        <h1 className={styles.title}>Cow Rescue & Verified Gaushala Network</h1>
        <p className={styles.lead}>
          Connecting compassionate citizens reporting injured or distressed cows
          with verified local Gaushalas and animal welfare organizations across India.
        </p>

        <div className={styles.actionGrid}>
          <Link to="/cow-rescue/report" className={`${styles.card} ${styles.cardReport}`}>
            <div className={styles.cardIcon}>🚨</div>
            <h3>Report an Injured Cow</h3>
            <p>Spotted a sick, injured, or trapped cow? Submit an immediate rescue request with photos and GPS location.</p>
            <span className={styles.btnAction}>Report Incident →</span>
          </Link>

          <Link to="/cow-rescue/track" className={`${styles.card} ${styles.cardJoin}`}>
            <div className={styles.cardIcon}>🔍</div>
            <h3>Track a Rescue Case</h3>
            <p>Already reported a cow? Enter your Case ID to view real-time status, timeline, and NGO response.</p>
            <span className={styles.btnAction}>Track Status →</span>
          </Link>
        </div>
      </div>

      <div className={styles.trackBox}>
        <div className={styles.trackContent}>
          <span className={styles.trackIcon}>🔍</span>
          <div>
            <h4>Already Reported a Cow?</h4>
            <p>Enter your Case ID (e.g., CASE-2026-123456) to track your report status.</p>
          </div>
        </div>
        <form onSubmit={handleTrackSubmit} className={styles.trackForm}>
          <input
            type="text"
            placeholder="Enter Case ID (e.g. CASE-2026-123456)"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
            className={styles.trackInput}
            required
          />
          <button type="submit" className={styles.trackBtn}>
            Track Status
          </button>
        </form>
      </div>

      <div className={styles.infoBanner}>
        <div className={styles.infoItem}>
          <span className={styles.infoEmoji}>🛡️</span>
          <div>
            <strong>Verified Network</strong>
            <p>Every participating Gaushala & NGO is strictly verified by our administrative team.</p>
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoEmoji}>📍</span>
          <div>
            <strong>GPS Geolocation Pinpointing</strong>
            <p>Reports capture exact coordinates to ensure rescue teams locate the animal without delay.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CowRescueHome;