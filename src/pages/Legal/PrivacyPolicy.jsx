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
            <span>📅</span> Last Updated: 24/11/2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          Khushi Centre for Rehabilitation and Research respects the privacy and confidentiality of all donors.
        </div>

        <div className={styles.sectionsWrapper}>
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Privacy Notice for Donors</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                When you make a donation through our website, we collect and process relevant personal information to facilitate payment, issue donation receipts, maintain financial records and fulfil statutory obligations.
              </p>
              <p>Your information may include:</p>
              <ul className={styles.list}>
                <li>Full name</li>
                <li>Email address</li>
                <li>Mobile number</li>
                <li>Donation amount</li>
                <li>Transaction reference number</li>
                <li>Payment status and payment method</li>
                <li>PAN and address, where required for statutory compliance</li>
              </ul>
              <p>
                Online payments are facilitated through our authorised payment gateway and participating banking institutions.
              </p>
              <div className={styles.highlightBox}>
                <h4>🔒 Payment Credentials</h4>
                <p>
                  The Centre does not ask donors to disclose their UPI PIN, OTP, internet banking password or any other confidential banking credentials.
                </p>
              </div>
              <p>
                Your personal information will be used only for authorised organisational, financial, administrative and legal purposes, subject to applicable law.
              </p>
              <p>
                For complete details, please read our Privacy Policy at <a href="https://www.khushicentre.in" target="_blank" rel="noreferrer">www.khushicentre.in</a>.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Donor Information Collection Notice</h2>
            </div>
            <div className={styles.sectionBody}>
              <p><strong>Information collected:</strong> Name, contact details, donation amount, transaction reference and legally required donor information.</p>
              <p>
                <strong>Purpose:</strong> Payment processing, donation acknowledgement, receipts, financial accounting, statutory reporting and donor communication.
              </p>
              <p>
                <strong>Recipients:</strong> Authorised payment gateway providers, banks, auditors, professional advisers and government authorities where legally required.
              </p>
              <p>
                <strong>Retention:</strong> Information will be retained for the necessary period under applicable legal and accounting requirements.
              </p>
              <p>
                <strong>Rights:</strong> Donors may exercise applicable rights concerning access, correction, erasure, withdrawal of consent and grievance redressal.
              </p>
              <p><strong>Contact:</strong> <a href="mailto:admin@khushicentre.in">admin@khushicentre.in</a></p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Donor Consent and Declaration</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>By proceeding with the donation, I acknowledge and agree that:</p>
              <ol className={styles.numberedList}>
                <li>I am making a voluntary charitable contribution.</li>
                <li>The information supplied by me is accurate.</li>
                <li>I authorise the processing of information necessary to complete and record my donation.</li>
                <li>I understand that my transaction information may be processed by the authorised payment gateway and participating banks.</li>
                <li>I have read the Terms and Conditions, Privacy Policy and Refund and Cancellation Policy.</li>
                <li>I understand that tax benefits are subject to applicable statutory approvals and eligibility.</li>
                <li>I understand that my information may be retained where required by law.</li>
              </ol>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Optional Consent for Communication</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                I would like to receive information about Khushi Centre's charitable programmes, rehabilitation initiatives, healthcare activities, research, community development and future campaigns.
              </p>
              <p>
                This consent is optional and may be withdrawn at any time.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Payment Security Declaration</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                I understand that online donations are processed through authorised payment service providers using their applicable security mechanisms.
              </p>
              <p>
                I will not disclose my UPI PIN, OTP, passwords or banking credentials to any person claiming to represent Khushi Centre.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Grievance Redressal</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>For privacy, data protection and donation-related enquiries:</p>
              <p><strong>Khushi Centre for Rehabilitation and Research</strong></p>
              <p>
                Website: <a href="https://www.khushicentre.in" target="_blank" rel="noreferrer">www.khushicentre.in</a>
              </p>
              <p>Email: <a href="mailto:admin@khushicentre.in">admin@khushicentre.in</a></p>
              <p><strong>Grievance Officer:</strong> Mandvi Kumari (Secretary General)</p>
              <p>
                <strong>Registered Office:</strong> T2 &amp; S2/886, Sector 5, Kalinga Road, Vaishali, Ghaziabad, Uttar Pradesh - 201010
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>!</span>
              <h2 className={styles.sectionTitle}>Disclaimer</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>
                This policy is applicable to all programmes, projects, campaigns, initiatives and activities organised, managed or supported by <strong>Khushi Centre for Rehabilitation and Research</strong>.
              </p>
              <p>
                All donors, participants, beneficiaries, partners and other stakeholders are expected to comply with the applicable terms, conditions and guidelines outlined in this policy.
              </p>
              <div className={styles.highlightBox}>
                <h4>KHUSHI CENTRE FOR REHABILITATION AND RESEARCH</h4>
                <p><em>Rehabilitation • Research • Healthcare • Social Inclusion</em></p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
