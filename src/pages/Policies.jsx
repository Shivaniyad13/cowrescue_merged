import { useMemo, useState } from 'react';
import styles from './Policies.module.css';

const Policies = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * IMPORTANT
   * ---------------------------------------------------------
   * This page intentionally contains only laws/rules/Acts
   * directly relevant to cows, cattle, cow shelters,
   * cattle transport, cattle welfare and cow protection.
   *
   * Government schemes such as RGM, NLM, LHDCP, NPDD
   * and AHIDF belong on the Government Initiatives page.
   */

  const policies = [
    {
      id: 1,
      category: 'Cow Safety',
      type: 'Act',
      level: 'Central Government',
      year: '1960',
      icon: '🛡️',

      title: 'Prevention of Cruelty to Animals Act, 1960',

      authority:
        'Government of India · Ministry / Department responsible for Animal Husbandry & Dairying',

      shortDescription:
        'Provides the central legal framework for preventing unnecessary pain and suffering and supporting humane treatment of animals, including cattle.',

      relevance:
        'Foundation for several animal-welfare rules that apply to cattle.',

      sourceUrl:
        'https://www.indiacode.nic.in/handle/123456789/1547',

      pdfUrl:
        'https://www.indiacode.nic.in/bitstream/123456789/15397/1/cruelty_to_animals_act%2C_1960.pdf',
    },

    {
      id: 2,
      category: 'Cow Protection',
      type: 'Act',
      level: 'Central Government',
      year: '1871',
      icon: '🐄',

      title: 'Cattle-Trespass Act, 1871',

      authority:
        'Government of India',

      shortDescription:
        'Provides a legal framework for dealing with cattle found trespassing, including provisions concerning cattle pounds, impounding and release.',

      relevance:
        'Directly concerns cattle and the lawful handling of trespassing cattle.',

      sourceUrl:
        'https://www.indiacode.nic.in/handle/123456789/2294',

      pdfUrl:
        'https://www.indiacode.nic.in/bitstream/123456789/2294/1/A1871-1.pdf',
    },

    {
      id: 3,
      category: 'Cow Shelter',
      type: 'Rules',
      level: 'Central Government',
      year: '1978',
      icon: '🏡',

      title:
        'Prevention of Cruelty to Animals (Registration of Cattle Premises) Rules, 1978',

      authority:
        'Government of India',

      shortDescription:
        'Rules concerning qualifying cattle premises and welfare requirements relating to cattle housing, food, water, ventilation, sanitation and inspection.',

      relevance:
        'One of the most directly relevant central rules for cattle premises and shelter management.',

      sourceUrl:
        'https://www.dahd.gov.in/en/division/awd',

      pdfUrl:
        'https://upload.indiacode.nic.in/showfile?actid=AC_CEN_16_18_00001_196059_1517807317734&filename=14-20.pdf&type=rule',
    },

    {
      id: 4,
      category: 'Cow Transport',
      type: 'Rules',
      level: 'Central Government',
      year: '1978',
      icon: '🚚',

      title: 'Transport of Animals Rules, 1978',

      authority:
        'Government of India',

      shortDescription:
        'Sets welfare and safety requirements for transporting livestock and contains provisions relevant to cattle transportation.',

      relevance:
        'Useful for understanding basic welfare safeguards when cows or other cattle are transported.',

      sourceUrl:
        'https://www.dahd.gov.in/en/division/awd',

      pdfUrl:
        'https://www.dahd.gov.in/sites/default/files/2026-05/TRANSPORT-OF-ANIMALS-RULES.pdf',
    },

    {
      id: 5,
      category: 'Cow Transport',
      type: 'Rules',
      level: 'Central Government',
      year: '2001',
      icon: '🐂',

      title:
        'Prevention of Cruelty to Animals (Transport of Animals on Foot) Rules, 2001',

      authority:
        'Government of India',

      shortDescription:
        'Provides welfare requirements for livestock transported on foot, including provisions relevant to cattle.',

      relevance:
        'Important for protecting cattle from unnecessary suffering during movement on foot.',

      sourceUrl:
        'https://www.dahd.gov.in/en/division/awd',

      pdfUrl:
        'https://upload.indiacode.nic.in/showfile?actid=AC_DD_63_887_00008_00008_1550661140630&filename=prevention_of_cruelty_5_to_animals_%28transport_of_animals_on_foot%29_rules_2001.pdf&type=notification',
    },

    {
      id: 6,
      category: 'Cow Welfare',
      type: 'Rules',
      level: 'Central Government',
      year: '2001',
      icon: '⚖️',

      title:
        'Prevention of Cruelty to Animals (Slaughter House) Rules, 2001',

      authority:
        'Government of India',

      shortDescription:
        'Provides animal-welfare requirements for recognised or licensed slaughter houses and processes involving animals.',

      relevance:
        'Included as part of the central legal framework governing animal welfare and cattle-related slaughter regulation.',

      sourceUrl:
        'https://www.dahd.gov.in/en/division/awd',

      pdfUrl:
        'https://www.dahd.gov.in/sites/default/files/2026-05/PerformingAnimalRules2001.pdf',
    },

    {
      id: 7,
      category: 'Cow Husbandry',
      type: 'Rules',
      level: 'Central Government',
      year: '2023',
      icon: '🩺',

      title:
        'Prevention of Cruelty to Animals (Animal Husbandry Practices and Procedures) Rules, 2023',

      authority:
        'Ministry of Fisheries, Animal Husbandry & Dairying · Government of India',

      shortDescription:
        'Provides humane requirements for specified animal-husbandry practices and veterinary procedures involving livestock.',

      relevance:
        'Relevant to humane cattle husbandry and veterinary care.',

      sourceUrl:
        'https://dahd.gov.in/sites/default/files/2026-05/PreventionofCrueltytoAnimalsRules2023.pdf',

      pdfUrl:
        'https://dahd.gov.in/sites/default/files/2026-05/PreventionofCrueltytoAnimalsRules2023.pdf',
    },

    {
      id: 8,
      category: 'Cow Shelter',
      type: 'Act',
      level: 'State Government',
      state: 'Uttar Pradesh',
      year: '1964',
      icon: '🏡',

      title: 'Uttar Pradesh Goshala Adhiniyam, 1964',

      authority:
        'Government of Uttar Pradesh · Department of Animal Husbandry',

      shortDescription:
        'Provides a legal framework for registration, records, inspection and administration of Goshalas in Uttar Pradesh.',

      relevance:
        'Directly relevant to registered cow shelters and Goshala administration in Uttar Pradesh.',

      sourceUrl:
        'https://www.indiacode.nic.in/handle/123456789/17033',

      pdfUrl:
        'https://www.indiacode.nic.in/bitstream/123456789/17033/3/goshala_act.pdf',
    },

    {
      id: 9,
      category: 'Cow Protection',
      type: 'Act',
      level: 'State Government',
      state: 'Uttar Pradesh',
      year: '1999',
      icon: '🇮🇳',

      title: 'Uttar Pradesh Go-Seva Ayog Adhiniyam, 1999',

      authority:
        'Government of Uttar Pradesh · Department of Animal Husbandry',

      shortDescription:
        'Establishes the Uttar Pradesh Go-Seva Ayog and provides functions relating to cow welfare and support for Goshalas.',

      relevance:
        'Directly connected with cow welfare, Goshala support and cow-related public administration in Uttar Pradesh.',

      sourceUrl:
        'https://www.indiacode.nic.in/handle/123456789/17045',

      pdfUrl:
        'https://www.indiacode.nic.in/bitstream/123456789/17045/3/sewa_aayog.pdf',
    },

    {
      id: 10,
      category: 'Cow Protection',
      type: 'Act',
      level: 'State Government',
      state: 'Uttar Pradesh',
      year: '1955',
      icon: '⚖️',

      title: 'Uttar Pradesh Prevention of Cow Slaughter Act, 1955',

      authority:
        'Government of Uttar Pradesh · Department of Animal Husbandry',

      shortDescription:
        'Provides state-level legal provisions concerning prevention of cow slaughter, regulation of cow transport and maintenance of cows.',

      relevance:
        'One of the most directly cow-specific laws relevant to cow protection in Uttar Pradesh.',

      sourceUrl:
        'https://www.indiacode.nic.in/handle/123456789/21079',

      pdfUrl:
        'https://www.indiacode.nic.in/bitstream/123456789/21079/1/english_1_of_1956.pdf',
    },
  ];

  const categories = [
    'All',
    'Cow Shelter',
    'Cow Safety',
    'Cow Transport',
    'Cow Protection',
    'Cow Husbandry',
    'Cow Welfare',
  ];

  const levels = [
    'All',
    'Central Government',
    'State Government',
  ];

  const filteredPolicies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return policies.filter((policy) => {
      const categoryMatch =
        activeCategory === 'All' ||
        policy.category === activeCategory;

      const levelMatch =
        activeLevel === 'All' ||
        policy.level === activeLevel;

      const searchMatch =
        !query ||
        policy.title.toLowerCase().includes(query) ||
        policy.category.toLowerCase().includes(query) ||
        policy.authority.toLowerCase().includes(query) ||
        policy.shortDescription.toLowerCase().includes(query) ||
        policy.year.toLowerCase().includes(query) ||
        (policy.state &&
          policy.state.toLowerCase().includes(query));

      return (
        categoryMatch &&
        levelMatch &&
        searchMatch
      );
    });
  }, [
    activeCategory,
    activeLevel,
    searchQuery,
  ]);

  const resetFilters = () => {
    setActiveCategory('All');
    setActiveLevel('All');
    setSearchQuery('');
  };

  return (
    <div className={styles.policiesPage}>

      {/* ================= HERO ================= */}

      <section className={styles.heroSection}>

        <div className={styles.heroPattern}></div>

        <div className={styles.container}>

          <div className={styles.heroContent}>

            <span className={styles.heroEyebrow}>
              🇮🇳 OFFICIAL GOVERNMENT LEGAL RESOURCES
            </span>

            <h1 className={styles.heroTitle}>
              Government Policies
              <br />
              <span>for Cow Protection & Welfare</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Simple access to government Acts and Rules
              related to cow shelters, cattle safety,
              transport, husbandry and cow protection.
            </p>

            <div className={styles.heroActions}>

              <a
                href="#policy-library"
                className={styles.heroPrimaryBtn}
              >
                Explore Policies
                <span>↓</span>
              </a>

              <a
                href="https://www.indiacode.nic.in/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroSecondaryBtn}
              >
                India Code ↗
              </a>

            </div>

            <div className={styles.heroTrustRow}>

              <span>✓ Official Sources</span>
              <span>✓ Government Documents</span>
              <span>✓ PDF Access</span>

            </div>

          </div>

        </div>

      </section>


      {/* ================= QUICK INTRO ================= */}

      <section className={styles.introSection}>

        <div className={styles.container}>

          <div className={styles.introGrid}>

            <div>

              <span className={styles.sectionEyebrow}>
                WHY THIS PAGE?
              </span>

              <h2 className={styles.sectionTitle}>
                Know the rules that protect cows.
              </h2>

              <p className={styles.sectionText}>
                This page brings together selected
                government Acts and Rules that are
                directly relevant to cows, cattle
                shelters, cattle transport, humane
                husbandry and cow protection.
              </p>

              <p className={styles.sectionText}>
                Government schemes are intentionally
                kept on the separate Government
                Initiatives page. This page is only for
                legal Acts and Rules.
              </p>

            </div>


            <div className={styles.statsGrid}>

              <div className={styles.statCard}>
                <strong>{policies.length}</strong>
                <span>Legal Resources</span>
              </div>

              <div className={styles.statCard}>
                <strong>6</strong>
                <span>Cow-Focused Areas</span>
              </div>

              <div className={styles.statCard}>
                <strong>2</strong>
                <span>Government Levels</span>
              </div>

              <div className={styles.statCard}>
                <strong>PDF</strong>
                <span>Official Documents</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= POLICY LIBRARY ================= */}

      <section
        id="policy-library"
        className={styles.librarySection}
      >

        <div className={styles.container}>

          <div className={styles.libraryHeader}>

            <div>

              <span className={styles.sectionEyebrow}>
                OFFICIAL DOCUMENT LIBRARY
              </span>

              <h2 className={styles.sectionTitle}>
                Cow Laws, Acts & Rules
              </h2>

              <p className={styles.sectionText}>
                Find the government document you need
                and download the official PDF.
              </p>

            </div>

            <div className={styles.resultCount}>
              <strong>
                {filteredPolicies.length}
              </strong>
              <span>
                {filteredPolicies.length === 1
                  ? ' document'
                  : ' documents'}
              </span>
            </div>

          </div>


          {/* ================= SEARCH ================= */}

          <div className={styles.filterPanel}>

            <div className={styles.searchBox}>

              <span className={styles.searchIcon}>
                ⌕
              </span>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search cow policies, shelter, transport..."
                aria-label="Search cow policies"
              />

              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>


            {/* CATEGORY FILTER */}

            <div className={styles.filterRow}>

              <div className={styles.filterLabel}>
                Focus Area
              </div>

              <div className={styles.filterButtons}>

                {categories.map((category) => (

                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    className={
                      activeCategory === category
                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                        : styles.filterButton
                    }
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>


            {/* LEVEL FILTER */}

            <div className={styles.filterRow}>

              <div className={styles.filterLabel}>
                Government Level
              </div>

              <div className={styles.filterButtons}>

                {levels.map((level) => (

                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setActiveLevel(level)
                    }
                    className={
                      activeLevel === level
                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                        : styles.filterButton
                    }
                  >
                    {level === 'All'
                      ? 'All'
                      : level === 'Central Government'
                        ? 'Central'
                        : 'Uttar Pradesh'}
                  </button>

                ))}

              </div>

            </div>

          </div>


          {/* ================= CARDS ================= */}

          {filteredPolicies.length > 0 ? (

            <div className={styles.policyGrid}>

              {filteredPolicies.map((policy) => (

                <article
                  key={policy.id}
                  className={styles.policyCard}
                >

                  <div className={styles.cardTop}>

                    <div className={styles.cardIcon}>
                      {policy.icon}
                    </div>

                    <div className={styles.cardBadges}>

                      <span className={styles.categoryBadge}>
                        {policy.category}
                      </span>

                      <span
                        className={
                          policy.level === 'State Government'
                            ? styles.stateBadge
                            : styles.centralBadge
                        }
                      >
                        {policy.level ===
                        'State Government'
                          ? 'UP'
                          : 'India'}
                      </span>

                    </div>

                  </div>


                  <div className={styles.cardTypeRow}>

                    <span>
                      {policy.type}
                    </span>

                    <span>
                      {policy.year}
                    </span>

                  </div>


                  <h3 className={styles.cardTitle}>
                    {policy.title}
                  </h3>


                  {policy.state && (
                    <div className={styles.stateText}>
                      📍 {policy.state}
                    </div>
                  )}


                  <div className={styles.authorityBox}>

                    <span>
                      ISSUING AUTHORITY
                    </span>

                    <p>
                      {policy.authority}
                    </p>

                  </div>


                  <p className={styles.cardDescription}>
                    {policy.shortDescription}
                  </p>


                  <div className={styles.relevanceBox}>

                    <span>
                      WHY IT MATTERS
                    </span>

                    <p>
                      {policy.relevance}
                    </p>

                  </div>


                  <div className={styles.cardActions}>

                    <a
                      href={policy.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readButton}
                    >
                      Read Official Source
                      <span>↗</span>
                    </a>

                    <a
                      href={policy.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadButton}
                    >
                      Download PDF
                      <span>↓</span>
                    </a>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className={styles.emptyState}>

              <div className={styles.emptyIcon}>
                🔎
              </div>

              <h3>
                No policy found
              </h3>

              <p>
                Try another keyword or reset the filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className={styles.resetButton}
              >
                Reset Filters
              </button>

            </div>

          )}

        </div>

      </section>


      {/* ================= SHELTER FOCUS ================= */}

      <section className={styles.shelterSection}>

        <div className={styles.container}>

          <div className={styles.shelterCard}>

            <div className={styles.shelterIcon}>
              🏡
            </div>

            <div>

              <span className={styles.sectionEyebrow}>
                FOR COW SHELTERS
              </span>

              <h2>
                Looking after a Goshala?
              </h2>

              <p>
                The Uttar Pradesh Goshala Adhiniyam,
                1964 provides a state-level legal
                framework concerning registration,
                records and inspection of Goshalas.
                Use the official document to understand
                the applicable requirements.
              </p>

              <a
                href="https://www.indiacode.nic.in/handle/123456789/17033"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shelterButton}
              >
                View Goshala Act ↗
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ================= OFFICIAL SOURCES ================= */}

      <section className={styles.sourcesSection}>

        <div className={styles.container}>

          <div className={styles.sourcesHeader}>

            <span className={styles.sectionEyebrow}>
              VERIFY BEFORE USE
            </span>

            <h2 className={styles.sectionTitle}>
              Always check the official source.
            </h2>

            <p className={styles.sectionText}>
              Laws and Rules can be amended. Use the
              official government source as the final
              reference for the current legal position.
            </p>

          </div>


          <div className={styles.sourceGrid}>

            <a
              href="https://www.dahd.gov.in/en/division/awd"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceCard}
            >
              <span>🏛️</span>

              <div>
                <strong>
                  DAHD
                </strong>

                <small>
                  Animal Welfare Division
                </small>
              </div>

              <b>↗</b>
            </a>


            <a
              href="https://www.indiacode.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceCard}
            >
              <span>⚖️</span>

              <div>
                <strong>
                  India Code
                </strong>

                <small>
                  Government legislation database
                </small>
              </div>

              <b>↗</b>
            </a>

          </div>

        </div>

      </section>


      {/* ================= DISCLAIMER ================= */}

      <section className={styles.disclaimerSection}>

        <div className={styles.container}>

          <div className={styles.disclaimer}>

            <span className={styles.disclaimerIcon}>
              ℹ
            </span>

            <div>

              <strong>
                Important
              </strong>

              <p>
                This page is an informational directory
                of selected government Acts and Rules
                relevant to cows and cattle. It is not
                legal advice and is not itself a government
                website. Government documents may be
                amended or replaced. Always verify the
                latest applicable version from the relevant
                official government authority.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Policies;