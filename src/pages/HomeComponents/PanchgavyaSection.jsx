import React, { useState } from 'react';
import styles from './PanchgavyaSection.module.css';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const cowDetailImg = cloudinaryAssets["images/cow4.png"];
// [moved-to-cloudinary] import cowDetailImg from '../../assets/images/cow4.png';

const PanchgavyaSection = () => {
  const [activeElement, setActiveElement] = useState(0);

  const elements = [
    {
      id: 'milk',
      name: 'Milk (Dugdha)',
      subtitle: 'Nourishment & Vitality',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v6m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 8v6"/>
          <path d="M6 12c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
        </svg>
      ),
      description: 'A fundamental source of bio-nourishment and essential proteins, representing vital energy and traditional dietary strength in rural households.',
      keyAspects: ['Natural bio-proteins', 'Traditional dietary core', 'Micro-dairy empowerment']
    },
    {
      id: 'curd',
      name: 'Curd (Dahi)',
      subtitle: 'Probiotic Fermentation',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 7v5l3 3"/>
        </svg>
      ),
      description: 'An ancient probiotic medium demonstrating natural fermentative preservation, gut microbiome harmony, and bio-friendly food processing.',
      keyAspects: ['Natural probiotics', 'Fermentation science', 'Traditional gut balance']
    },
    {
      id: 'ghee',
      name: 'Ghee (Ghrita)',
      subtitle: 'Pure Bio-Nutrients',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      ),
      description: 'Clarified bio-butter rich in essential fatty acids and natural lipids, historically utilized as a nutrient carrier and bio-enhancing base.',
      keyAspects: ['Essential fatty acids', 'Bio-enhancing medium', 'Traditional wellness base']
    },
    {
      id: 'gomutra',
      name: 'Gomutra',
      subtitle: 'Bio-Protection & Enhancement',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      description: 'Rich in organic bio-salts and minerals, traditionally used in eco-friendly pest repellent formulations, bio-enhancers, and natural soil spray conditioners.',
      keyAspects: ['Natural pest management', 'Organic soil sprays', 'Mineral-rich bio-inputs']
    },
    {
      id: 'gobar',
      name: 'Gobar',
      subtitle: 'Regenerative Bio-Energy & Soil',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
      description: 'The foundation for organic compost (Jeevamrut/Ghanjeevamrut) and clean biogas energy, driving soil carbon rejuvenation and circular economy.',
      keyAspects: ['Organic soil composting', 'Clean biogas energy', 'Soil carbon regeneration']
    }
  ];

  return (
    <section className={styles.section} aria-label="Five Elements of Panchgavya">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>The Core Foundation</span>
          <h2 className={styles.title}>Five Traditional Elements</h2>
          <p className={styles.subtitle}>
            Five distinct natural gifts forming one integrated bio-sustainable foundation.
          </p>
        </div>

        <div className={styles.layoutGrid}>
          {/* Left Column: Interactive Element Selector Cards */}
          <div className={styles.selectorList}>
            {elements.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.elementItem} ${activeElement === index ? styles.activeItem : ''}`}
                onClick={() => setActiveElement(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveElement(index)}
              >
                <div className={styles.itemNumber}>0{index + 1}</div>
                <div className={styles.itemIcon}>{item.icon}</div>
                <div className={styles.itemMeta}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <span className={styles.itemSub}>{item.subtitle}</span>
                </div>
                <div className={styles.activeIndicator}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed Central Core Feature Display */}
          <div className={styles.displayCard}>
            <div className={styles.displayBadge}>
              Element 0{activeElement + 1} of 05
            </div>

            <div className={styles.displayHeader}>
              <div className={styles.displayIcon}>
                {elements[activeElement].icon}
              </div>
              <div>
                <h3 className={styles.displayName}>{elements[activeElement].name}</h3>
                <span className={styles.displaySub}>{elements[activeElement].subtitle}</span>
              </div>
            </div>

            <p className={styles.displayDesc}>
              {elements[activeElement].description}
            </p>

            <div className={styles.aspectsBox}>
              <h4 className={styles.aspectsTitle}>Key Applications & Benefits</h4>
              <ul className={styles.aspectsList}>
                {elements[activeElement].keyAspects.map((aspect, i) => (
                  <li key={i} className={styles.aspectItem}>
                    <span className={styles.checkIcon}>✓</span>
                    {aspect}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.foundationBanner}>
              <img src={cowDetailImg} alt="Native breed cow detail" className={styles.bannerImg} />
              <div className={styles.bannerText}>
                <strong>Unified Bio-System:</strong> Individual components work synergistically to maintain natural ecological and agricultural harmony.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanchgavyaSection;
