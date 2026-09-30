import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GalleryImages.module.css';

// Project Images
import imgPanchgavyaDay from '../assets/images/3rd National Panchgavya Day Celebration (1).png';
import imgCow1 from '../assets/images/cow1.jpg';
import imgCow6 from '../assets/images/cow6.jpg';
import imgCow7 from '../assets/images/cow7.jpg';
import imgCow8 from '../assets/images/cow8.jpg';
import imgCow9 from '../assets/images/cow9.jpg';
import imgGovigyan from '../assets/images/govigyan.jpg';
import imgKankrej from '../assets/images/Kankrej.jfif';
import imgOip from '../assets/images/OIP.jfif';
import imgWhatsapp from '../assets/images/WhatsApp Image 2025-08-05 at 18.30.11 (1).jpeg';

const GalleryImages = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryData = [
    {
      id: 1,
      src: imgPanchgavyaDay,
      title: '3rd National Panchgavya Day Celebration',
      category: 'Events',
      caption: 'Gathering of researchers, farmers, and delegates celebrating Panchgavya science and rural innovation.',
      isLarge: true
    },
    {
      id: 2,
      src: imgCow1,
      title: 'Indigenous Cattle Conservation',
      category: 'Cow Care',
      caption: 'Promoting the health, breeding, and protection of native Indian cattle breeds.',
      isLarge: false
    },
    {
      id: 3,
      src: imgGovigyan,
      title: 'Scientific Research & Training Workshop',
      category: 'Awareness',
      caption: 'Interactive workshop demonstrating cow-based bio-resource formulations.',
      isLarge: false
    },
    {
      id: 4,
      src: imgCow6,
      title: 'Community Pasture & Animal Welfare',
      category: 'Community',
      caption: 'Local village initiatives ensuring natural grazing and humane cattle care.',
      isLarge: true
    },
    {
      id: 5,
      src: imgCow7,
      title: 'Organic Soil Restoration Campaign',
      category: 'Campaigns',
      caption: 'Educating farmers on Panchgavya bio-fertilizers for long-term soil carbon.',
      isLarge: false
    },
    {
      id: 6,
      title: 'Farmer Field Awareness Gathering',
      src: imgWhatsapp,
      category: 'Events',
      caption: 'Grassroots interaction with agrarian communities sharing sustainable farming methods.',
      isLarge: false
    },
    {
      id: 7,
      src: imgKankrej,
      title: 'Indigenous Breed Showcase',
      category: 'Cow Care',
      caption: 'Highlighting the resilience and agricultural value of indigenous Kankrej cattle.',
      isLarge: false
    },
    {
      id: 8,
      src: imgOip,
      title: 'Sustainable Agriculture Demonstration',
      category: 'Campaigns',
      caption: 'Field demonstration of chemical-free natural farming inputs.',
      isLarge: true
    },
    {
      id: 9,
      src: imgCow8,
      title: 'Bio-Resource Utilization Training',
      category: 'Awareness',
      caption: 'Hands-on training session on natural manure and bio-energy formulation.',
      isLarge: false
    },
    {
      id: 10,
      src: imgCow9,
      title: 'Model Gaushala Management',
      category: 'Community',
      caption: 'Exemplary gaushala practices fostering cattle health and organic byproduct generation.',
      isLarge: false
    }
  ];

  const categories = ['All', 'Events', 'Community', 'Awareness', 'Campaigns', 'Cow Care'];

  const filteredItems = activeCategory === 'All'
    ? galleryData
    : galleryData.filter(item => item.category === activeCategory);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <div className={styles.pageWrapper}>
      {/* HERO SECTION */}
      <section className={styles.heroSection} aria-label="Images Gallery Hero">
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span>📷</span> Visual Heritage & Events
          </div>
          <h1 className={styles.heroTitle}>Moments That Inspire Change</h1>
          <p className={styles.heroSubhead}>
            A glimpse into our events, activities, campaigns and community moments.
          </p>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className={styles.section} aria-label="Photo Gallery">
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

          {/* Gallery Masonry/Editorial Grid */}
          {filteredItems.length > 0 ? (
            <div className={styles.masonryGrid}>
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`${styles.galleryCard} ${item.isLarge ? styles.galleryCardLarge : ''}`}
                  onClick={() => openLightbox(index)}
                >
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.src}
                      alt={item.title}
                      className={styles.imgItem}
                      loading="lazy"
                    />
                    <div className={styles.overlay}>
                      <span className={styles.categoryTag}>{item.category}</span>
                      <h3 className={styles.imgTitle}>{item.title}</h3>
                      <p className={styles.imgCaption}>{item.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
              More stories and moments will be added soon.
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className={styles.lightboxModal} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close Lightbox">
              ✕
            </button>
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage} aria-label="Previous Image">
              ‹
            </button>
            <div className={styles.lightboxImgWrapper}>
              <img
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                className={styles.lightboxImg}
              />
            </div>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage} aria-label="Next Image">
              ›
            </button>
            <div className={styles.lightboxMeta}>
              <div className={styles.lightboxText}>
                <span className={styles.categoryTag}>{filteredItems[lightboxIndex].category}</span>
                <h3 className={styles.lightboxTitle}>{filteredItems[lightboxIndex].title}</h3>
                <p className={styles.lightboxCaption}>{filteredItems[lightboxIndex].caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CROSS-NAVIGATION */}
      <section className={styles.footerCtaSection} aria-label="Explore Videos">
        <div className={styles.container}>
          <h2 className={styles.footerCtaTitle}>Want to see the videos?</h2>
          <Link to="/gallery/videos" className={styles.ctaBtn}>
            Explore Videos →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GalleryImages;
