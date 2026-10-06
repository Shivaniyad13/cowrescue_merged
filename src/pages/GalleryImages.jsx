import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./GalleryImages.module.css";

// [moved-to-cloudinary] import imgPanchgavyaDay from "../assets/images/3rd National Panchgavya Day Celebration (1).png";
// [moved-to-cloudinary] import imgCow1 from "../assets/images/cow1.jpg";
// [moved-to-cloudinary] import imgCow6 from "../assets/images/cow6.jpg";
// [moved-to-cloudinary] import imgCow7 from "../assets/images/cow7.jpg";
// [moved-to-cloudinary] import imgCow8 from "../assets/images/cow8.jpg";
// [moved-to-cloudinary] import imgCow9 from "../assets/images/cow9.jpg";
// [moved-to-cloudinary] import imgGovigyan from "../assets/images/govigyan.jpg";
// [moved-to-cloudinary] import imgWhatsapp from "../assets/images/WhatsApp Image 2025-08-05 at 18.30.11 (1).jpeg";

// ─── Cloudinary assets ───
import cloudinaryAssets from '../cloudinary.js';
const imgPanchgavyaDay = cloudinaryAssets["images/3rd National Panchgavya Day Celebration (1).png"];
const imgCow1 = cloudinaryAssets["images/cow1.jpg"];
const imgCow6 = cloudinaryAssets["images/cow6.jpg"];
const imgCow7 = cloudinaryAssets["images/cow7.jpg"];
const imgCow8 = cloudinaryAssets["images/cow8.jpg"];
const imgCow9 = cloudinaryAssets["images/cow9.jpg"];
const imgGovigyan = cloudinaryAssets["images/govigyan.jpg"];
const imgWhatsapp = cloudinaryAssets["images/WhatsApp Image 2025-08-05 at 18.30.11 (1).jpeg"];

const GalleryImages = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryData = [
    { id: 1, src: imgPanchgavyaDay, title: "3rd National Panchgavya Day Celebration", category: "Events" },
    { id: 2, src: imgCow1, title: "Indigenous Cattle Conservation", category: "Cow Care" },
    { id: 3, src: imgGovigyan, title: "Scientific Research & Training Workshop", category: "Awareness" },
    { id: 4, src: imgCow6, title: "Community Pasture & Animal Welfare", category: "Community" },
    { id: 5, src: imgCow7, title: "Organic Soil Restoration Campaign", category: "Campaigns" },
    { id: 6, src: imgWhatsapp, title: "Farmer Field Awareness Gathering", category: "Events" },
    { id: 7, src: imgCow8, title: "Bio-Resource Utilization Training", category: "Awareness" },
    { id: 8, src: imgCow9, title: "Model Gaushala Management", category: "Community" },
  ];

  const categories = ["All", "Events", "Community", "Awareness", "Campaigns", "Cow Care"];

  const filteredItems =
    activeCategory === "All"
      ? galleryData
      : galleryData.filter((item) => item.category === activeCategory);

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
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.heroSection}>
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

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredItems.length > 0 ? (
            <div className={styles.uniformGrid}>
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={styles.galleryCard}
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className={styles.imgItem}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-text-light)" }}>
              More stories and moments will be added soon.
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className={styles.lightboxModal} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeLightbox}>
              ✕
            </button>
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>
              ❮
            </button>
            <div className={styles.lightboxImgWrapper}>
              <img
                src={filteredItems[lightboxIndex].src}
                alt={filteredItems[lightboxIndex].title}
                className={styles.lightboxImg}
              />
            </div>
            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>
              ❯
            </button>
            <div className={styles.lightboxMeta}>
              <div className={styles.lightboxText}>
                <h3 className={styles.lightboxTitle}>
                  {filteredItems[lightboxIndex].title}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className={styles.footerCtaSection}>
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