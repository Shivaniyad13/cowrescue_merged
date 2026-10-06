import { useState } from "react";
import styles from "./Donate.module.css";
import { submitDonation, createDonationOrder, verifyDonationOrder } from "../services/api";

// Assets
import qrCode from "../assets/images/qr.jpeg";
import donationVid from "../assets/videos/cow-donation-campaign.mp4";

// Hero & Section Images
import heroCowImg from "../assets/images/Cow-Donation-Feeding-Procedure.jpg";
import closingCowImg from "../assets/images/nabin-cow.png";

// 9 Donation Cards Images
import imgFirstRoti from "../assets/images/Cow-Donation-Feeding-Procedure.jpg";
import imgAdoptCow from "../assets/images/cow1.jpg";
import imgNandiSeva from "../assets/images/cow7.jpg";

import imgCowTreatment from "../assets/images/1687802961140593-0.png";
import imgCowShed from "../assets/images/CowShed.jpg";
import imgFeed20Cows from "../assets/images/20cows.png";
import imgAdoptCalf from "../assets/images/donte cow.jpg";
import imgMedicinesKit from "../assets/images/cow kit.jpg";
import imgGreenFodder from "../assets/images/WhatsApp Image 2025-08-05 at 18.30.11.jpeg";

const Donation = () => {
  const [selectedAmount, setSelectedAmount] = useState("501");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    purpose: "Cow Food & Nutrition",
    message: "",
    transactionId: "",
  });
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const amounts = [10, 251, 501, 1001, 2100];
  const upiId = "49122452@sbi";

  const generateUpiIntentUrl = (amount, purposeText) => {
    const payeeUpiId = upiId;
    const payeeName = "Panchgavya Parivartan";
    const numAmount = Number(amount || 0).toFixed(2);
    const note = `Donation for ${purposeText || "Cow Care"}`;
    return `upi://pay?pa=${encodeURIComponent(payeeUpiId)}&pn=${encodeURIComponent(payeeName)}&am=${numAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // 9 Donation Cards definition as requested
  const donationCardsData = [
    {
      id: "first-roti",
      title: "Feed Your Gau(Cow)",
      description: "Offer the first meal of the day to a Gau.",
      image: imgFirstRoti,
      alt: "Feeding first roti to a cow",
      purpose: "Cow Food & Nutrition",
      defaultAmount: "",
    },
    {
      id: "Adopt and Care a calf",
      title: " Adopt a Gau or Nandi",
      description: "Support food, shelter and daily care for a cow.",
      image: imgAdoptCow,
      alt: "Native cow portrait",
      purpose: "Cow Shelter & Protection",
      defaultAmount: "2100",
    },
    {
      id: "Nandi-seva",
      title: "Nandi Seva",
      description: "Support compassionate care for Nandi(bulls).",
      image: imgNandiSeva,
      alt: "Indigenous Nandi bull care",
      purpose: "Native Cow Conservation",
      defaultAmount: "1001",
    },
    {
      id: "Treatment for injured Gau",
      title: " Treatment for injured Gau",
      description: "Help support essential veterinary and medical care.",
      image: imgCowTreatment,
      alt: "Cow receiving veterinary medical care",
      purpose: "Veterinary & Medical Care",
      defaultAmount: "501",
    },
    {
      id: "Feed a Gausala",
      title: "Feed a Gausala",
      description: "Help provide a safer and cleaner shelter for cows.",
      image: imgCowShed,
      alt: "Clean shelter environment for cows",
      purpose: "Gau Shelter & Protection",
      defaultAmount: "1001",
    },
    {
      id: "Become a GauRakshak",
      title: "Become a GauRakshak",
      description: "Support nutritious food and daily nourishment.",
      image: imgFeed20Cows,
      alt: "Group of native cows feeding",
      purpose: "Gau Food & Nutrition",
      defaultAmount: "2100",
    },
    {
      id: "adopt-calf",
      title: "Adopt and Care a Calf",
      description: "Help provide nutrition and care for a young calf.",
      image: imgAdoptCalf,
      alt: "Young native calf",
      purpose: "Native Gau Conservation",
      defaultAmount: "501",
    },
    {
      id: "medicines-kit",
      title: "Medicines Kit for Gau  & Nandi",
      description: "Support essential veterinary medicines and care.",
      image: imgMedicinesKit,
      alt: "Veterinary medicines kit for gau",
      purpose: "Veterinary & Medical Care",
      defaultAmount: "251",
    },
    {
      id: "natural-farming",
      title: "Natural Farming Seva",
      description: "Support sustainable farming practices using cow-based natural resources.",
      image: imgGreenFodder,
      alt: "Natural farming using cow-based resources",
      purpose: "Natural Farming",
      defaultAmount: "251",
    },
  ];

  const handleCardDonateClick = (purpose, defaultAmount) => {
    setFormData((prev) => ({
      ...prev,
      purpose: purpose,
    }));
    if (defaultAmount) {
      setSelectedAmount(defaultAmount);
    }
    const element = document.getElementById("donation-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount.toString());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPaymentScreenshot(null);
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setPaymentScreenshot(null);
    setPreviewUrl(null);
    // Reset file input value
    document.getElementById('payment-screenshot').value = '';
  };

  const [activeGatewayOrder, setActiveGatewayOrder] = useState(null);
  const [lastUpiSubmission, setLastUpiSubmission] = useState(null);

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Cashfree) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter your full name." });
      return false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setSubmitStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return false;
    }
    if (!formData.state.trim()) {
      setSubmitStatus({ type: "error", message: "Please enter your state." });
      return false;
    }
    if (!selectedAmount || Number(selectedAmount) < 10) {
      setSubmitStatus({ type: "error", message: "Minimum donation amount is ₹10." });
      return false;
    }
    return true;
  };

  const handleDirectUpiPayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) return;

    const currentKey = `${formData.name.trim()}_${formData.phone.trim()}_${formData.state.trim()}_${formData.purpose}_${selectedAmount}`;
    const upiIntentUrl = generateUpiIntentUrl(selectedAmount, formData.purpose);
    const isMobile = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // If identical submission exists in current session, re-trigger intent without creating duplicate DB record
    if (lastUpiSubmission === currentKey) {
      const msg = isMobile
        ? `Donation request (Pending Verification) is recorded. Re-launching your UPI payment app...`
        : `Donation request (Pending Verification) is recorded. On desktop: Please scan the QR code using any UPI app on your mobile phone.`;

      setSubmitStatus({ type: "success", message: msg });
      if (typeof window !== "undefined") {
        window.location.href = upiIntentUrl;
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("donorName", formData.name);
      payload.append("phone", formData.phone);
      payload.append("email", formData.email);
      payload.append("city", formData.city);
      payload.append("state", formData.state);
      payload.append("purpose", formData.purpose);
      payload.append("amount", selectedAmount);
      payload.append("message", formData.message);
      payload.append("transactionId", formData.transactionId);
      payload.append("paymentMethod", "UPI");

      if (paymentScreenshot) {
        payload.append("paymentScreenshot", paymentScreenshot);
      }

      const res = await submitDonation(payload);
      setLastUpiSubmission(currentKey);

      const baseSuccessMsg = res.message || "Thank you for your contribution! Your donation request has been received and is pending payment verification.";
      
      const successMessage = isMobile
        ? `${baseSuccessMsg} Launching your UPI payment app to transfer ₹${selectedAmount}...`
        : `${baseSuccessMsg} (Status: PENDING). On desktop: Please scan the QR code using any UPI app on your mobile phone to complete your payment of ₹${selectedAmount}.`;

      setSubmitStatus({
        type: "success",
        message: successMessage,
      });

      if (document.getElementById("payment-screenshot")) {
        document.getElementById("payment-screenshot").value = "";
      }
      setPaymentScreenshot(null);
      setPreviewUrl(null);

      // Trigger Direct UPI Intent
      if (typeof window !== "undefined") {
        window.location.href = upiIntentUrl;
      }
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err.message || "Failed to submit donation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentGateway = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;

    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const sdkLoaded = await loadCashfreeScript();
      if (!sdkLoaded || typeof window === "undefined" || !window.Cashfree) {
        throw new Error("Cashfree Payment Gateway SDK failed to load. Please check your network connection or use Direct UPI Payment.");
      }

      const currentKey = `${formData.name.trim()}_${formData.phone.trim()}_${formData.state.trim()}_${formData.purpose}_${selectedAmount}`;
      let orderRes = activeGatewayOrder && activeGatewayOrder.key === currentKey ? activeGatewayOrder.data : null;

      if (!orderRes) {
        const orderData = {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email ? formData.email.trim() : "",
          city: formData.city ? formData.city.trim() : "",
          state: formData.state.trim(),
          purpose: formData.purpose,
          amount: Number(selectedAmount),
          message: formData.message ? formData.message.trim() : "",
        };

        orderRes = await createDonationOrder(orderData);
        setActiveGatewayOrder({ key: currentKey, data: orderRes });
      }

      const cfMode = orderRes.environment === "production" ? "production" : "sandbox";
      const cashfree = window.Cashfree({ mode: cfMode });

      setSubmitStatus({
        type: "success",
        message: "Cashfree Payment Gateway initialized. Opening secure checkout...",
      });

      cashfree.checkout({
        paymentSessionId: orderRes.paymentSessionId,
        redirectTarget: "_modal",
      }).then(async (result) => {
        if (result.error) {
          setIsSubmitting(false);
          setSubmitStatus({
            type: "error",
            message: result.error.message || "Payment Gateway checkout was closed. You can retry anytime or use Direct UPI Payment.",
          });
        } else {
          try {
            const verifyRes = await verifyDonationOrder({
              donationId: orderRes.donationId,
              orderId: orderRes.orderId,
            });
            setActiveGatewayOrder(null);
            setSubmitStatus({
              type: "success",
              message: verifyRes.message || "Thank you! Your donation payment has been verified successfully via Cashfree.",
            });
          } catch (vErr) {
            setSubmitStatus({
              type: "success",
              message: "Payment completed! Your donation has been recorded and is pending final verification.",
            });
          } finally {
            setIsSubmitting(false);
          }
        }
      });
    } catch (err) {
      setIsSubmitting(false);
      setSubmitStatus({
        type: "error",
        message: err.message || "Cashfree Payment Gateway is currently operating in preview mode. Please use Direct UPI Payment.",
      });
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById("donation-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.donatePage}>
      {/* ================= 1. HERO SECTION ================= */}
      <section className={styles.heroSection}>
        <div className={styles.heroImageContainer}>
          <img
            src={heroCowImg}
            alt="Indigenous Indian Cow receiving compassionate care"
            className={styles.heroBgImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.campaignTag}>
              PANCHGAVYA SE PANCHPARIVARTAN
            </span>
            <h1 className={styles.heroTitle}>
              Give a Gau a <span>Safer Tomorrow</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Your contribution can help provide food, shelter, care and dignity
              to our native Gau.
            </p>
            <div className={styles.heroActions}>
              <button
                onClick={scrollToForm}
                className={styles.primaryCta}
                aria-label="Support for Cow Care"
              >
                Support for Gau Care <span className={styles.ctaArrow}>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. DONATION CARDS SECTION ================= */}
      <section className={styles.cardsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubheading}>CHOOSE YOUR SEVA</span>
            <h2 className={styles.sectionHeading}>
              Support Our Native Gau Initiatives
            </h2>
            <p className={styles.sectionDescription}>
              Select a specific seva card below to contribute directly to cow feeding, shelter, medical treatment, or calf care.
            </p>
          </div>

          <div className={styles.donationCardsGrid}>
            {donationCardsData.map((card) => (
              <div key={card.id} className={styles.sevaCard}>
                <div className={styles.sevaCardImageContainer}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    className={styles.sevaCardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.sevaCardBody}>
                  <div className={styles.sevaCardTextGroup}>
                    <h3 className={styles.sevaCardTitle}>{card.title}</h3>
                    <p className={styles.sevaCardDesc}>{card.description}</p>
                  </div>
                  <div className={styles.sevaCardFooter}>
                    <button
                      type="button"
                      className={styles.cardDonateBtn}
                      onClick={() =>
                        handleCardDonateClick(card.purpose, card.defaultAmount)
                      }
                      aria-label={`Donate for ${card.title}`}
                    >
                      Support
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. VIDEO SECTION ("One Donation. One Life.") ================= */}
      <section className={styles.videoSection}>
        <div className={styles.container}>
          <div className={styles.videoLayout}>
            <div className={styles.videoCard}>
              <video
                controls
                playsInline
                preload="metadata"
                className={styles.videoPlayer}
              >
                <source src={donationVid} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className={styles.videoContent}>
              <span className={styles.sectionSubheading}>EMOTIONAL APPEAL</span>
              <h2 className={styles.sectionHeading}>One Donation. One Life.</h2>
              <p className={styles.videoParagraph}>
                Your kindness can become food, shelter, care and hope for a cow. Together, we can protect vulnerable cows and ensure they receive lifelong compassionate care.
              </p>

              <div className={styles.videoChecklist}>
                <div className={styles.checkItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Food & Nutrition</span>
                </div>
                <div className={styles.checkItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Safe Shelter</span>
                </div>
                <div className={styles.checkItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>Medical Care</span>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className={styles.videoCtaBtn}
              >
                Support Cow Care
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. MAIN DONATION FORM & QR CODE / UPI ================= */}
      <section className={styles.donationMainSection} id="donation-form">
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubheading}>MAKE A DIFFERENCE</span>
            <h2 className={styles.sectionHeading}>Make Your Contribution</h2>
            <p className={styles.sectionDescription}>
              Please provide your information to continue your support.
            </p>
          </div>

          <div className={styles.donationTwoColumnLayout}>
            {/* LEFT COLUMN: DONATION FORM */}
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <div className={styles.formCardHeaderIcon}>🌱</div>
                <div>
                  <h3 className={styles.formCardTitle}>Donor Information</h3>
                  <p className={styles.formCardSubtitle}>
                    Fill in your details below.
                  </p>
                </div>
              </div>

              <form onSubmit={handleDirectUpiPayment} className={styles.donationForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>
                      Full Name <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={styles.formInput}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.formLabel}>
                      Mobile Number <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={styles.formInput}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={styles.formInput}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city" className={styles.formLabel}>
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className={styles.formInput}
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="state" className={styles.formLabel}>
                      State <span className={styles.requiredStar}>*</span>
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className={styles.formInput}
                      placeholder="Your state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="purpose" className={styles.formLabel}>
                      Support Purpose <span className={styles.requiredStar}>*</span>
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      className={styles.formSelect}
                      value={formData.purpose}
                      onChange={handleChange}
                      required
                    >
                      <option value="Feed Your Gau">
                        Feed Your Gau
                      </option>

                      <option value="Adopt a Gau or Nandi">
                        Adopt a Gau or Nandi
                      </option>

                      <option value="Nandi Seva">
                        Nandi Seva
                      </option>

                      <option value="Treatment for Injured Gau">
                        Treatment for Injured Gau
                      </option>

                      <option value="Gau Shelter Seva">
                        Gau Shelter Seva
                      </option>

                      <option value="Become a GauRakshak">
                        Become a GauRakshak
                      </option>

                      <option value="Adopt and Care a Calf">
                        Adopt and Care a Calf
                      </option>

                      <option value="Medicines Kit for Gau & Nandi">
                        Medicines Kit for Gau & Nandi
                      </option>

                      <option value="Natural Farming Seva">
                        Natural Farming Seva
                      </option>
                    </select>
                  </div>
                </div>

                {/* DONATION AMOUNT SELECTOR */}
                <div className={styles.amountSelectorContainer}>
                  <label className={styles.formLabel}>
                    Donation Amount <span className={styles.requiredStar}>*</span>
                  </label>

                  <div className={styles.amountButtonsGrid}>
                    {amounts.map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        className={`${styles.amountBtn} ${selectedAmount === amount.toString()
                            ? styles.amountBtnActive
                            : ""
                          }`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>

                  <div className={styles.customAmountWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      min="10"
                      id="customAmount"
                      name="customAmount"
                      className={styles.customAmountInput}
                      placeholder="Enter custom amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>
                    Message / Note (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    className={styles.formTextarea}
                    placeholder="Write a message of support..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                {/* TRANSACTION / UTR ID */}
                <div className={styles.formGroup}>
                  <label htmlFor="transactionId" className={styles.formLabel}>
                    UPI Transaction ID / UTR Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    className={styles.formInput}
                    placeholder="e.g. 324567891234"
                    value={formData.transactionId}
                    onChange={handleChange}
                  />
                </div>

                {/* PAYMENT SCREENSHOT UPLOAD */}
                <div className={styles.formGroup}>
                  <label htmlFor="payment-screenshot" className={styles.formLabel}>
                    Attach Payment Screenshot (optional)
                  </label>
                  <input
                    type="file"
                    id="payment-screenshot"
                    name="paymentScreenshot"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  {previewUrl && (
                    <div className={styles.filePreview}>
                      <img src={previewUrl} alt="Payment screenshot preview" className={styles.previewImage} />
                      <button type="button" onClick={clearFile} className={styles.clearFileBtn}>
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.secureNotice}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span>
                    Your details are kept secure and used only for donation processing and communication.
                  </span>
                </div>

                {submitStatus.message && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      backgroundColor:
                        submitStatus.type === "success" ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${submitStatus.type === "success" ? "#bbf7d0" : "#fecaca"
                        }`,
                      color:
                        submitStatus.type === "success" ? "#166534" : "#991b1b",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                    }}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* PAYMENT METHOD SELECTION SECTION */}
                <div className={styles.paymentMethodsContainer}>
                  <div className={styles.paymentMethodsHeader}>
                    <h4 className={styles.paymentMethodsTitle}>Select Payment Method</h4>
                    <p className={styles.paymentMethodsSubtitle}>
                      Choose your preferred payment method below to proceed.
                    </p>
                  </div>

                  {/* OPTION 1 — PRIMARY: PAYMENT GATEWAY */}
                  <div className={styles.paymentOptionPrimary}>
                    <div className={styles.optionHeader}>
                      <span className={styles.primaryBadge}>OPTION 1 — PRIMARY / RECOMMENDED</span>
                      <h4 className={styles.optionTitle}>💳 Payment Gateway</h4>
                    </div>
                    <p className={styles.optionSubtext}>
                      Pay securely using Credit/Debit Cards, NetBanking, Wallets, or Gateway UPI.
                    </p>

                    <button
                      type="button"
                      onClick={handlePaymentGateway}
                      className={styles.submitBtnPrimary}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Initializing Gateway..."
                        : `💳 Continue with Payment Gateway (₹${selectedAmount || "0"})`}
                      <span className={styles.btnArrow}>→</span>
                    </button>
                  </div>

                  {/* OR SEPARATOR */}
                  <div className={styles.orDivider}>
                    <span className={styles.orText}>OR</span>
                  </div>

                  {/* OPTION 2 — SECONDARY: DIRECT UPI PAYMENT */}
                  <div className={styles.paymentOptionSecondary}>
                    <div className={styles.optionHeader}>
                      <span className={styles.secondaryBadge}>OPTION 2 — DIRECT UPI</span>
                      <h4 className={styles.optionTitle}>📱 Direct UPI Payment</h4>
                    </div>
                    <p className={styles.optionSubtext}>
                      Direct transfer via Google Pay, PhonePe, Paytm, BHIM or any UPI app.
                    </p>

                    <button
                      type="button"
                      onClick={handleDirectUpiPayment}
                      className={styles.submitBtnSecondary}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `📱 Pay via UPI App (₹${selectedAmount || "0"})`}
                      <span className={styles.btnArrow}>→</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: UPI QR CARD & LIVE SUMMARY */}
            <div className={styles.sideColumn}>
              {/* QR / UPI DONATION CARD */}
              <div className={styles.qrCard}>
                <div className={styles.qrCardHeader}>
                  <span className={styles.qrIcon}>📱</span>
                  <div>
                    <h3 className={styles.qrCardTitle}>Scan & Support Cow Care</h3>
                    <p className={styles.qrCardSubtitle}>
                      Use any UPI app to make your contribution.
                    </p>
                  </div>
                </div>

                <div className={styles.qrImageWrapper}>
                  <img
                    src={qrCode}
                    alt="Panchgavya Se Panchparivartan UPI Payment QR Code"
                    className={styles.qrImage}
                  />
                </div>

                <p className={styles.qrStepsText}>
                  Open UPI App → Scan → Enter Amount → Complete Payment
                </p>

                <div className={styles.upiBox}>
                  <div className={styles.upiDetails}>
                    <span className={styles.upiLabel}>UPI ID</span>
                    <strong className={styles.upiValue}>{upiId}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className={styles.copyBtn}
                    aria-label="Copy UPI ID"
                  >
                    {copiedUpi ? "Copied!" : "Copy"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const formElem = document.getElementById("donation-form");
                    if (formElem) formElem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={styles.directUpiBtn}
                  aria-label="Pay via UPI App"
                >
                  📱 Pay via UPI App (₹{selectedAmount || "0"})
                </button>
              </div>

              {/* DYNAMIC DONATION SUMMARY CARD */}
              <div className={styles.summaryCard}>
                <div className={styles.summaryHeader}>
                  <span className={styles.summaryBadgeIcon}>📝</span>
                  <h3 className={styles.summaryTitle}>Your Contribution</h3>
                </div>

                <div className={styles.summaryList}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Campaign:</span>
                    <strong className={styles.summaryValue}>
                      Panchgavya Se Panchparivartan
                    </strong>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Purpose:</span>
                    <strong className={styles.summaryValue}>
                      {formData.purpose || "Cow Food & Nutrition"}
                    </strong>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Amount:</span>
                    <strong className={styles.summaryAmountValue}>
                      ₹{selectedAmount || "0"}
                    </strong>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Donor:</span>
                    <strong className={styles.summaryValue}>
                      {formData.name || "—"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. IMPACT SECTION ================= */}
      <section className={styles.impactSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionSubheading}>TRANSPARENCY & IMPACT</span>
            <h2 className={styles.sectionHeading}>
              Your Contribution Can Make a Difference
            </h2>
            <p className={styles.sectionDescription}>
              Every contribution helps support essential resources and dignity for native cows.
            </p>
          </div>

          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>🐄</div>
              <h3 className={styles.impactCardTitle}>Cow Care</h3>
              <p className={styles.impactCardDesc}>
                Food, shelter and daily care.
              </p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>🌾</div>
              <h3 className={styles.impactCardTitle}>Green Fodder</h3>
              <p className={styles.impactCardDesc}>
                Support nutritious fodder.
              </p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>💚</div>
              <h3 className={styles.impactCardTitle}>Medical Care</h3>
              <p className={styles.impactCardDesc}>
                Support veterinary care.
              </p>
            </div>

            <div className={styles.impactCard}>
              <div className={styles.impactIcon}>🏡</div>
              <h3 className={styles.impactCardTitle}>Safe Shelter</h3>
              <p className={styles.impactCardDesc}>
                Help maintain safe cow shelters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. EMOTIONAL CLOSING SECTION ================= */}
      <section className={styles.closingSection}>
        <div className={styles.closingImageWrapper}>
          <img
            src={closingCowImg}
            alt="Native cow resting in peaceful rural pasture"
            className={styles.closingBgImage}
            loading="lazy"
          />
          <div className={styles.closingOverlay}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.closingContent}>
            <h2 className={styles.closingTitle}>
              Your Small Contribution can enhance the Capacity of Panchgavya
              Se Panchparivartan
            </h2>
            <p className={styles.closingText}>
              Together, we can create a future where every cow receives care, protection and dignity.
            </p>
            <button
              onClick={scrollToForm}
              className={styles.closingCtaBtn}
              aria-label="Donate for Cow Care"
            >
              Donate for Cow Care
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;