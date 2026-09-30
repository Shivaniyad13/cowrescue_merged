import { useEffect } from 'react';
import styles from './LegalPage.module.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <header className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <span className={styles.badge}>Official Legal Policy</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last Updated: August 31, 2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          Panchgavya Se Panchparivartan respects the privacy of its users. This Privacy Policy explains how information may be collected, used, stored and protected when users access the website, register for services, submit information, support campaigns, make contributions or interact with the platform.
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Introduction</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Panchgavya Se Panchparivartan ("Platform") is dedicated to promoting cow welfare, rural development, and community support initiatives. We are committed to safeguarding the personal data and privacy of our visitors, donors, volunteers, and participating organizations.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Information We May Collect</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Information may include:</p>
              <ul className={styles.list}>
                <li>Name</li>
                <li>Email address</li>
                <li>Mobile number</li>
                <li>Address where voluntarily provided</li>
                <li>Account or registration information</li>
                <li>Campaign or NGO interaction information</li>
                <li>Donation or contribution details</li>
                <li>Transaction references or payment status</li>
                <li>Technical information such as device, browser and IP-related information where collected through website services</li>
              </ul>
              <div className={styles.highlightBox}>
                <h4>🔒 Payment Credential Security</h4>
                <p>
                  Sensitive payment credentials such as card numbers or UPI credentials should not be stored by the platform unless specifically handled by the authorized payment provider according to applicable requirements.
                </p>
              </div>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>How Information May Be Used</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Information may be used to:</p>
              <ul className={styles.list}>
                <li>Provide platform services</li>
                <li>Process registrations and requests</li>
                <li>Facilitate campaign participation</li>
                <li>Facilitate contributions and payments</li>
                <li>Communicate transaction or service information</li>
                <li>Improve website functionality</li>
                <li>Maintain security and prevent misuse</li>
                <li>Comply with applicable legal obligations</li>
              </ul>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Payment Information</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Payments may be processed through authorized third-party payment gateways.
              </p>
              <p>
                The platform does not intentionally store sensitive payment credentials such as complete card details or UPI PINs.
              </p>
              <p>
                Users should review the relevant payment gateway's policies where applicable.
              </p>
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Information Sharing</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Information may be shared where necessary with:</p>
              <ul className={styles.list}>
                <li>Authorized service providers</li>
                <li>Payment service providers</li>
                <li>Registered organizations or beneficiaries where necessary for service fulfilment</li>
                <li>Government or regulatory authorities when legally required</li>
              </ul>
              <p>
                Personal information should not be sold for unrelated commercial purposes.
              </p>
            </div>
          </article>

          {/* Section 6 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Data Security</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Reasonable administrative and technical measures are used to protect information. However, no internet transmission or electronic storage system can be guaranteed to be completely secure.
              </p>
            </div>
          </article>

          {/* Section 7 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>User Choices</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Users may contact the platform regarding correction or update of information, subject to applicable legal and operational requirements.
              </p>
            </div>
          </article>

          {/* Section 8 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>8</span>
              <h2 className={styles.sectionTitle}>Third Party Links</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The website may contain links to third-party websites. The platform is not responsible for the privacy practices or content of external websites.
              </p>
            </div>
          </article>

          {/* Section 9 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>9</span>
              <h2 className={styles.sectionTitle}>Policy Updates</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                This Privacy Policy may be updated from time to time. Updated versions will be posted on this page.
              </p>
            </div>
          </article>

          {/* Section 10 / Contact */}
          <div className={styles.contactBox}>
            <h3>10. Contact Us</h3>
            <p>
              For privacy-related questions or data inquiries, users may contact the organization using the official details below:
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

export default PrivacyPolicy;
