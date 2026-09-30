import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GalleryNews.module.css';

// Project Images
import newsImg1 from '../assets/images/3rd National Panchgavya Day Celebration (1).png';
import newsImg2 from '../assets/images/cow1.jpg';
import newsImg3 from '../assets/images/govigyan.jpg';
const newsImg4 = 'https://jbsa01.blob.core.windows.net/jb-public/article%2Fimages%2Fa44dddd8-4bce-42c7-b709-30e80ef578d1_198XxPo2LLYx_7XFKkgrinqi_DoB62IXH.webp';
const newsImg5 = 'https://biogas-india.com/wp-content/uploads/2020/05/Cow-01.jpg';


import newsImg6 from '../assets/images/OIP.jfif';

const GalleryNews = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState(null);

  const newsItems = [
    {
      id: 1,
      title: '3rd National Panchgavya Day Celebrated with Focus on Rural Bio-Enterprises',
      category: 'Panchgavya',
      date: '05 Aug 2026',
      image: newsImg1,
      summary: 'Researchers, agrarian leaders, and gaushala representatives gathered to highlight scientific advances in cow-based organic agriculture and self-reliant village economics.',
      fullContent: 'The 3rd National Panchgavya Day brought together agricultural scientists, village entrepreneurs, and cattle care advocates across India. Discussions centered around expanding laboratory validation of Panchgavya bio-inputs, strengthening farmer-producer organizations (FPOs), and creating decentralized cottage enterprises for rural women and youth. Speakers emphasized that indigenous cattle breeds form the backbone of regenerative soil carbon management.',
      sourceName: 'Panchparivartan Media & Research Cell',
      sourceUrl: 'https://dahd.nic.in/'
    },
    {
      id: 2,
      title: 'Rashtriya Gokul Mission Expands Indigenous Cattle Conservation Infrastructure',
      category: 'Government Updates',
      date: '28 Jul 2026',
      image: newsImg2,
      summary: 'Government initiatives continue to bolster native cattle gene pools, IVF technology deployment, and breed improvement centers across key agricultural states.',
      fullContent: 'Under the ongoing Rashtriya Gokul Mission, the Department of Animal Husbandry & Dairying has sanctioned new breed conservation centers to safeguard indigenous cattle breeds like Gir, Sahiwal, Kankrej, and Tharparkar. The initiative aims to enhance milk productivity, lower farm operational costs through natural draught animal power, and promote organic manure production for smallholder farmers.',
      sourceName: 'Department of Animal Husbandry & Dairying (Govt. of India)',
      sourceUrl: 'https://dahd.nic.in/schemes/programmes/rashtriya-gokul-mission'
    },
    {
      id: 3,
      title: 'Go Vigyan Anusandhan Kendra Hosts International Workshop on Cow Science',
      category: 'Gaushala',
      date: '14 Jul 2026',
      image: newsImg3,
      summary: 'Pioneering research center in Deolapar, Nagpur shares empirical findings on Panchgavya bio-formulations and sustainable soil health revitalization.',
      fullContent: 'Go Vigyan Anusandhan Kendra hosted an intensive 3-day workshop showcasing laboratory research on Panchgavya applications in agriculture and health. Participants explored how bio-conditioners enhance soil microbial count and earthworm activity without synthetic chemical residues. The center reiterated its commitment to training village youth in cow-based micro-enterprises.',
      sourceName: 'Go Vigyan Anusandhan Kendra, Nagpur',
      sourceUrl: 'https://govigyan.com/en/'
    },
    {
      id: 4,
      title: 'Zero-Budget Natural Farming Adoption Surges Among Smallholder Farmers',
      category: 'Farmers',
      date: '02 Jul 2026',
      image: newsImg4,
      summary: 'Farmers transitioning to cow-dung and urine bio-inputs report lower input costs, improved soil water retention, and chemical-free crop yields.',
      fullContent: 'Agrarian communities across multiple districts are witnessing significant cost savings by replacing commercial fertilizers with locally prepared cow-based bio-enrichers. Field reports demonstrate improved soil resilience during dry spells and better market prices for organic produce in local markets.',
      sourceName: 'National Natural Farming Mission',
      sourceUrl: 'https://research.reading.ac.uk/global-development/understanding-zero-budget-natural-farming-in-andhra-pradesh-emerges-as-a-finalist-in-the-2024-university-of-reading-research-awards-for-interdisciplinary-research/'
    },
    {
      id: 5,
      title: 'Model Gaushala Guidelines Focus on Bio-Energy and Circular Economy',
      category: 'Gau Seva',
      date: '19 Jun 2026',
      image: newsImg5,
      summary: 'Animal welfare bodies publish operational benchmarks for gaushalas to achieve financial self-sustainability through biogas and organic manure.',
      fullContent: 'The Animal Welfare Board of India alongside regional rural development cells released modern operational guidelines encouraging gaushalas to function as self-sustaining bio-resource centers. By integrating biogas generation, vermicomposting, and Panchgavya formulations, gaushalas can generate steady revenue while providing shelter to non-lactating cattle.',
      sourceName: 'Animal Welfare Board of India',
      sourceUrl: 'https://www.worldfertilizer.com/environment/24022026/orsl-secures-large-scale-epc-contract-for-cbg-and-bio-fertilizer-project/'
    },
    {
      id: 6,
      title: 'Rural Employment Models Centered Around Cow Bio-Products Gain Momentum',
      category: 'Rural Development',
      date: '04 Jun 2026',
      image: newsImg6,
      summary: 'Women self-help groups in rural areas launch eco-friendly handcrafted products derived from cow-based bio-materials.',
      fullContent: 'Self-Help Groups (SHGs) across rural districts are discovering new livelihood opportunities through cow-based cottage industries. Products ranging from organic plant nutrients to eco-friendly diyas and pest repellents are finding growing demand in regional and urban markets, establishing a sustainable economic model.',
      sourceName: 'Rural Livelihoods Mission',
      sourceUrl: 'https://nlm.udyamimitra.in/'
    }
  ];

  const categories = ['All', 'Gau Seva', 'Gaushala', 'Panchgavya', 'Farmers', 'Rural Development', 'Government Updates'];

  const filteredNews = activeCategory === 'All'
    ? newsItems
    : newsItems.filter(item => item.category === activeCategory);

  const openArticle = (item) => setActiveArticle(item);
  const closeArticle = () => setActiveArticle(null);

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection} aria-label="News Hero">
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span>📰</span> Information & Community Updates
          </div>
          <h1 className={styles.heroTitle}>Gau Seva & Community News</h1>
          <p className={styles.heroSubhead}>
            Stay updated with stories, initiatives and developments connected with Gau Mata, rural communities, sustainable practices and Panchgavya.
          </p>
        </div>
      </section>

      {/* NEWS GRID & FILTERS */}
      <section className={styles.section} aria-label="News Articles Grid">
        <div className={styles.container}>
          {/* Category Filter */}
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News Cards */}
          {filteredNews.length > 0 ? (
            <div className={styles.newsGrid}>
              {filteredNews.map((item) => (
                <div key={item.id} className={styles.newsCard}>
                  <div className={styles.newsImgWrapper}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.newsImg}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.newsBody}>
                    <div className={styles.newsMetaRow}>
                      <span className={styles.newsCategoryTag}>{item.category}</span>
                      <span className={styles.newsDate}>{item.date}</span>
                    </div>
                    <h3 className={styles.newsHeadline}>{item.title}</h3>
                    <p className={styles.newsSummary}>{item.summary}</p>
                    <div className={styles.sourceAttribution}>
                      Source: {item.sourceName}
                    </div>
                    <button className={styles.readMoreBtn} onClick={() => openArticle(item)}>
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
              More news and updates will be added soon.
            </div>
          )}
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className={styles.articleModal} onClick={closeArticle}>
          <div className={styles.articleContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.articleCloseBtn} onClick={closeArticle} aria-label="Close Article">
              ✕
            </button>
            <div className={styles.articleMetaHeader}>
              <span className={styles.newsCategoryTag}>{activeArticle.category}</span>
              <span className={styles.newsDate}>{activeArticle.date}</span>
            </div>
            <h2 className={styles.articleTitle}>{activeArticle.title}</h2>
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className={styles.articleFeaturedImg}
            />
            <p className={styles.articleBodyText}>{activeArticle.fullContent}</p>
            <div className={styles.articleSourceBox}>
              <p className={styles.articleSourceText}>
                <strong>Verified Source:</strong> {activeArticle.sourceName} —{' '}
                <a
  href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2284949&reg=48&lang=1"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.articleSourceLink}
>
  Read Original Source →
</a>
              </p>
            </div>
            <button className={styles.backBtn} onClick={closeArticle}>
              ← Back to News
            </button>
          </div>
        </div>
      )}

      {/* OUR LATEST MOMENTS (CONNECTING GALLERY PAGES) */}
      <section className={styles.momentsSection} aria-label="Our Latest Moments">
        <div className={styles.container}>
          <div className={styles.momentsHeader}>
            <h2 className={styles.momentsTitle}>Our Latest Moments</h2>
            <p className={styles.momentsSubtitle}>
              Recent photographs and event media documenting our community activities.
            </p>
          </div>
          <div className={styles.momentsGrid}>
            <div className={styles.momentCard}>
              <img src={newsImg1} alt="3rd National Panchgavya Day" className={styles.momentImg} />
              <div className={styles.momentMeta}>
                <h3 className={styles.momentTitle}>3rd National Panchgavya Day</h3>
              </div>
            </div>
            <div className={styles.momentCard}>
              <img src={newsImg2} alt="Indigenous Cattle Care" className={styles.momentImg} />
              <div className={styles.momentMeta}>
                <h3 className={styles.momentTitle}>Indigenous Cattle Breed Protection</h3>
              </div>
            </div>
            <div className={styles.momentCard}>
              <img src={newsImg3} alt="Go Vigyan Science Workshop" className={styles.momentImg} />
              <div className={styles.momentMeta}>
                <h3 className={styles.momentTitle}>Go Vigyan Science Workshop</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CROSS-NAVIGATION */}
      <section className={styles.footerCtaSection} aria-label="View Gallery">
        <div className={styles.container}>
          <h2 className={styles.footerCtaTitle}>See what happened at our recent events</h2>
          <Link to="/gallery/images" className={styles.ctaBtn}>
            View Gallery →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GalleryNews;
