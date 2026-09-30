import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NgoInitiative.module.css';

// Project image asset
// import heroArt from '../assets/images/cow6.jpg';
const heroArt =
  'https://d18x2uyjeekruj.cloudfront.net/wp-content/uploads/2024/12/Group-48096549.jpg';

const NgoInitiative = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  // 5 Categories Data
  const categories = [
    {
      id: 'animal-welfare',
      name: 'Animal Welfare',
      icon: '🐄',
      desc: 'Organizations working for animal care, rescue, shelter and welfare.'
    },
    {
      id: 'rural-dev',
      name: 'Rural Development',
      icon: '🌱',
      desc: 'Organizations supporting farmers, villages and rural livelihoods.'
    },
    {
      id: 'sustainable-agri',
      name: 'Sustainable Agriculture',
      icon: '🌾',
      desc: 'Organizations promoting sustainable and responsible farming practices.'
    },
    {
      id: 'community-dev',
      name: 'Community Development',
      icon: '🏘️',
      desc: 'Organizations working directly with local communities and social groups.'
    },
    {
      id: 'research',
      name: 'Research & Traditional Knowledge',
      icon: '🔬',
      desc: 'Organizations involved in research, education and preservation of traditional knowledge.'
    }
  ];

  // Featured Organizations Sample Data
  const organizations = [
    {
      id: 1,
      name: 'Go Vigyan Anusandhan Kendra',
      location: 'Deolapar, Nagpur, Maharashtra',
      category: 'Research & Traditional Knowledge',
      desc: 'Pioneering research institute scientifically exploring cow-based products, organic farming, Panchgavya applications, and rural self-employment models.',
      website: 'https://govigyan.com/en/',
      logoIcon: '🔬'
    },
    {
      id: 2,
      name: 'Kamdhenu Seva Sansthan',
      location: 'Jaipur, Rajasthan',
      category: 'Animal Welfare',
      desc: 'Dedicated to cattle care, rescue of vulnerable animals, organic manure production, and awareness about indigenous cow breeds.',
      website: 'https://kamdhenusewa.in/',
      logoIcon: '🐄'
    },

    {
      id: 6,
      name: 'Bharatiya Gau Samvardhan Trust',
      location: 'Haridwar, Uttarakhand',
      category: 'Research & Traditional Knowledge',
      desc: 'Focused on documenting traditional veterinary wisdom, conservation of native cattle breeds, and educational community outreach.',
      website: 'https://ahd.uk.gov.in/organization/uttarakhand-gau-seva-ayog/',
      logoIcon: '📚'
    },
    {
      id: 3,
      name: 'Gramin Vikas Seva Samiti',
      location: 'Varanasi, Uttar Pradesh',
      category: 'Rural Development',
      desc: 'Supporting smallholder farmers with natural farming techniques, self-reliance workshops, and micro-livelihood training.',
      website: 'https://give.do/ngos/gramin-vikash-seva-samiti1',
      logoIcon: '🌱'
    },
    {
      id: 4,
      name: 'Jaivik Krishi Abhiyan',
      location: 'Anand, Gujarat',
      category: 'Sustainable Agriculture',
      desc: 'Empowering farming collectives to transition from chemical inputs to cow-based bio-fertilizers and organic soil restoration.',
      website: 'https://agriculture.vikaspedia.in/viewcontent/agriculture/91593f93893e92894b902-915947-93293f90f-93093e91c94d92f-93593f936947937-92f94b91c92893e90f902/92e92794d92f92a94d930926947936/91c94893593f915-916947924940-92a94d93094b92494d93893e939928-92f94b91c92893e?lgn=hi',
      logoIcon: '🌾'
    },
    {
      id: 5,
      name: 'Lok Seva Foundation',
      location: 'Bhopal, Madhya Pradesh',
      category: 'Community Development',
      desc: 'Grassroots organization working with village self-help groups (SHGs) to promote clean bio-energy, cattle care, and community well-being.',
      website: 'https://www.mpedistrict.gov.in/MPL/Mas_TatkalUserDoMappingRpt.aspx?ViewReport_Level_1=xGlaWzKL8KP47RZfvo18mQ==',
      logoIcon: '🏘️'
    },
    
  ];

  // Filter organizations by category
  const filteredOrgs = activeCategory === 'All'
    ? organizations
    : organizations.filter(org => org.category === activeCategory);

  const scrollToOrgs = () => {
    const element = document.getElementById('explore-orgs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. HERO SECTION */}
      <section className={styles.heroSection} aria-label="NGOs Hero">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <span>🤝</span> Community Impact & Social Change  
              </div>
              <h1 className={styles.heroTitle}>Organizations Creating Change</h1>
              <p className={styles.heroSubhead}>
                Discover NGOs and organizations working for animal welfare, rural communities, sustainability and meaningful social change.
              </p>
            </div>
            <div className={styles.heroImageCard}>
             <img src={heroArt} alt="..." />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className={styles.introSection} aria-label="Why Organizations Matter">
        <div className={styles.container}>
          <div className={styles.introBox}>
            <h2 className={styles.introTitle}>Why Organizations Matter</h2>
            <p className={styles.introText}>
              Many organizations are already working at the community level to support animals, farmers, rural families and sustainable practices. This space helps you discover their work and find ways to connect with them.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className={styles.section} aria-label="Explore by Area of Work">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Focus Areas</span>
            <h2 className={styles.sectionTitle}>Explore by Area of Work</h2>
            <p className={styles.sectionSubtitle}>
              Find initiatives categorized by their core operational focus across rural India.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.categoryCard} ${activeCategory === cat.name ? styles.categoryCardActive : ''}`}
                onClick={() => {
                  setActiveCategory(activeCategory === cat.name ? 'All' : cat.name);
                  scrollToOrgs();
                }}
              >
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h3 className={styles.categoryTitle}>{cat.name}</h3>
                <p className={styles.categoryDesc}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED ORGANIZATIONS SECTION */}
      <section id="explore-orgs" className={styles.orgsSection} aria-label="Explore Organizations">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Community Directory</span>
            <h2 className={styles.sectionTitle}>Explore Organizations</h2>
            <p className={styles.sectionSubtitle}>
              Discover active organizations working dedicatedly for cattle care, natural farming, and rural empowerment.
            </p>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterBtn} ${activeCategory === 'All' ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All Categories ({organizations.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.name ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Organizations Grid */}
          <div className={styles.orgsGrid}>
            {filteredOrgs.map((org) => (
              <div key={org.id} className={styles.orgCard}>
                <div className={styles.orgHeader}>
                  <div className={styles.orgLogo}>{org.logoIcon}</div>
                  <div className={styles.orgMeta}>
                    <h3 className={styles.orgName}>{org.name}</h3>
                    <span className={styles.orgLocation}>📍 {org.location}</span>
                  </div>
                </div>

                <span className={styles.orgAreaBadge}>{org.category}</span>

                <p className={styles.orgDesc}>{org.desc}</p>

                <div className={styles.orgActions}>
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitBtn}
                  >
                    Visit Website →
                  </a>
                  <Link to="/contact" className={styles.connectBtn}>
                    Connect →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONNECTION / INVOLVEMENT SECTION */}
      <section className={styles.involvementSection} aria-label="Get Involved">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Participation</span>
            <h2 className={styles.sectionTitle}>Want to Get Involved?</h2>
            <p className={styles.sectionSubtitle}>
              You can support organizations not only through donations, but also through volunteering, awareness activities, community work and sharing their mission.
            </p>
          </div>

          <div className={styles.involvementGrid}>
            <div className={styles.involvementCard}>
              <div className={styles.involvementIcon}>🤝</div>
              <h3 className={styles.involvementTitle}>Volunteer</h3>
              <p className={styles.involvementDesc}>
                Offer your time and skills to support meaningful ground activities, events, and community outreach.
              </p>
              <Link to="/contact" className={styles.involvementBtn}>
                Volunteer
              </Link>
            </div>

            <div className={styles.involvementCard}>
              <div className={styles.involvementIcon}>❤️</div>
              <h3 className={styles.involvementTitle}>Support</h3>
              <p className={styles.involvementDesc}>
                Learn how you can support an organization’s projects, cattle care facilities, and local farming initiatives.
              </p>
              <Link to="/donation" className={styles.involvementBtn}>
                Support
              </Link>
            </div>

            <div className={styles.involvementCard}>
              <div className={styles.involvementIcon}>🌱</div>
              <h3 className={styles.involvementTitle}>Collaborate</h3>
              <p className={styles.involvementDesc}>
                Organizations can connect with Panchgavya Se Panchparivartan for joint programs and resource sharing.
              </p>
              <Link to="/contact" className={styles.involvementBtn}>
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONNECT WITH AN ORGANIZATION CTA */}
      <div className={styles.container}>
        <div className={styles.connectBox}>
          <h2 className={styles.connectTitle}>Looking for an Organization to Connect With?</h2>
          <p className={styles.connectText}>
            Tell us what kind of work you are interested in and we can help you explore relevant organizations.
          </p>   
          <button onClick={scrollToOrgs} className={styles.involvementBtn}>
            Explore Organizations →
          </button>
        </div>
      </div>


      {/* 7. PARTNER WITH US SECTION */}
      <section className={styles.partnerSection} aria-label="Are You an Organization">
        <div className={styles.container}>
          <h2 className={styles.partnerTitle}>Are You an Organization?</h2>
          <p className={styles.partnerText}>
            If your organization works in animal welfare, rural development, sustainability, community development or related areas, you can connect with Panchgavya Se Panchparivartan.
          </p>
          <Link to="/contact" className={styles.partnerBtn}>
            Partner With Us →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NgoInitiative;
