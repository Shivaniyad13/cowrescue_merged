import { useEffect } from 'react';
import styles from './LegalPage.module.css';

const ShippingDeliveryPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <header className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <span className={styles.badge}>Official Legal Policy</span>
          <h1 className={styles.heroTitle}>Shipping / Delivery Policy</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last Updated: August 31, 2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          This Shipping & Delivery Policy clarifies the digital fulfillment process, electronic acknowledgements, and service delivery mechanisms applicable to Panchgavya Se Panchparivartan.
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>No Physical Shipping</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Panchgavya Se Panchparivartan primarily operates as a digital platform.
              </p>
              <p>
                Unless specifically stated for a particular campaign or service, the platform does not generally ship physical products.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Digital Delivery</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Users may receive digitally:</p>
              <ul className={styles.list}>
                <li>Payment confirmations</li>
                <li>Contribution acknowledgements</li>
                <li>Registration confirmations</li>
                <li>Service-related communications</li>
                <li>Campaign-related updates</li>
              </ul>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Delivery Method</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Digital communications may be delivered through:</p>
              <ul className={styles.list}>
                <li>Email</li>
                <li>Website dashboard</li>
                <li>Registered mobile communication</li>
                <li>Other available electronic communication methods</li>
              </ul>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Delivery Time</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Digital confirmations are generally initiated after successful processing, subject to technical and payment gateway availability.
              </p>
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Physical Items</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                If any future campaign involves physical products or materials, specific delivery information for that campaign should be separately displayed.
              </p>
            </div>
          </article>

          {/* Contact Box */}
          <div className={styles.contactBox}>
            <h3>Questions Regarding Digital Delivery & Receipts?</h3>
            <p>
              If you haven't received your digital confirmation or payment receipt, please contact us:
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

export default ShippingDeliveryPolicy;
