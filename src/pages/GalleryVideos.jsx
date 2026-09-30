import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GalleryVideos.module.css';

// Local featured video
import bgVideo from '../assets/videos/WhatsApp Video 2026-08-10 at 11.44.52 AM.mp4';

const GalleryVideos = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ==========================================
  // CONVERT YOUTUBE LINK TO EMBED LINK
  // NO AUTOPLAY
  // ==========================================
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      // Normal YouTube URL
      // https://www.youtube.com/watch?v=VIDEO_ID
      if (
        parsedUrl.hostname.includes('youtube.com') &&
        parsedUrl.searchParams.get('v')
      ) {
        const videoId = parsedUrl.searchParams.get('v');

        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }

      // Short YouTube URL
      // https://youtu.be/VIDEO_ID
      if (parsedUrl.hostname.includes('youtu.be')) {
        const videoId = parsedUrl.pathname.split('/')[1];

        return `https://www.youtube.com/embed/${videoId}?rel=0`;
      }

      // Already an embed URL
      if (parsedUrl.pathname.includes('/embed/')) {
        return url;
      }

      return null;
    } catch {
      return null;
    }
  };

  // ==========================================
  // CONVERT INSTAGRAM REEL/POST TO EMBED LINK
  // ==========================================
  const getInstagramEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      if (!parsedUrl.hostname.includes('instagram.com')) {
        return null;
      }

      const cleanUrl = url.split('?')[0].replace(/\/$/, '');

      return `${cleanUrl}/embed`;
    } catch {
      return null;
    }
  };

  // ==========================================
  // VIDEO LIST
  // ADD YOUR LINKS HERE
  // ==========================================
  const videoList = [
    {
      id: 1,
      category: 'Cow Care',
      videoUrl:
        'https://www.instagram.com/reel/DPqrZYsEh_q/?utm_source=ig_web_button_share_sheet&igsi=MzRlODBiNWFlZA==',
      videoType: 'instagram'
    },

    {
      id: 2,
      category: 'Awareness',
      videoUrl:
        'https://www.youtube.com/watch?v=qlUMWF74nOg',
      videoType: 'youtube'
    },

    {
      id: 3,
      category: 'Community',
      videoUrl:
        'https://www.youtube.com/watch?v=hSM1NXnjF_A',
      videoType: 'youtube'
    },

    {
      id: 4,
      category: 'Events',
      videoUrl: bgVideo,
      videoType: 'local'
    },

    {
      id: 5,
      category: 'Campaigns',
      videoUrl: bgVideo,
      videoType: 'local'
    }
  ];

  // ==========================================
  // CATEGORIES
  // ==========================================
  const categories = [
    'All',
    'Events',
    'Awareness',
    'Community',
    'Cow Care',
    'Campaigns'
  ];

  // ==========================================
  // FILTER VIDEOS
  // ==========================================
  const filteredVideos =
    activeCategory === 'All'
      ? videoList
      : videoList.filter(
          (vid) => vid.category === activeCategory
        );

  // ==========================================
  // VIDEO PREVIEW FOR CARDS
  // IMPORTANT: NOTHING AUTOPLAYS
  // ==========================================
  const renderVideoPreview = (vid) => {
    // YOUTUBE
    if (vid.videoType === 'youtube') {
      return (
        <iframe
          src={getYoutubeEmbedUrl(vid.videoUrl)}
          title={`Video ${vid.id}`}
          className={styles.cardVideo}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // INSTAGRAM
    if (vid.videoType === 'instagram') {
      return (
        <iframe
          src={getInstagramEmbedUrl(vid.videoUrl)}
          title={`Instagram Video ${vid.id}`}
          className={styles.cardVideo}
          allowFullScreen
          scrolling="no"
        />
      );
    }

    // LOCAL VIDEO
    return (
      <video
        className={styles.cardVideo}
        muted
        playsInline
        preload="metadata"
      >
        <source
          src={vid.videoUrl}
          type="video/mp4"
        />

        Your browser does not support video playback.
      </video>
    );
  };

  return (
    <div className={styles.pageWrapper}>

      {/* =====================================
          HERO SECTION
      ===================================== */}
      <section
        className={styles.heroSection}
        aria-label="Videos Gallery Hero"
      >
        <div className={styles.container}>
          <div className={styles.heroBadge}>
            <span>🎬</span>
            Video Documentaries & Media
          </div>

          <h1 className={styles.heroTitle}>
            Stories in Motion
          </h1>

          <p className={styles.heroSubhead}>
            Watch moments, activities and stories from
            Panchgavya Se Panchparivartan.
          </p>
        </div>
      </section>

      {/* =====================================
          FEATURED VIDEO
      ===================================== */}
      <section
        className={styles.featuredSection}
        aria-label="Featured Video"
      >
        <div className={styles.container}>
          <div className={styles.featuredCard}>

            <div className={styles.featuredVideoWrapper}>
              <video
                className={styles.featuredVideo}
                controls
                muted
                playsInline
                preload="metadata"
              >
                <source
                  src={bgVideo}
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            </div>

            <div className={styles.featuredContent}>
              <span className={styles.featuredTag}>
                Featured Moment
              </span>

              <h2 className={styles.featuredTitle}>
                Panchgavya Se Panchparivartan Overview
              </h2>

              <p className={styles.featuredDesc}>
                Discover the foundational spirit of indigenous
                cattle care, bio-resource utilization, and
                rural transformation across India.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          VIDEO CARDS GRID
      ===================================== */}
      <section
        className={styles.section}
        aria-label="Explore Video Library"
      >
        <div className={styles.container}>

          {/* CATEGORY FILTER */}
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`
                  ${styles.filterBtn}
                  ${
                    activeCategory === cat
                      ? styles.filterBtnActive
                      : ''
                  }
                `}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* VIDEO GRID */}
          {filteredVideos.length > 0 ? (
            <div className={styles.videosGrid}>

              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  className={styles.videoCard}
                  onClick={() => setSelectedVideo(vid)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' ||
                      e.key === ' '
                    ) {
                      setSelectedVideo(vid);
                    }
                  }}
                >
                  {/* VIDEO PREVIEW ONLY */}
                  <div className={styles.videoPreview}>
                    {renderVideoPreview(vid)}

                    {/* PLAY BUTTON */}
                    <div className={styles.playOverlay}>
                      <div className={styles.playBtnIcon}>
                        ▶
                      </div>
                    </div>
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className={styles.emptyState}>
              More stories and moments will be added soon.
            </div>
          )}

        </div>
      </section>

      {/* =====================================
          VIDEO MODAL
      ===================================== */}
      {selectedVideo && (
        <div
          className={styles.videoModal}
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className={styles.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}
            <button
              className={styles.closeModalBtn}
              onClick={() => setSelectedVideo(null)}
              aria-label="Close Video Modal"
            >
              ✕
            </button>

            {/* YOUTUBE VIDEO */}
            {selectedVideo.videoType === 'youtube' && (
              <iframe
                className={styles.modalVideo}
                src={getYoutubeEmbedUrl(
                  selectedVideo.videoUrl
                )}
                title="YouTube Video"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* INSTAGRAM VIDEO */}
            {selectedVideo.videoType === 'instagram' && (
              <iframe
                className={styles.instagramModal}
                src={getInstagramEmbedUrl(
                  selectedVideo.videoUrl
                )}
                title="Instagram Video"
                allowFullScreen
                scrolling="no"
              />
            )}

            {/* LOCAL MP4 VIDEO */}
            {selectedVideo.videoType === 'local' && (
              <video
                className={styles.modalVideo}
                controls
                playsInline
                preload="metadata"
              >
                <source
                  src={selectedVideo.videoUrl}
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>
            )}

          </div>
        </div>
      )}

      {/* =====================================
          FOOTER CTA
      ===================================== */}
      <section
        className={styles.footerCtaSection}
        aria-label="Explore Images"
      >
        <div className={styles.container}>

          <h2 className={styles.footerCtaTitle}>
            See more moments from our events
          </h2>

          <Link
            to="/gallery/images"
            className={styles.ctaBtn}
          >
            Explore Images →
          </Link>

        </div>
      </section>

    </div>
  );
};

export default GalleryVideos;