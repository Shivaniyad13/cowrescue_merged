import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919868780980"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <span className={styles.pulseRing}></span>
      <FaWhatsapp className={styles.whatsappIcon} />
      <span className={styles.tooltip}>Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
