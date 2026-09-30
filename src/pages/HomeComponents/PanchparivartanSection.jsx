import React, { useState } from 'react';
import styles from './PanchparivartanSection.module.css';

const PanchparivartanSection = () => {
  const [activeCard, setActiveCard] = useState(null);

  const transformations = [
    {
      num: '01',
      title: 'Swadeshi',
      subtitle: 'Owning Our Future with Pride',
      shortText:
        'Self-awareness of our roots, support for indigenous enterprise, innovation, and stronger local economies.',
      fullText:
        'Swadeshi is presented as more than buying Indian products. It emphasizes Atmabodh — awareness of roots and responsibility — along with supporting indigenous enterprises, developing technologies for Indian needs, and strengthening rural economies.',
      actions: [
        'Support indigenous enterprises.',
        'Innovate in technologies that solve India’s problems.',
        'Strengthen rural economies by making local the new global.'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M3 21c3-7 8-12 18-18"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 17c-1-4 1-8 5-10 3-1 6-1 9-4 0 6-2 10-6 12-3 1-6 1-8 2z"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Samajik Samarasta',
      subtitle: 'The Spirit of Oneness',
      shortText:
        'A vision of social harmony where people participate, connect, and contribute beyond social differences.',
      fullText:
        'Samajik Samarasta means social harmony. The supplied text describes it as a society where people are not excluded because of birth, profession, or social background, and where relationships and participation extend across caste, region, and language.',
      actions: [
        'Step out of your comfort zone.',
        'Volunteer in villages and urban slums.',
        'Build friendships that transcend caste, region, or language.'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="9" cy="8" r="3" strokeWidth="1.8" />
          <circle cx="17" cy="9" r="2.5" strokeWidth="1.8" />
          <path
            d="M3.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M14 15c2.8.2 4.7 1.8 5.2 5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Kutumb',
      subtitle: 'Strengthening the First Unit of Society',
      shortText:
        'Family as a space for shared responsibility, care, resilience, values, and connection across generations.',
      fullText:
        'Kutumb describes the family as the first school of Sanskar, where responsibilities, Dharma, and unconditional care are experienced. The supplied text emphasizes shared responsibility and ensuring that elders and children do not feel isolated.',
      actions: [
        'Spend quality time with elders.',
        'Celebrate festivals and traditions together consciously.',
        'Ensure family members, especially elders and children, feel connected.'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M3 11.5 12 4l9 7.5"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 10.5V20h13v-9.5"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 20v-5h6v5"
            strokeWidth="1.8"
          />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Nagrik Kartavya',
      subtitle: 'Citizenship as a Dharma',
      shortText:
        'Citizenship understood through responsibility, civic participation, public dignity, and service.',
      fullText:
        'Nagrik Kartavya frames citizenship around fulfilling responsibilities alongside rights. The supplied text highlights cleanliness, safety, dignity, responsible voting, civic volunteering, public order, and mentoring the next generation.',
      actions: [
        'Contribute to cleanliness, safety, and civic dignity.',
        'Vote responsibly and participate in civic causes.',
        'Mentor the next generation toward responsible citizenship.'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M4 20h16"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 20V9l6-4 6 4v11"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 12h6M9 15h6"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    },
    {
      num: '05',
      title: 'Paryavaran',
      subtitle: 'Living in Harmony with Nature',
      shortText:
        'Environmental responsibility through conservation, sustainable living, and a closer relationship with nature.',
      fullText:
        'Paryavaran focuses on living in harmony with nature. The supplied text discusses respect for rivers, trees, animals, and the five elements, alongside tree plantation, water conservation, reducing plastic, saving energy, recycling, and ecological volunteering.',
      actions: [
        'Participate in tree plantation and water conservation.',
        'Reduce plastic, save energy, and recycle mindfully.',
        'Participate in ecological initiatives and connect with nature.'
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 21c5-2 8-6 8-11 0-3-1-5-2-7-5 1-9 3-11 7-2 4 0 8 5 11z"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M4 20c3-5 6-8 12-11"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    }
  ];

  return (
    <section
      className={styles.section}
      aria-label="Panch Parivartan"
    >
      <div className={styles.container}>

        {/* INTRO */}
        <div className={styles.intro}>
          <span className={styles.eyebrow}>
            FIVE PATHS • PANCH PARIVARTAN
          </span>

          <h2 className={styles.title}>
            Panch Parivartan
          </h2>

          <h3 className={styles.heading}>
            The Five Paths to Rebuilding Bharat’s Future
          </h3>

          <p className={styles.introText}>
            Panch Parivartan is presented through five interconnected
            transformations: Swadeshi, Samajik Samarasta, Kutumb,
            Nagrik Kartavya, and Paryavaran.
          </p>

          <div className={styles.divider} />
        </div>

        {/* CARDS */}
        <div className={styles.grid}>
          {transformations.map((item, index) => {
            const isActive = activeCard === index;

            return (
              <article
                key={item.num}
                className={`${styles.card} ${
                  isActive ? styles.cardActive : ''
                }`}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() =>
                  setActiveCard(isActive ? null : index)
                }
              >
                {/* CARD TOP */}
                <div className={styles.cardTop}>
                  <span className={styles.number}>
                    {item.num}
                  </span>

                  <div className={styles.icon}>
                    {item.icon}
                  </div>
                </div>

                {/* CONTENT */}
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>
                    TRANSFORMATION {item.num}
                  </span>

                  <h3 className={styles.cardTitle}>
                    {item.title}
                  </h3>

                  <h4 className={styles.cardSubtitle}>
                    {item.subtitle}
                  </h4>

                  <p className={styles.cardText}>
                    {item.shortText}
                  </p>

                  {/* EXPANDED CONTENT */}
                  <div
                    className={`${styles.expandContent} ${
                      isActive
                        ? styles.expandContentVisible
                        : ''
                    }`}
                  >
                    <p className={styles.fullText}>
                      {item.fullText}
                    </p>

                    <div className={styles.actionHeading}>
                      Everyday Actions
                    </div>

                    <ul className={styles.actionsList}>
                      {item.actions.map(
                        (action, actionIndex) => (
                          <li key={actionIndex}>
                            <span className={styles.check}>
                              ✓
                            </span>
                            <span>{action}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* FOOTER */}
                <div className={styles.cardFooter}>
                  <span>Explore Pillar</span>

                  <span className={styles.arrow}>
                    →
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* CLOSING STATEMENT */}
        <div className={styles.closing}>
          <div className={styles.closingMark}>
            ✦
          </div>

          <p>
            Panch Parivartan is presented in the supplied text as
            an internal awakening connected with citizenship,
            responsibility, service, cultural values, and harmony
            with nature.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PanchparivartanSection;