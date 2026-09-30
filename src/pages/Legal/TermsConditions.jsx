import { useEffect } from 'react';
import styles from './LegalPage.module.css';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <header className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <span className={styles.badge}>Official Legal Policy</span>
          <h1 className={styles.heroTitle}>Terms & Conditions</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last Updated: August 31, 2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          Welcome to Panchgavya Se Panchparivartan. Please read these Terms & Conditions carefully before using our platform, accessing services, participating in campaigns, or making contributions.
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                By accessing or using Panchgavya Se Panchparivartan, users agree to comply with these Terms and Conditions.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Platform Purpose</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>The platform supports initiatives including:</p>
              <ul className={styles.list}>
                <li>Cow rescue</li>
                <li>Animal welfare</li>
                <li>Community initiatives</li>
                <li>Rural and social development</li>
                <li>Support for registered NGOs and organizations</li>
                <li>Campaign participation</li>
              </ul>
              <p>
                The platform may facilitate communication, registration, campaign discovery and payment-related services.
              </p>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>User Responsibilities</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Users must:</p>
              <ul className={styles.list}>
                <li>Provide accurate information</li>
                <li>Use the platform lawfully</li>
                <li>Not submit fraudulent information</li>
                <li>Not misuse payment facilities</li>
                <li>Not impersonate another person or organization</li>
                <li>Not attempt to disrupt website security or services</li>
              </ul>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Contributions and Payments</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Users may make payments or contributions through available payment options.
              </p>
              <p>
                Before payment confirmation, applicable amounts and charges should be disclosed where technically applicable.
              </p>
              <div className={styles.highlightBox}>
                <h4>💳 Payment Component Disclosure</h4>
                <p>A payment may include:</p>
                <ul className={styles.list} style={{ margin: '8px 0 0 0' }}>
                  <li>Contribution amount</li>
                  <li>Donation/support amount</li>
                  <li>Applicable platform/service fee</li>
                  <li>Other clearly disclosed charges, if applicable</li>
                </ul>
              </div>
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Platform Role</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The platform provides technology and facilitation services.
              </p>
              <p>
                The platform is not a bank or financial institution.
              </p>
              <p>
                Payment processing is handled through authorized payment service providers.
              </p>
            </div>
          </article>

          {/* Section 6 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Registered Organizations</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Organizations listed or registered on the platform may be subject to verification, documentation and applicable platform requirements.
              </p>
              <p>
                Listing or participation does not automatically guarantee any particular funding amount.
              </p>
            </div>
          </article>

          {/* Section 7 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>Intellectual Property</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Website content, branding, graphics and materials may not be copied or used without appropriate authorization except where permitted by law.
              </p>
            </div>
          </article>

          {/* Section 8 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>8</span>
              <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The platform will make reasonable efforts to provide reliable services but cannot guarantee uninterrupted or error-free availability at all times.
              </p>
            </div>
          </article>

          {/* Section 9 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>9</span>
              <h2 className={styles.sectionTitle}>Modification of Services</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The platform may update features, services, policies or website functionality when necessary.
              </p>
            </div>
          </article>

          {/* Section 10 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>10</span>
              <h2 className={styles.sectionTitle}>Governing Law</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                These terms shall be governed by applicable laws of India.
              </p>
            </div>
          </article>

          {/* Section 11 / Contact */}
          <div className={styles.contactBox}>
            <h3>11. Contact Us</h3>
            <p>
              Questions regarding these Terms may be directed through the official contact information available below:
            </p>
            <div className={styles.officialAddressBlock}>
              <strong>Official Contact Address:</strong><br />
              KHUSHI CENTRE FOR REHABILITATION AND RESEARCH<br />
              65/4/2, Sant Kirandass Ashram,<br />
              Jaunti, Kanjhawala–Qutubgarh Road,<br />
              New Delhi – 110081, India
            </div>
            <div className={styles.contactInfoRow}>
              <a href="mailto:info@khushicentre.in" className={styles.contactLink}>
                📧 info@khushicentre.in
              </a>
              <a href="mailto:khushicentre@gmail.com" className={styles.contactLink}>
                📧 khushicentre@gmail.com
              </a>
              <a href="tel:+919350206124" className={styles.contactLink}>
                📞 +91 9350206124
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
