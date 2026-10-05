import React, { useState } from "react";
import { createCaseDonationOrder, verifyCaseDonation } from "../../../services/api";

const AMOUNT_OPTIONS = [51, 101, 251, 501, 1001];

const SupportRescueModal = ({ caseData, onClose, onSuccess }) => {
  const [selectedAmount, setSelectedAmount] = useState(51);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Cashfree) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!finalAmount || finalAmount < 10) {
      setError("Minimum donation is ₹10.");
      return;
    }
    if (donorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (donorPhone && !/^[6-9]\d{9}$/.test(donorPhone)) {
      setError("Please enter a valid 10-digit mobile.");
      return;
    }

    setIsSubmitting(true);
    try {
      const sdkLoaded = await loadCashfreeScript();
      if (!sdkLoaded || !window.Cashfree) throw new Error("Cashfree SDK failed to load.");

      const orderRes = await createCaseDonationOrder({
        case_id: caseData.case_id,
        amount: finalAmount,
        donor_name: donorName.trim() || "Anonymous",
        donor_email: donorEmail.trim() || "",
        donor_phone: donorPhone.trim() || "",
        message: message.trim() || "",
      });

      const cfMode = orderRes.environment === "production" ? "production" : "sandbox";
      const cashfree = window.Cashfree({ mode: cfMode });

      const result = await cashfree.checkout({
        paymentSessionId: orderRes.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result.error) throw new Error(result.error.message || "Payment cancelled.");

      try {
        await verifyCaseDonation({
          donationId: orderRes.donationId,
          orderId: orderRes.orderId,
        });
      } catch (vErr) {
        console.warn("Verify failed:", vErr.message);
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || "Payment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "#166534", margin: "0 0 12px" }}>Thank You!</h2>
            <p style={{ color: "#4b5563", marginBottom: "8px" }}>
              Your donation of <strong>₹{finalAmount}</strong> has been received.
            </p>
            <p style={{ color: "#16a34a", fontWeight: 600 }}>
              ✅ NGO will be notified and funds will be transferred soon.
            </p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "20px" }}>
              🌱 गौ माता की रक्षा हमारा परम धर्म है
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>💝</div>
          <h2 style={{ margin: "0 0 6px", color: "#14532d", fontSize: "1.3rem" }}>
            Support This Rescue
          </h2>
          <p style={{ margin: 0, color: "#4b5563", fontSize: "0.9rem" }}>
            Case: <strong>{caseData.case_id}</strong>
          </p>
          {caseData.ngos && (
            <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
              Assigned to: <strong>{caseData.ngos.name}</strong>
            </p>
          )}
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Select Amount (₹) <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <div style={styles.amountGrid}>
            {AMOUNT_OPTIONS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                style={{
                  ...styles.amountBtn,
                  ...(selectedAmount === amt && !customAmount ? styles.amountBtnActive : {}),
                }}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            min="10"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Your Name (optional)</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Email (optional)</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Mobile (optional)</label>
          <input
            type="tel"
            placeholder="10-digit mobile"
            value={donorPhone}
            onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            style={styles.input}
          />

          <label style={styles.label}>Message (optional)</label>
          <textarea
            rows="2"
            placeholder="Your message of support..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }}
          />

          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span>Your Donation:</span>
              <strong style={{ color: "#16a34a", fontSize: "1.1rem" }}>₹{finalAmount || 0}</strong>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "4px" }}>
              🐄 90% goes to NGO for cow care • 10% platform fee
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Processing..." : `💳 Pay ₹${finalAmount || 0} via Cashfree`}
          </button>

          <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginTop: "12px" }}>
            🔒 Secure payment powered by Cashfree
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "20px", overflowY: "auto",
  },
  modal: {
    background: "#fff", borderRadius: "16px", padding: "28px",
    width: "100%", maxWidth: "480px", maxHeight: "90vh",
    overflowY: "auto", position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  closeBtn: {
    position: "absolute", top: "16px", right: "16px",
    background: "#f3f4f6", border: "none", borderRadius: "50%",
    width: "32px", height: "32px", cursor: "pointer",
    fontSize: "1rem", color: "#4b5563",
  },
  label: {
    display: "block", marginTop: "14px", marginBottom: "6px",
    fontWeight: 600, fontSize: "0.88rem", color: "#374151",
  },
  input: {
    width: "100%", padding: "10px 14px", border: "1px solid #d1d5db",
    borderRadius: "8px", fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
  },
  amountGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px", marginBottom: "10px",
  },
  amountBtn: {
    padding: "12px", border: "2px solid #d1d5db", background: "#fff",
    borderRadius: "8px", cursor: "pointer", fontWeight: 600,
    fontSize: "0.95rem", color: "#374151", transition: "all 0.15s",
  },
  amountBtnActive: {
    borderColor: "#16a34a", background: "#f0fdf4", color: "#166534",
  },
  summaryBox: {
    marginTop: "18px", padding: "12px 16px", background: "#f0fdf4",
    border: "1px solid #86efac", borderRadius: "10px",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", fontSize: "0.95rem",
  },
  submitBtn: {
    width: "100%", padding: "14px", marginTop: "16px",
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "1rem", fontWeight: 700, cursor: "pointer",
    transition: "all 0.2s",
  },
  errorBox: {
    padding: "10px 14px", background: "#fef2f2",
    border: "1px solid #fecaca", color: "#991b1b",
    borderRadius: "8px", marginBottom: "12px", fontSize: "0.88rem",
  },
};

export default SupportRescueModal;