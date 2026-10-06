import React, { useState, useEffect, useRef } from 'react';
// [moved-to-cloudinary] import slokVideo from '../../assets/videos/slok.mp4';
import styles from './SlokVideoPopup.module.css';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const slokVideo = cloudinaryAssets["videos/slok.mp4"];

const POPUP_DELAY_MS = 4000;
const SESSION_KEY = 'slok_video_dismissed';

const SlokVideoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showEnableSound, setShowEnableSound] = useState(true);

  const videoRef = useRef(null);

  // =========================================================
  // SHOW VIDEO AFTER 4 SECONDS
  // =========================================================

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY);

    if (dismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // AUTO PLAY VIDEO
  // Start muted so autoplay works on Desktop + Mobile
  // =========================================================

  useEffect(() => {
    if (!isVisible) return;

    const video = videoRef.current;

    if (!video) return;

    const startVideo = async () => {
      try {
        // Start muted for guaranteed autoplay
        video.muted = true;
        video.volume = 1;

        await video.play();

        setIsMuted(true);
        setIsPlaying(true);
        setShowEnableSound(true);
      } catch (error) {
        console.error('Video autoplay failed:', error);

        setIsPlaying(false);
      }
    };

    startVideo();
  }, [isVisible]);

  // =========================================================
  // ENABLE SOUND BUTTON
  // =========================================================

  const handleEnableSound = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      video.muted = false;
      video.volume = 1;

      await video.play();

      setIsMuted(false);
      setIsPlaying(true);
      setShowEnableSound(false);
    } catch (error) {
      console.error('Unable to enable sound:', error);
    }
  };

  // =========================================================
  // PLAY VIDEO
  // =========================================================

  const playVideo = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Unable to play video:', error);
    }
  };

  // =========================================================
  // PLAY / PAUSE
  // =========================================================

  const togglePlayPause = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      await playVideo();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // =========================================================
  // MUTE / UNMUTE
  // =========================================================

  const toggleMute = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (video.muted) {
        video.muted = false;
        video.volume = 1;

        await video.play();

        setIsMuted(false);
        setIsPlaying(true);
        setShowEnableSound(false);
      } else {
        video.muted = true;

        setIsMuted(true);
        setShowEnableSound(true);
      }
    } catch (error) {
      console.error('Unable to change audio:', error);
    }
  };

  // =========================================================
  // CLOSE VIDEO
  // =========================================================

  const handleClose = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    setIsPlaying(false);
    setIsVisible(false);

    sessionStorage.setItem(
      SESSION_KEY,
      'true'
    );
  };

  // =========================================================
  // ICONS
  // =========================================================

  const PlayIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4l-4z" />
    </svg>
  );

  const VolumeIcon = () => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );

  const VolumeMuteIcon = () => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );

  const CloseIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  // =========================================================
  // DON'T RENDER UNTIL VISIBLE
  // =========================================================

  if (!isVisible) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className={styles.container}>
      <div
        className={styles.fullScreenVideo}
        role="dialog"
        aria-label="Mangal Slok Video"
        aria-modal="true"
      >
        {/* VIDEO */}
        <video
          ref={videoRef}
          className={styles.videoElement}
          src={slokVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          controls={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleClose}
        />

        {/* ENABLE SOUND BUTTON */}
        {showEnableSound && isMuted && (
          <div className={styles.soundOverlay}>
            <button
              type="button"
              className={styles.soundBtn}
              onClick={handleEnableSound}
              aria-label="Enable sound"
            >
              <VolumeIcon />
              <span>Enable Sound</span>
            </button>
          </div>
        )}

        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.title}>
            <span className={styles.omIcon}>🕉</span>

            <span>Mangal Slok</span>
          </div>

          <button
            type="button"
            className={styles.topCloseBtn}
            onClick={handleClose}
            aria-label="Close Mangal Slok"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className={styles.bottomControls}>
          <div className={styles.controlsInner}>

            {/* PLAY / PAUSE */}
            <button
              type="button"
              className={styles.controlBtn}
              onClick={togglePlayPause}
              aria-label={
                isPlaying
                  ? 'Pause video'
                  : 'Play video'
              }
              title={
                isPlaying
                  ? 'Pause'
                  : 'Play'
              }
            >
              {isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            {/* MUTE / UNMUTE */}
            <button
              type="button"
              className={styles.controlBtn}
              onClick={toggleMute}
              aria-label={
                isMuted
                  ? 'Unmute audio'
                  : 'Mute audio'
              }
              title={
                isMuted
                  ? 'Unmute'
                  : 'Mute'
              }
            >
              {isMuted ? (
                <VolumeMuteIcon />
              ) : (
                <VolumeIcon />
              )}
            </button>

            {/* CLOSE */}
            <button
              type="button"
              className={`${styles.controlBtn} ${styles.closeControlBtn}`}
              onClick={handleClose}
              aria-label="Close video"
              title="Close"
            >
              <CloseIcon />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SlokVideoPopup;