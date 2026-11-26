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
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.lastUpdated}>
            <span>📅</span> Last updated: 24/11/2026
          </p>
        </div>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.introBox}>
          These terms apply to online donations made through the official website of Khushi Centre for Rehabilitation and Research.
        </div>

        <div className={styles.sectionsWrapper}>
          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <h2 className={styles.sectionTitle}>Terms and Conditions for Online Donations</h2>
            </div>
            <div className={styles.sectionBody}>
              <p><strong>1.1 Acceptance:</strong> By making a donation through the official website of Khushi Centre for Rehabilitation and Research ("the Centre"), the donor agrees to these Terms and Conditions.</p>
              <p><strong>1.2 Purpose of Donations:</strong> All donations are voluntary contributions intended to support the Centre's charitable, humanitarian, rehabilitation, healthcare, education, research and community-development activities in accordance with its registered objectives.</p>
              <p><strong>1.3 Accepted Payment Methods:</strong></p>
              <ul className={styles.list}>
                <li>Unified Payments Interface (UPI)</li>
                <li>Supported digital wallets</li>
                <li>Net Banking</li>
                <li>Online bank transfers</li>
                <li>Other payment modes enabled through the authorised payment gateway</li>
              </ul>
              <p>
                <strong>1.4 Payment Gateway:</strong> Online transactions are facilitated through the payment gateway integrated with the Centre's website, referred to as Cashify Payment Gateway, subject to confirmation of the provider's exact legal name and contractual arrangement.
              </p>
              <p>Payments are subject to the terms of the payment gateway, participating banks and payment service providers.</p>
              <p><strong>1.5 Donation Authorisation:</strong> The donor confirms that:</p>
              <ul className={styles.list}>
                <li>The contribution is voluntary.</li>
                <li>The payment instrument is legally authorised for use.</li>
                <li>The information provided is accurate.</li>
                <li>The contribution is not made for any unlawful purpose.</li>
                <li>The donor has read and accepted the applicable policies.</li>
              </ul>
              <p>
                <strong>1.6 Donation Utilisation:</strong> The Centre shall use donations towards its charitable objectives, programmes, administrative requirements and related activities in accordance with applicable law and its governing documents.
              </p>
              <p>
                <strong>1.7 Receipts:</strong> An electronic donation acknowledgement or receipt shall be issued following successful payment verification and reconciliation, subject to the donor providing the necessary information.
              </p>
              <p>
                <strong>1.8 Tax Benefits:</strong> Tax deductions are available only where the Centre holds the applicable valid approval and the donation satisfies the requirements of the prevailing Indian income-tax legislation. No tax deduction is guaranteed merely because a donation is made.
              </p>
              <p>
                <strong>1.9 Foreign Contributions:</strong> Foreign-source contributions shall be accepted only where the Centre is legally authorised under the Foreign Contribution (Regulation) Act, 2010 and applicable rules. The domestic donation facility shall not be treated as an authorised FCRA donation channel.
              </p>
              <p>
                <strong>1.10 Governing Law:</strong> These terms shall be governed by Indian law. Disputes shall be subject to the jurisdiction of competent courts in Delhi, India, subject to applicable law.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <h2 className={styles.sectionTitle}>Donation Refund and Cancellation Policy</h2>
            </div>
            <div className={styles.sectionBody}>
              <p><strong>2.1 General Policy:</strong> Donations are voluntary charitable contributions. Once successfully received and acknowledged, donations are ordinarily non-refundable.</p>
              <p><strong>2.2 Exceptional Refund Situations:</strong> The Centre may consider refund requests in the following circumstances:</p>
              <ul className={styles.list}>
                <li>Duplicate payment for the same donation.</li>
                <li>Payment made due to a demonstrable technical error.</li>
                <li>Unauthorised or fraudulent payment, subject to verification.</li>
                <li>Amount debited but incorrectly processed or reconciled.</li>
                <li>Other exceptional circumstances approved by the Centre.</li>
              </ul>
              <p><strong>2.3 Refund Procedure:</strong> Donors should submit a refund request containing:</p>
              <ul className={styles.list}>
                <li>Full name of donor.</li>
                <li>Registered mobile number and email address.</li>
                <li>Transaction ID or UPI reference number.</li>
                <li>Date and amount of transaction.</li>
                <li>Reason for requesting the refund.</li>
                <li>Relevant payment evidence.</li>
              </ul>
              <p>
                <strong>2.4 Refund Processing:</strong> Approved refunds shall ordinarily be processed through the original payment source, subject to banking and payment gateway procedures.
              </p>
              <p>
                The Centre will endeavour to acknowledge refund requests within seven working days and communicate the decision after verification.
              </p>
              <p>Refund timelines may depend on the payment gateway and banking institutions.</p>
              <p>
                <strong>2.5 Contact:</strong> Refund requests should be submitted to the Centre through its official email address or contact information published on its website.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <h2 className={styles.sectionTitle}>Data Collection and Donor Information</h2>
            </div>
            <div className={styles.sectionBody}>
              <p><strong>3.1 Purpose of Data Collection:</strong> Information may be used for:</p>
              <ul className={styles.list}>
                <li>Processing donations.</li>
                <li>Issuing receipts and acknowledgements.</li>
                <li>Maintaining financial and statutory records.</li>
                <li>Donor communication.</li>
                <li>Fraud prevention and transaction verification.</li>
                <li>Compliance with applicable laws and regulatory requirements.</li>
              </ul>
              <p><strong>3.2 Sharing of Information:</strong> Donor information may be shared with:</p>
              <ul className={styles.list}>
                <li>Authorised payment gateway providers.</li>
                <li>Banks and payment service providers.</li>
                <li>Statutory auditors and professional advisers.</li>
                <li>Government and regulatory authorities where legally required.</li>
              </ul>
              <p>The Centre shall not knowingly sell donor information to third parties.</p>
              <p>
                <strong>3.3 Information Security:</strong> Reasonable technical and organisational safeguards shall be implemented to protect donor information from unauthorised access, misuse, alteration or disclosure.
              </p>
              <p>
                <strong>3.4 Data Retention:</strong> Donor records shall be retained for the period necessary for charitable administration, accounting, statutory compliance and applicable legal requirements.
              </p>
              <p>
                <strong>3.5 Donor Communication:</strong> Donors may receive transaction confirmations, receipts, acknowledgements and information about the Centre's charitable programmes.
              </p>
              <p>Non-essential promotional communications shall be handled in accordance with applicable consent and data protection requirements.</p>
              <p>
                <strong>3.6 Privacy Enquiries:</strong> Donors may contact the Centre through its official contact details to seek clarification about their personal information.
              </p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <h2 className={styles.sectionTitle}>Online Payment and Settlement Policy</h2>
            </div>
            <div className={styles.sectionBody}>
              <p><strong>4.1 Payment Channels:</strong> The Centre provides an online donation facility through UPI, digital wallets, Net Banking and other supported payment modes.</p>
              <p><strong>4.2 Designated Bank Account:</strong></p>
              <ul className={styles.list}>
                <li>Donations are intended to be settled into the Centre's designated State Bank of India account.</li>
                <li>Account Name: Khushi Centre for Rehabilitation and Research</li>
                <li>Bank: State Bank of India</li>
                <li>Account Number: 37124417001</li>
                <li>Branch: (01416) Kanjhawala Village New Delhi, NCT of Delhi 110081</li>
                <li>IFSC: SBIN0001416</li>
              </ul>
              <p>
                <strong>4.3 Transaction Confirmation:</strong> A transaction shall be considered received by the Centre upon successful payment confirmation and reconciliation with its bank account or authorised payment settlement records.
              </p>
              <p><strong>4.4 Failed Transactions:</strong></p>
              <ul className={styles.list}>
                <li>Donors should retain the transaction reference.</li>
                <li>Donors should first verify the transaction status.</li>
                <li>The Centre shall assist with payment reconciliation.</li>
                <li>Any reversal or refund shall be subject to the applicable banking and payment gateway procedures.</li>
              </ul>
              <p>
                <strong>4.5 Duplicate Transactions:</strong> Where duplicate donations are verified, the donor may request a refund under the Refund and Cancellation Policy.
              </p>
              <p><strong>4.6 Payment Security:</strong> All transactions are subject to the security protocols and terms of the respective payment service providers.</p>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>5</span>
              <h2 className={styles.sectionTitle}>Foreign Contribution and FCRA Policy</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.highlightBox}>
                <h4>Foreign Contributions — Not Applicable (NA)</h4>
                <p>
                  Donors residing outside India should contact the Centre before making a contribution as we have no FCRA account available with us.
                </p>
              </div>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>6</span>
              <h2 className={styles.sectionTitle}>Donor Declaration and Consent</h2>
            </div>
            <div className={styles.sectionBody}>
              <p>By proceeding with an online donation, I hereby declare that:</p>
              <ol className={styles.numberedList}>
                <li>My donation is voluntary and is being made without any expectation of personal, commercial or financial benefit.</li>
                <li>The funds contributed are from lawful sources.</li>
                <li>I am authorised to use the payment instrument through which the donation is being made.</li>
                <li>The information supplied by me is accurate and complete.</li>
                <li>I understand that tax benefits are subject to the Centre's valid statutory approvals and applicable law.</li>
                <li>I have read and accepted the Terms and Conditions, Refund Policy, Privacy Policy and applicable payment policies.</li>
                <li>I authorise the Centre and its authorised payment service providers to process the information necessary to complete and record my donation.</li>
              </ol>
              <div className={styles.highlightBox}>
                <h4>Declaration</h4>
                <p>I confirm that I have read and understood the above conditions and voluntarily agree to them.</p>
              </div>
            </div>
          </article>

          <article className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>KH</span>
              <h2 className={styles.sectionTitle}>Khushi Centre for Rehabilitation and Research</h2>
            </div>
            <div className={styles.sectionBody} style={{ textAlign: 'center' }}>
              <p><strong>KHUSHI CENTRE FOR REHABILITATION AND RESEARCH</strong></p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
