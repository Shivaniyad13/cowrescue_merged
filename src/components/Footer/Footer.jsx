import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const logo = cloudinaryAssets["logos/logo.png"];

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const addressQuery = encodeURIComponent(
    "65/4/2, Sant Kirandass Ashram, Jaunti, Kanjhawala-Qutubgarh Road, New Delhi 110081, India"
  );

  return (
    <footer className={styles.footer}>

      <div className={styles.container}>

        {/* ═══════ COLUMN 1: BRAND ═══════ */}
        <div className={styles.brandCol}>
          <div className={styles.brandHeader}>
            <img src={logo} alt="Logo" className={styles.logo} />
            <h3 className={styles.brandName}>Panchgavya Se Panchparivartan</h3>
          </div>

          <p className={styles.brandDesc}>
            Promoting sustainable living, rural empowerment, and holistic
            well-being through traditional Indian knowledge.
          </p>

          <h4 className={styles.followTitle}>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com/KhushiCentreForRehabilitationResearch/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/khushicentre2008/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/@KhushiCentre"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.linkedin.com/in/khushi-centre-a63981379/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>


        {/* ═══════ COLUMN 2: QUICK LINKS ═══════ */}
        <div className={styles.linksCol}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.linksList}>
            <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
            <li><Link to="/about" onClick={scrollToTop}>About</Link></li>
            <li><Link to="/donation" onClick={scrollToTop}>Support Us</Link></li>
            {/* <li>
              <Link to="/privacy-policy" onClick={scrollToTop}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions" onClick={scrollToTop}>
                Terms &amp; Conditions
              </Link>
            </li> */}
          </ul>
        </div>


        {/* ═══════ COLUMN 3: LOCATION + CONTACT ═══════ */}
        <div className={styles.locationCol}>
          <h4 className={styles.colTitle}>Our Location</h4>

          {/* Small Map */}
          <div className={styles.mapBox}>
            <iframe
              title="Location"
              src={`https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          {/* Contact Info */}
          <div className={styles.contactList}>
            <a href="tel:+919350206124" className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>+91 9350206124</span>
            </a>

            <a href="mailto:admin@khushicentre.in" className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>admin@khushicentre.in</span>
            </a>

            <a href="mailto:khushicentre@gmail.com" className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>khushicentre@gmail.com</span>
            </a>

            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>
                KHUSHI CENTRE FOR REHABILITATION AND RESEARCH,<br />
                65/4/2, Sant Kirandass Ashram, Jaunti,<br />
                New Delhi – 110081, India
              </span>
            </div>
          </div>
        </div>

      </div>


      {/* ═══════ BOTTOM BAR ═══════ */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>

          <p className={styles.copyright}>
            © {new Date().getFullYear()} Panchgavya Se Panchparivartan. All rights reserved.
          </p>

          <div className={styles.bottomLinks}>
            <Link to="/privacy-policy" onClick={scrollToTop}>Privacy Policy</Link>
            <Link to="/terms-conditions" onClick={scrollToTop}>Terms of Service</Link>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;