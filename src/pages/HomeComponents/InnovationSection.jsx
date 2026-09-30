import React from 'react';
import styles from './InnovationSection.module.css';
import heritageImg from '../../assets/images/ChatGPT Image Aug 13, 2026, 03_06_02 PM.png';

const InnovationSection = () => {
  const bridgeItems = [
    {
      title: 'Traditional Bio-Knowledge ↔ Scientific Validation',
      desc: 'Analysing bio-active properties, organic compost microbial density, and soil regeneration metrics with modern laboratory standards.'
    },
    {
      title: 'Natural Resources ↔ Circular Green Economy',
      desc: 'Converting cattle bio-byproducts into renewable biogas fuel, bio-fertilizer pellets, and eco-friendly consumer goods.'
    },
    {
      title: 'Rural Heritage ↔ Youth & Women Entrepreneurship',
      desc: 'Establishing local bio-processing hubs and micro-enterprises that generate dignified livelihoods in indigenous rural communities.'
    },
    {
      title: 'Local Ecosystem Stewardship ↔ Global Climate Goals',
      desc: 'Supporting organic soil carbon sequestration, reducing chemical run-off into rivers, and advancing UN SDGs.'
    }
  ];

  return (
    <section className={styles.section} aria-label="Tradition and Modern Innovation">
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          {/* Visual Column with high-res media */}
          <div className={styles.visualCol}>
            <div className={styles.imageCard}>
              <img
                src={heritageImg}
                alt="Ancient wisdom meets modern sustainable agriculture"
                className={styles.mainImg}
                loading="lazy"
              />
              <div className={styles.floatingBadge}>
                <div className={styles.badgeIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div>
                  <div className={styles.badgeTitle}>Sustainable Innovation</div>
                  <div className={styles.badgeSub}>Bridging Heritage & Future</div>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className={styles.narrativeCol}>
            <div className={styles.header}>
              <span className={styles.badge}>Synergy of Eras</span>
              <h2 className={styles.title}>Ancient Wisdom,<br />Modern Possibilities</h2>
              <p className={styles.leadText}>
                We do not view traditional knowledge as static history. We see it as a reservoir of ecological intelligence waiting to be verified, refined, and scaled using modern innovation.
              </p>
            </div>

            <div className={styles.bridgeList}>
              {bridgeItems.map((item, idx) => (
                <div key={idx} className={styles.bridgeCard}>
                  <div className={styles.bridgeIcon}>0{idx + 1}</div>
                  <div className={styles.bridgeContent}>
                    <h3 className={styles.bridgeTitle}>{item.title}</h3>
                    <p className={styles.bridgeDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
