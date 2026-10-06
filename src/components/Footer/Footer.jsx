import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
// [moved-to-cloudinary] import logo from "../../assets/logos/logo.png";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaArrowRight,
  FaHeart,
  FaHandsHelping,
} from 'react-icons/fa';

// ─── Cloudinary assets ───
import cloudinaryAssets from '../../cloudinary.js';
const logo = cloudinaryAssets["logos/logo.png"];

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footer}>

      <div className={styles.container}>

        {/* Brand */}
        <div className={styles.brand}>
          <img
            src={logo}
            alt="Panchgavya Se Panchparivartan Logo"
            className={styles.logo}
          />

          <h3 className={styles.brandName}>
            Panchgavya Se Panchparivartan
          </h3>

          <p className={styles.brandDesc}>
            Promoting sustainable living, rural empowerment, and holistic
            well-being through traditional Indian knowledge.
          </p>

          <div className={styles.impactTag}>
            <span>🌿</span>
            Building a sustainable future together
          </div>
        </div>


        {/* Quick Links */}
        <div className={styles.linksGroup}>
          <h4>Quick Links</h4>

          <ul>
            <li>
              <Link to="/" onClick={scrollToTop}>Home</Link>
            </li>

            <li>
              <Link to="/about" onClick={scrollToTop}>About</Link>
            </li>

            <li>
              <Link to="/donation" onClick={scrollToTop}>Support US</Link>
            </li>
          </ul>
        </div>


        {/* Initiative */}
        <div className={styles.linksGroup}>
          <h4>Initiative</h4>

          <ul>
            <li>
              <Link to="/initiative/government" onClick={scrollToTop}>
                Government
              </Link>
            </li>

            <li>
              <Link to="/initiative/ngo" onClick={scrollToTop}>
                NGO
              </Link>
            </li>

            <li>
              <Link to="/initiative/cbo" onClick={scrollToTop}>
                CBO
              </Link>
            </li>
          </ul>
        </div>


        {/* Consultation */}
        <div className={styles.linksGroup}>
          <h4>Consultation</h4>

          <ul>
            <li>
              <Link
                to="/consultation/policies"
                onClick={scrollToTop}
              >
                Policies
              </Link>
            </li>

            <li>
              <Link
                to="/consultation/project-protection"
                onClick={scrollToTop}
              >
                Project & Protection
              </Link>
            </li>
          </ul>
        </div>


        {/* Gallery */}
        <div className={styles.linksGroup}>
          <h4>Gallery</h4>

          <ul>
            <li>
              <Link to="/gallery/news" onClick={scrollToTop}>
                News
              </Link>
            </li>

            <li>
              <Link to="/gallery/images" onClick={scrollToTop}>
                Images
              </Link>
            </li>

            <li>
              <Link to="/gallery/videos" onClick={scrollToTop}>
                Videos
              </Link>
            </li>
          </ul>
        </div>


        {/* Policies */}
        <div className={styles.linksGroup}>
          <h4>Policies</h4>

          <ul>
            <li>
              <Link to="/privacy-policy" onClick={scrollToTop}>
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms-conditions" onClick={scrollToTop}>
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link to="/refund-cancellation-policy" onClick={scrollToTop}>
                Refund & Cancellation Policy
              </Link>
            </li>

            <li>
              <Link to="/donation-fund-flow-policy" onClick={scrollToTop}>
                Donation & Fund Flow Policy
              </Link>
            </li>

            <li>
              <Link to="/shipping-delivery-policy" onClick={scrollToTop}>
                Shipping / Delivery Policy
              </Link>
            </li>
          </ul>
        </div>


        {/* Connect */}
        <div className={styles.connectSection}>
          <h4>Connect With Us</h4>

          <div className={styles.contactInfo}>

            <p className={styles.orgAddressFooter}>
              📍 <strong>KHUSHI CENTRE FOR REHABILITATION AND RESEARCH</strong><br />
              65/4/2, Sant Kirandass Ashram, Jaunti, Kanjhawala–Qutubgarh Road, New Delhi – 110081, India
            </p>

            <a href="admin@khushicentre.in">
              📧 admin@khushicentre.in
            </a>

            <a href="mailto:khushicentre@gmail.com">
              📧 khushicentre@gmail.com
            </a>

            <a href="tel:+919350206124">
              📞 +91 9350206124
            </a>

          </div>

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


        {/* Modern CTA - fills empty space */}
        <div className={styles.ctaSection}>

          <div className={styles.ctaIcon}>
            <FaHeart />
          </div>

          <div className={styles.ctaContent}>
            <span className={styles.ctaLabel}>
              MAKE AN IMPACT
            </span>

            <h3>
              Be Part of the Change
            </h3>

            <p>
              Join us in creating meaningful change through sustainable
              initiatives, rural empowerment, and community support.
            </p>

            <div className={styles.ctaButtons}>

              <Link
                to="/donation"
                onClick={scrollToTop}
                className={styles.donateButton}
              >
                <FaHeart />
                Support Us 
                <FaArrowRight />
              </Link>

              <Link
                to="/contact"
                onClick={scrollToTop}
                className={styles.partnerButton}
              >
                <FaHandsHelping />
                Partner With Us
              </Link>

            </div>
          </div>

        </div>

      </div>


      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>

          <p>
            © {new Date().getFullYear()} Panchgavya Se Panchparivartan.
            All rights reserved.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;