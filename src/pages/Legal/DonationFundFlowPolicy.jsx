import { useEffect } from 'react';
import styles from './LegalPage.module.css';

const DonationFundFlowPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <header className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <span className={styles.badge}>Official Legal Policy</span>
          <h1 className={styles.heroTitle}>Donation & Fund Flow Policy</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last Updated: August 31, 2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          Panchgavya Se Panchparivartan is committed to complete transparency regarding contributions, support funds, platform fees, and financial settlement flows for registered beneficiary organizations and campaigns.
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Purpose</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Panchgavya Se Panchparivartan may facilitate support and contributions for eligible campaigns, cow rescue initiatives, animal welfare initiatives, registered NGOs and other approved social initiatives.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Payment Breakdown</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Before or during payment confirmation, the platform should make reasonable efforts to disclose applicable payment components.
              </p>
              <p>Depending on the transaction, the total payable amount may include:</p>
              <ul className={styles.list}>
                <li>Contribution amount</li>
                <li>Donation/support amount</li>
                <li>Platform/service fee</li>
                <li>Applicable taxes or charges, where applicable</li>
              </ul>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Platform Fee</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The platform may charge a platform or service fee for technology, administration, payment facilitation, campaign management and operational services.
              </p>
              <p>
                Where applicable, such fees should be disclosed to users.
              </p>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Beneficiary Organizations</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Where funds are intended for a registered NGO or beneficiary organization, payments and settlements may be processed according to the platform's approved payment and settlement arrangements.
              </p>
              <div className={styles.highlightBox}>
                <h4>💡 Transparency Principle</h4>
                <p>
                  The platform should not falsely claim that every payment is transferred directly to an NGO if the actual payment flow is different.
                </p>
              </div>
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Transparency</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Users should be provided with relevant transaction confirmation or receipt information.
              </p>
            </div>
          </article>

          {/* Section 6 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Campaign Changes</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Campaign availability, requirements and beneficiary information may change based on verification, operational requirements or legal compliance.
              </p>
            </div>
          </article>

          {/* Section 7 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>Misuse Prevention</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                The platform may review or restrict transactions that appear fraudulent, suspicious or inconsistent with applicable requirements.
              </p>
            </div>
          </article>

          {/* Contact Box */}
          <div className={styles.contactBox}>
            <h3>Questions Regarding Fund Flow & Disclosures?</h3>
            <p>
              Reach out to our team for clarifications on fund allocation and platform fee schedules:
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

export default DonationFundFlowPolicy;
