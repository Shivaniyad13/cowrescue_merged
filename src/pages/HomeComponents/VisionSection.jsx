import React from 'react';
import styles from './VisionSection.module.css';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const visionArt = cloudinaryAssets["images/ChatGPT Image Aug 20, 2026, 03_42_22 PM.png"];
// [moved-to-cloudinary] import visionArt from '../../assets/images/ChatGPT Image Aug 20, 2026, 03_42_22 PM.png';

const VisionSection = () => {
  const visionGoals = [
    {
      title: 'A Healthier Society',
      desc: 'Advancing access to chemical-free natural produce, clean food security, and wellness practices.'
    },
    {
      title: 'Regenerative Agriculture',
      desc: 'Restoring organic carbon in Indian farmlands and reducing high agricultural input costs.'
    },
    {
      title: 'Resource Responsibility',
      desc: 'Maximizing bio-recycling, water table preservation, and circular nutrient management.'
    },
    {
      title: 'Stronger Rural Livelihoods',
      desc: 'Building scalable micro-enterprises and local cottage industries centered around Panchgavya.'
    },
    {
      title: 'Environmental Balance',
      desc: 'Mitigating soil degradation and carbon emissions with bio-energy and organic soil conditioners.'
    },
    {
      title: 'A Self-Reliant Bharat',
      desc: 'Fostering local economic independence, indigenous pride, and sustainable community growth.'
    }
  ];

  return (
    <section className={styles.section} aria-label="Vision for the Future">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Looking Ahead</span>
          <h2 className={styles.title}>Vision for a Sustainable Tomorrow</h2>
          <p className={styles.subtitle}>
            Building a resilient blueprint where ecological balance, community prosperity, and cultural identity unite.
          </p>
        </div>

        <div className={styles.bannerCard}>
          <div className={styles.bannerGrid}>
            <div className={styles.bannerText}>
              <span className={styles.bannerTag}>The Vision Pipeline</span>
              <h3 className={styles.bannerHeading}>
                Traditional Wisdom → Sustainable Practice → Self-Reliant Bharat
              </h3>
              <p className={styles.bannerParagraph}>
                By empowering local ecosystems with structured Panchgavya bio-enterprises, we bridge the gap between traditional wisdom and sustainable modern economic growth.
              </p>
            </div>
            <div className={styles.bannerImageWrapper}>
              <img
                src={visionArt}
                alt="Vision of a vibrant, sustainable rural Bharat"
                className={styles.bannerImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className={styles.goalsGrid}>
          {visionGoals.map((goal, index) => (
            <div key={index} className={styles.goalCard}>
              <div className={styles.goalHeader}>
                <span className={styles.goalBullet}>✦</span>
                <h3 className={styles.goalTitle}>{goal.title}</h3>
              </div>
              <p className={styles.goalDesc}>{goal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
