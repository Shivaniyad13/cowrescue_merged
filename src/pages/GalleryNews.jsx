import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./GalleryNews.module.css";
import { getPublicNews } from "../services/api";

const GalleryNews = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Fetch news from API ───
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPublicNews();
      if (res.data) {
        setArticles(res.data.articles || []);
        setCategories(res.data.categories || ["All"]);
      }
    } catch (err) {
      setError(err.message || "Failed to load news");
    } finally {
      setLoading(false);
    }
  };

  const filteredNews =
    activeCategory === "All"
      ? articles
      : articles.filter((item) => item.category === activeCategory);

  const openArticle = (item) => setActiveArticle(item);
  const closeArticle = () => setActiveArticle(null);

  // Get featured articles (latest 3) for "Our Latest Moments"
  const latestMoments = articles.slice(0, 3);

  return (
    <div className={styles.pageWrapper}>
      {/* HERO */}
      <section className={styles.heroSection} aria-label="News Hero">
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span>📰</span> Information & Community Updates
          </div>
          <h1 className={styles.heroTitle}>Gau Seva & Community News</h1>
          <p className={styles.heroSubhead}>
            Stay updated with stories, initiatives and developments connected with
            Gau Mata, rural communities, sustainable practices and Panchgavya.
          </p>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🔄</div>
              Loading news...
            </div>
          </div>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#991b1b",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
              }}
            >
              ⚠️ {error}
              <div style={{ marginTop: "16px" }}>
                <button
                  onClick={fetchNews}
                  style={{
                    padding: "10px 20px",
                    background: "#991b1b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NEWS GRID */}
      {!loading && !error && (
        <section className={styles.section} aria-label="News Articles Grid">
          <div className={styles.container}>
            {/* Category Filter */}
            <div className={styles.filterBar}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterBtn} ${
                    activeCategory === cat ? styles.filterBtnActive : ""
                  }`}
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
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className={styles.newsImg}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "200px",
                            background: "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                          }}
                        >
                          📰
                        </div>
                      )}
                    </div>
                    <div className={styles.newsBody}>
                      <div className={styles.newsMetaRow}>
                        <span className={styles.newsCategoryTag}>{item.category}</span>
                        <span className={styles.newsDate}>{item.date}</span>
                      </div>
                      <h3 className={styles.newsHeadline}>{item.title}</h3>
                      <p className={styles.newsSummary}>{item.summary}</p>
                      {item.source_name && (
                        <div className={styles.sourceAttribution}>
                          Source: {item.source_name}
                        </div>
                      )}
                      <button
                        className={styles.readMoreBtn}
                        onClick={() => openArticle(item)}
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 0",
                  color: "var(--color-text-light)",
                }}
              >
                {activeCategory === "All"
                  ? "No news available yet."
                  : `No articles in "${activeCategory}" category.`}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className={styles.articleModal} onClick={closeArticle}>
          <div className={styles.articleContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.articleCloseBtn}
              onClick={closeArticle}
              aria-label="Close Article"
            >
              ✕
            </button>
            <div className={styles.articleMetaHeader}>
              <span className={styles.newsCategoryTag}>{activeArticle.category}</span>
              <span className={styles.newsDate}>{activeArticle.date}</span>
            </div>
            <h2 className={styles.articleTitle}>{activeArticle.title}</h2>
            {activeArticle.image_url && (
              <img
                src={activeArticle.image_url}
                alt={activeArticle.title}
                className={styles.articleFeaturedImg}
              />
            )}
            <p className={styles.articleBodyText}>{activeArticle.full_content}</p>
            {activeArticle.source_name && (
              <div className={styles.articleSourceBox}>
                <p className={styles.articleSourceText}>
                  <strong>Verified Source:</strong> {activeArticle.source_name}
                  {activeArticle.source_url && (
                    <>
                      {" — "}
                      <a
                        href={activeArticle.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.articleSourceLink}
                      >
                        Read Original Source →
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
            <button className={styles.backBtn} onClick={closeArticle}>
              ← Back to News
            </button>
          </div>
        </div>
      )}

      {/* OUR LATEST MOMENTS */}
      {!loading && latestMoments.length > 0 && (
        <section className={styles.momentsSection} aria-label="Our Latest Moments">
          <div className={styles.container}>
            <div className={styles.momentsHeader}>
              <h2 className={styles.momentsTitle}>Our Latest Moments</h2>
              <p className={styles.momentsSubtitle}>
                Recent photographs and event media documenting our community activities.
              </p>
            </div>
            <div className={styles.momentsGrid}>
              {latestMoments.map((item) =>
                item.image_url ? (
                  <div key={item.id} className={styles.momentCard}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className={styles.momentImg}
                    />
                    <div className={styles.momentMeta}>
                      <h3 className={styles.momentTitle}>{item.title}</h3>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CROSS-NAVIGATION */}
      <section className={styles.footerCtaSection} aria-label="View Gallery">
        <div className={styles.container}>
          <h2 className={styles.footerCtaTitle}>
            See what happened at our recent events
          </h2>
          <Link to="/gallery/images" className={styles.ctaBtn}>
            View Gallery →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GalleryNews;