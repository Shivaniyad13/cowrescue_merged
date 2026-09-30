import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

// Project Images
import heroImg from '../assets/images/OIP (2).jfif';
import splitImg from '../assets/images/OIP.jfif';

const About = () => {
  // Mission Cards Data
  const missionList = [
    {
      id: 1,
      title: 'Preserve Traditional Knowledge',
      desc: 'Encourage public awareness of time-tested Indian agricultural practices, indigenous cow breeds, and their deep-rooted cultural and ecological significance.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Promote Scientific Exploration',
      desc: 'Support responsible, evidence-based research and scientific validation of Panchgavya components and cow-based agricultural applications.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.75 20.5a2 2 0 0 0 1.7 3h11.1a2 2 0 0 0 1.7-3L14 9.31V2" />
          <path d="M8.5 2h7" />
          <path d="M14 9.31 8.5 2" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Support Sustainable Agriculture',
      desc: 'Highlight environmentally responsible farming, natural soil enhancement, bio-fertilizer usage, and reduction of synthetic chemical inputs.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12A10 10 0 0 1 12 2z" />
          <path d="M12 6v12" />
          <path d="M8 10l4-4 4 4" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Strengthen Rural Livelihoods',
      desc: 'Explore micro-enterprise opportunities and sustainable self-employment models centered around cattle care and Panchgavya bio-products.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Create Awareness',
      desc: 'Educate rural and urban communities about natural resource stewardship, health benefits, and sustainable living practices.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Connect Tradition With Innovation',
      desc: 'Harmonize ancient heritage with modern thinking and tech-driven distribution models to build future-ready solutions.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    }
  ];

  // Ecosystem Elements Data
  const ecosystemItems = [
    {
      title: 'Traditional Knowledge',
      desc: 'Centuries of indigenous agricultural and cattle care wisdom passed down across generations.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      title: 'Regenerative Farming',
      desc: 'Restoring organic matter, earthworm activity, and microbial balance in agrarian soils.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )
    },
    {
      title: 'Soil Health',
      desc: 'Nurturing long-term soil structure and moisture retention using bio-conditioners.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    },
    {
      title: 'Rural Livelihoods',
      desc: 'Generating decentralized income streams for farmers and rural women artisans.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      title: 'Sustainability',
      desc: 'Creating self-sustaining zero-waste farming models anchored in ecological harmony.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.5 2v6h-6" />
          <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      )
    },
    {
      title: 'Natural Resources',
      desc: 'Responsible utilization of cow-derived natural inputs to reduce input expenditures.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    {
      title: 'Community Awareness',
      desc: 'Building grassroots networks to share knowledge and foster self-reliant villages.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      title: 'Scientific Research',
      desc: 'Objective lab analyses and field testing to validate traditional applications.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h12" />
          <path d="M3 22h18" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M4 18V4a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        </svg>
      )
    }
  ];

  // Values Data
  const valuesList = [
    {
      title: 'Tradition',
      desc: 'Honoring time-tested indigenous wisdom and agricultural heritage.',
      icon: '🏛️'
    },
    {
      title: 'Sustainability',
      desc: 'Nurturing ecological balance for present and future generations.',
      icon: '🌱'
    },
    {
      title: 'Scientific Thinking',
      desc: 'Applying objective research and empirical validation to traditional practices.',
      icon: '🔬'
    },
    {
      title: 'Community',
      desc: 'Empowering rural societies and grassroots farming collectives.',
      icon: '🤝'
    },
    {
      title: 'Responsible Innovation',
      desc: 'Modernizing applications without compromising ethical and cultural values.',
      icon: '💡'
    }
  ];

  // Timeline Transformation Steps
  const transformationSteps = [
    {
      step: '01',
      title: 'Panchgavya',
      desc: 'The foundational natural resource and traditional knowledge base rooted in cattle management.'
    },
    {
      step: '02',
      title: 'Knowledge',
      desc: 'Scientific exploration, laboratory analysis, and evidence-based documentation of bio-properties.'
    },
    {
      step: '03',
      title: 'Sustainable Practices',
      desc: 'Implementation of eco-friendly farming inputs, natural soil revitalizers, and organic methods.'
    },
    {
      step: '04',
      title: 'Rural Opportunity',
      desc: 'Creation of cottage micro-enterprises, decentralized livelihoods, and farmer economic independence.'
    },
    {
      step: '05',
      title: 'Panchparivartan',
      desc: 'Holistic 5-fold transformation across soil, health, environment, economy, and community strength.'
    }
  ];

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
              From <span className={styles.heroHighlight}>Panchgavya</span>
              <br />
              Se<span className={styles.heroHighlight}>Panchparivartan</span>
            </h1>

            <p className={styles.heroSubhead}>
              Connecting traditional wisdom, scientific exploration and sustainable practices to create meaningful change for communities, agriculture and rural livelihoods.
            </p>

            <p className={styles.heroIntro}>
              <strong>Panchgavya Se Panchparivartan</strong> is an initiative inspired by India’s long relationship with cows, agriculture, and nature-based practices. We bring together time-honored knowledge and evidence-based understanding to foster resilient, self-reliant rural ecosystems across Bharat.
            </p>

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

      {/* 2. ABOUT THE INITIATIVE SECTION */}
      <section className={styles.section} aria-label="About the Initiative">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Broadening the Horizon</span>
            <h2 className={styles.sectionTitle}>Why Panchgavya Se Panchparivartan?</h2>
            <p className={styles.sectionSubtitle}>
              Historically, Indian agriculture and village life thrived on a symbiotic relationship between farmers, soil, natural resources, and indigenous cattle. Panchgavya is far more than an individual product—it represents a complete sustainable ecosystem.
            </p>
          </div>

          <div className={styles.ecosystemGrid}>
            {ecosystemItems.map((item, index) => (
              <div key={index} className={styles.ecosystemCard}>
                <div className={styles.iconWrapper}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VISION SECTION */}
      <section id="vision" className={styles.sectionAlt} aria-label="Our Vision">
        <div className={styles.container}>
          <div className={styles.visionWrapper}>
            <div className={styles.visionDecoBg}></div>
            <div className={styles.visionContent}>
              <div className={styles.visionQuoteIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <span className={styles.sectionBadge} style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--color-secondary-light)' }}>
                Our Vision
              </span>
              <h2 className={styles.visionStatement}>
                “To build a sustainable and aware society where India's traditional knowledge surrounding cows, <span className={styles.visionHighlightText}>Panchgavya</span>, agriculture and natural practices is responsibly understood, scientifically explored and transformed into <span className={styles.visionHighlightText}>meaningful opportunities</span> for communities and future generations.”
              </h2>
              <div className={styles.visionDivider}></div>
              <p className={styles.visionParagraph}>
                By empowering agrarian communities with documented traditional wisdom and modern bio-resource practices, we strive to bridge the gap between ancient heritage and sustainable economic progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MISSION SECTION */}
      <section className={styles.section} aria-label="Our Mission">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Pillars of Action</span>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.sectionSubtitle}>
              Guiding principles and key focus areas driving our initiative forward across rural and scientific landscapes.
            </p>
          </div>

          <div className={styles.missionGrid}>
            {missionList.map((item) => (
              <div key={item.id} className={styles.missionCard}>
                <div className={missionHeaderStyle(styles)}>
                  <div className={styles.missionIcon}>{item.icon}</div>
                  <h3 className={styles.missionCardTitle}>{item.title}</h3>
                </div>
                <p className={styles.missionCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSPIRED BY GO VIGYAN ANUSANDHAN KENDRA */}
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

      {/* 6. SECOND IMAGE / SPLIT SECTION */}
      <section className={styles.sectionAlt} aria-label="Tradition Knowledge Sustainability">
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            <div className={styles.splitImageWrapper}>
              <img
                src={splitImg}
                alt="Ancient wisdom meeting modern sustainable farming"
                className={styles.splitImg}
              />
              <span className={styles.splitBadge}>Tradition • Knowledge • Sustainability</span>
            </div>

            <div className={styles.splitContent}>
              <span className={styles.sectionBadge} style={{ alignSelf: 'flex-start' }}>Harmonious Synergy</span>
              <h2 className={styles.splitTitle}>
                Bridging Heritage Wisdom with Ecological Balance
              </h2>
              <p className={styles.splitText}>
                Sustainable progress requires looking back at time-tested principles while applying modern scientific rigor. Cattle management in India has historically formed the cornerstone of circular agriculture—where nothing is wasted and every natural input regenerates the soil.
              </p>

              <div className={styles.splitPoints}>
                <div className={styles.splitPoint}>
                  <span className={styles.splitPointIcon}>✓</span>
                  <span><strong>Zero Synthetic Residue:</strong> Preserving soil microorganisms without damaging chemicals.</span>
                </div>
                <div className={styles.splitPoint}>
                  <span className={styles.splitPointIcon}>✓</span>
                  <span><strong>Decentralized Resilience:</strong> Reducing farmer dependency on expensive commercial inputs.</span>
                </div>
                <div className={styles.splitPoint}>
                  <span className={styles.splitPointIcon}>✓</span>
                  <span><strong>Community Well-being:</strong> Improving food quality, water retention, and rural health.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PANCHGAVYA → PANCHPARIVARTAN VISUAL SECTION */}
      <section className={styles.section} aria-label="Transformation Pipeline">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>The Pathway of Transformation</span>
            <h2 className={styles.sectionTitle}>Panchgavya Se Panchparivartan</h2>
            <p className={styles.sectionSubtitle}>
              A step-by-step evolution showing how foundational natural resources blossom into comprehensive societal and environmental transformation.
            </p>
          </div>

          <div className={styles.timelineWrapper}>
            <div className={styles.timelineConnector}></div>
            {transformationSteps.map((stepItem, index) => (
              <div key={index} className={styles.timelineStep}>
                <div className={styles.timelineNumber}>{stepItem.step}</div>
                <div>
                  <h3 className={styles.timelineTitle}>{stepItem.title}</h3>
                  <p className={styles.timelineDesc}>{stepItem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRODUCT / EXPLORE SECTION */}
      <section className={styles.sectionAlt} aria-label="Explore Products">
        <div className={styles.container}>
          <div className={styles.exploreBox}>
            <h2 className={styles.exploreTitle}>Explore Cow-Based Products & Knowledge</h2>
            <p className={styles.exploreText}>
              Interested in exploring products and initiatives related to cow-based practices? Visit the official Go Vigyan Anusandhan Kendra platform to learn more about their extensive research work and explore their available authentic products.
            </p>
            <div className={styles.exploreBtnGroup}>
              <a
                href="https://govigyan.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Visit Go Vigyan Anusandhan Kendra
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
              <a
                href="https://govigyan.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnOutlineDark}
              >
                Explore Official Products
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. OUR VALUES */}
      <section className={styles.section} aria-label="Our Values">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Core Beliefs</span>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <p className={styles.sectionSubtitle}>
              The core principles driving our commitment to authentic, educational, and sustainable community impact.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {valuesList.map((val, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>{val.icon}</div>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION */}
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

// Helper for class application
function missionHeaderStyle(styles) {
  return styles.missionHeader;
}

export default About;