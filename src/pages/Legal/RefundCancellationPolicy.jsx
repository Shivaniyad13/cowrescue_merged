import { useEffect } from 'react';
import styles from './LegalPage.module.css';

const RefundCancellationPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <header className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <span className={styles.badge}>Official Legal Policy</span>
          <h1 className={styles.heroTitle}>Refund & Cancellation Policy</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last Updated: August 31, 2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          This Refund & Cancellation Policy outlines the procedures, eligibility criteria, and guidelines for transaction reviews, duplicate charges, failed payments, and cancellation requests on Panchgavya Se Panchparivartan.
        </div>

        <div className={styles.sectionsWrapper}>
          {/* Section 1 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>General</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Users should review all payment details before confirming a transaction.
              </p>
            </div>
          </article>

          {/* Section 2 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Voluntary Contributions</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Where a payment has been successfully completed and funds have already been processed or allocated according to the disclosed fund flow, cancellation may not always be possible.
              </p>
            </div>
          </article>

          {/* Section 3 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Duplicate Transactions</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                If a user is charged more than once for the same transaction due to a technical issue, the user may contact the platform with relevant transaction details for review.
              </p>
            </div>
          </article>

          {/* Section 4 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Failed Transactions</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Where payment fails but an amount is debited, the reversal or refund may be handled according to the payment gateway and banking process.
              </p>
            </div>
          </article>

          {/* Section 5 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Refund Requests</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>Eligible refund requests may require:</p>
              <ul className={styles.list}>
                <li>Transaction ID</li>
                <li>Date of transaction</li>
                <li>Registered name</li>
                <li>Email or mobile number</li>
                <li>Reason for refund request</li>
              </ul>
              <p>
                Refund eligibility will depend on the status of the transaction, applicable fund allocation and payment processing status.
              </p>
            </div>
          </article>

          {/* Section 6 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Platform Fees</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Platform or service fees may be non-refundable where services have already been provided or payment processing has been completed, subject to applicable law.
              </p>
            </div>
          </article>

          {/* Section 7 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>7</span>
              <h2 className={styles.sectionTitle}>Cancellation</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Users should contact the platform as soon as possible if they wish to cancel an eligible request.
              </p>
            </div>
          </article>

          {/* Section 8 */}
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>8</span>
              <h2 className={styles.sectionTitle}>Processing Time</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                Where a refund is approved, processing time may depend on the payment gateway and banking partner.
              </p>
            </div>
          </article>

          {/* Contact Box */}
          <div className={styles.contactBox}>
            <h3>Need Help with a Refund or Cancellation?</h3>
            <p>
              Please submit your transaction details to our official contact address or email:
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

export default RefundCancellationPolicy;
