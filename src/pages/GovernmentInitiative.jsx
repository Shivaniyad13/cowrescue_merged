import React from 'react';
import styles from './GovernmentInitiative.module.css';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../cloudinary.js';
const cowHeroImg = cloudinaryAssets["images/cow1.jpg"];

// Project image
// [moved-to-cloudinary] import cowHeroImg from '../assets/images/cow1.jpg';

const GovernmentInitiative = () => {
  // 4 Main Government Scheme Cards
  const schemes = [
    {
      id: 1,
      name: 'Rashtriya Gokul Mission',
      icon: '🐄',
      explanation: 'Supports the conservation and development of India\'s indigenous cattle breeds and helps improve livestock productivity.',
      beneficiaries: 'Farmers and livestock owners',
      officialUrl: 'https://www.dahd.gov.in/en/schemes/programmes/rashtriya_gokul_mission'
    },
    {
      id: 2,
      name: 'National Livestock Mission',
      icon: '🌾',
      explanation: 'Supports livestock-related activities, entrepreneurship, fodder development and rural livelihood opportunities.',
      beneficiaries: 'Farmers, entrepreneurs, SHGs and rural groups',
      officialUrl: 'https://nlm.udyamimitra.in/'
    },
    {
      id: 3,
      name: 'Livestock Health & Disease Control',
      icon: '🏥',
      explanation: 'Focuses on animal health, disease prevention and better livestock care.',
      beneficiaries: 'Livestock owners and animal-care communities',
      officialUrl: 'https://dahd.gov.in/en/schemes-programmes/lh-dc'
    },
    {
      id: 4,
      name: 'Dairy Development',
      icon: '🥛',
      explanation: 'Supports dairy development and helps strengthen opportunities for dairy farmers and rural communities.',
      beneficiaries: 'Dairy farmers and rural communities',
      officialUrl: 'https://updairydevelopment.gov.in/'
    }
  ];

  // 5 Beneficiary Groups
  const beneficiariesList = [
    {
      id: 1,
      title: 'Farmers',
      icon: '👨‍🌾',
      desc: 'Support related to livestock, dairy and rural activities.'
    },
    {
      id: 2,
      title: 'Livestock Owners',
      icon: '🐄',
      desc: 'Information related to animal health and livestock development.'
    },
    {
      id: 3,
      title: 'Gaushalas & Animal Welfare Groups',
      icon: '🏡',
      desc: 'Relevant animal-care and welfare information.'
    },
    {
      id: 4,
      title: 'Rural & Community Groups',
      icon: '👩‍🌾',
      desc: 'Opportunities connected with rural development and livelihoods.'
    },
    {
      id: 5,
      title: 'Rural Entrepreneurs',
      icon: '💼',
      desc: 'Information about livestock-related entrepreneurship opportunities.'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection} aria-label="Government Initiatives Hero">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>🇮🇳</span> Official Programmes & Rural Support
              </div>
              <h1 className={styles.heroTitle}>Government Initiatives</h1>
              <p className={styles.heroSubhead}>
                Explore government programmes that support farmers, livestock, animal care and rural communities.
              </p>
            </div>
            <div className={styles.heroImageCard}>
              <img
                src={cowHeroImg}
                alt="Indigenous cattle in rural setting"
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.introSection} aria-label="Why These Initiatives Matter">
        <div className={styles.container}>
          <div className={styles.introBox}>
            <h2 className={styles.introTitle}>Why These Initiatives Matter</h2>
            <p className={styles.introText}>
              Government programmes can provide support for farmers, livestock owners, animal welfare and rural communities. This page helps you understand the main initiatives and where to find official information.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN SECTION: 4 INITIATIVE CARDS */}
      <section className={styles.section} aria-label="Explore Government Initiatives">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Key Programmes</span>
            <h2 className={styles.sectionTitle}>Explore Government Initiatives</h2>
            <p className={styles.sectionSubtitle}>
              Simple summary of national schemes designed to enhance livestock productivity, rural livelihoods, and animal welfare.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            {schemes.map((scheme) => (
              <div key={scheme.id} className={styles.schemeCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{scheme.icon}</div>
                  <span className={styles.officialLabel}>
                    <span>🏛️</span> Official Government Information
                  </span>
                </div>

                <h3 className={styles.schemeTitle}>{scheme.name}</h3>
                <p className={styles.schemeDesc}>{scheme.explanation}</p>

                <div className={styles.benefitBox}>
                  <div className={styles.benefitLabel}>Who can benefit?</div>
                  <div className={styles.benefitText}>{scheme.beneficiaries}</div>
                </div>

                <div className={styles.cardActions}>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.officialBtn}
                  >
                    Visit Official Website →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO CAN BENEFIT? */}
      <section className={styles.benefitSection} aria-label="Who Can Benefit">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Target Groups</span>
            <h2 className={styles.sectionTitle}>Who Can Benefit?</h2>
            <p className={styles.sectionSubtitle}>
              Direct opportunities tailored for diverse members of rural and agricultural communities.
            </p>
          </div>

          <div className={styles.beneficiaryGrid}>
            {beneficiariesList.map((item) => (
              <div key={item.id} className={styles.beneficiaryCard}>
                <span className={styles.beneficiaryIcon}>{item.icon}</span>
                <h3 className={styles.beneficiaryTitle}>{item.title}</h3>
                <p className={styles.beneficiaryDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLE USER GUIDE */}
      <section className={styles.guideSection} aria-label="User Guide">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Getting Started</span>
            <h2 className={styles.sectionTitle}>Not Sure Where to Start?</h2>
            <p className={styles.sectionSubtitle}>
              A quick 3-step guide to finding the right official information.
            </p>
          </div>

          <div className={styles.stepsWrapper}>
            <div className={styles.stepCard}>
              <div className={styles.stepBadge}>1</div>
              <h3 className={styles.stepTitle}>Choose your interest</h3>
              <p className={styles.stepDesc}>
                Identify if your focus is farming, livestock care, dairy production, or rural enterprise.
              </p>
              <div className={styles.stepTags}>Farmer / Livestock / Dairy / Business</div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepBadge}>2</div>
              <h3 className={styles.stepTitle}>Read the relevant initiative</h3>
              <p className={styles.stepDesc}>
                Understand what the programme is about and see if it aligns with your goals.
              </p>
              <div className={styles.stepTags}>Understand the basics</div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepBadge}>3</div>
              <h3 className={styles.stepTitle}>Check the official website</h3>
              <p className={styles.stepDesc}>
                Get the latest eligibility, application and support information directly from the government.
              </p>
              <div className={styles.stepTags}>Official application info</div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT DISCLAIMER */}
      <div className={styles.container}>
        <div className={styles.disclaimerBox}>
          <span className={styles.disclaimerIcon}>ℹ️</span>
          <p className={styles.disclaimerText}>
            <strong>Note:</strong> Government schemes, eligibility rules and application processes may change. Please check the official government website for the latest information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GovernmentInitiative;
