import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getNgoBankFormInfo, submitNgoBankDetails } from "../../services/api";

const NgoBankDetails = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ngoInfo, setNgoInfo] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    bank_account_holder: "",
    bank_account_number: "",
    confirm_account_number: "",
    bank_ifsc: "",
    bank_name: "",
    bank_pan: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!token) return;
    getNgoBankFormInfo(token)
      .then((res) => setNgoInfo(res.data))
      .catch((err) => setError(err.message || "Invalid link"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n[name];
      return n;
    });

    let v = value;
    if (name === "bank_account_number" || name === "confirm_account_number") {
      v = value.replace(/\D/g, "").slice(0, 18);
    }
    if (name === "bank_ifsc" || name === "bank_pan") {
      v = value.toUpperCase();
    }

    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const validate = () => {
    const errs = {};
    if (!form.bank_account_holder.trim() || form.bank_account_holder.trim().length < 2)
      errs.bank_account_holder = "Account holder name required";
    if (!/^\d{9,18}$/.test(form.bank_account_number))
      errs.bank_account_number = "Account number must be 9-18 digits";
    if (form.bank_account_number !== form.confirm_account_number)
      errs.confirm_account_number = "Account numbers do not match";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.bank_ifsc))
      errs.bank_ifsc = "Invalid IFSC (e.g. SBIN0001416)";
    if (!form.bank_name.trim() || form.bank_name.trim().length < 2)
      errs.bank_name = "Bank name required";
    if (form.bank_pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.bank_pan))
      errs.bank_pan = "Invalid PAN (e.g. ABCDE1234F)";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError("Please fix the errors below.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitNgoBankDetails(token, {
        bank_account_holder: form.bank_account_holder.trim(),
        bank_account_number: form.bank_account_number,
        bank_ifsc: form.bank_ifsc,
        bank_name: form.bank_name.trim(),
        bank_pan: form.bank_pan || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={{ textAlign: "center" }}>🔄 Loading...</h2>
        </div>
      </div>
    );
  }

  if (error && !ngoInfo) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: "3rem", textAlign: "center" }}>⚠️</div>
          <h2 style={{ color: "#991b1b", textAlign: "center" }}>Link Invalid</h2>
          <p style={{ color: "#4b5563", textAlign: "center" }}>{error}</p>
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/" style={{ color: "#16a34a" }}>← Back to Home</Link>
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "#166534", margin: "0 0 12px" }}>Thank You!</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
              Your bank details have been submitted successfully.
            </p>
            <p style={{ color: "#16a34a", fontWeight: 600 }}>
              💵 Funds will be transferred within 3-5 business days.
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
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{ fontSize: "2.5rem" }}>🏦</div>
          <h1 style={{ margin: "8px 0 4px", color: "#14532d", fontSize: "1.5rem" }}>
            Bank Details Required
          </h1>
          <p style={{ color: "#4b5563", margin: 0 }}>{ngoInfo?.ngo_name}</p>
        </div>

        <div style={styles.infoBox}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#1e40af" }}>
            ℹ️ Your bank details will be used to transfer the donation funds. Please enter accurate details to avoid delays.
          </p>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <Field
            label="Account Holder Name *"
            name="bank_account_holder"
            value={form.bank_account_holder}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar Sharma"
            error={fieldErrors.bank_account_holder}
          />
          <Field
            label="Bank Account Number *"
            name="bank_account_number"
            value={form.bank_account_number}
            onChange={handleChange}
            placeholder="e.g. 37124417001"
            inputMode="numeric"
            error={fieldErrors.bank_account_number}
          />
          <Field
            label="Confirm Account Number *"
            name="confirm_account_number"
            value={form.confirm_account_number}
            onChange={handleChange}
            placeholder="Re-enter account number"
            inputMode="numeric"
            error={fieldErrors.confirm_account_number}
          />
          <Field
            label="IFSC Code *"
            name="bank_ifsc"
            value={form.bank_ifsc}
            onChange={handleChange}
            placeholder="e.g. SBIN0001416"
            error={fieldErrors.bank_ifsc}
          />
          <Field
            label="Bank Name *"
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
            placeholder="e.g. State Bank Of India"
            error={fieldErrors.bank_name}
          />
          <Field
            label="PAN Number (optional)"
            name="bank_pan"
            value={form.bank_pan}
            onChange={handleChange}
            placeholder="e.g. ABCDE1234F"
            error={fieldErrors.bank_pan}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Submitting..." : "✅ Submit Bank Details"}
          </button>

          <p style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center", marginTop: "14px" }}>
            🔒 Your information is secure.
          </p>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, placeholder, error, inputMode }) => (
  <div style={{ marginBottom: "16px" }}>
    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      inputMode={inputMode}
      style={{
        width: "100%",
        padding: "11px 14px",
        border: error ? "2px solid #dc2626" : "1px solid #d1d5db",
        background: error ? "#fef2f2" : "#fff",
        borderRadius: "8px",
        fontSize: "0.95rem",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
    {error && (
      <p style={{ color: "#dc2626", fontSize: "0.82rem", marginTop: "4px", marginBottom: 0, fontWeight: 600 }}>
        ⚠️ {error}
      </p>
    )}
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "32px 28px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 20px 60px rgba(22, 163, 74, 0.15)",
  },
  header: { textAlign: "center", marginBottom: "20px" },
  infoBox: {
    padding: "12px 16px",
    background: "#eff6ff",
    border: "1px solid #93c5fd",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  errorBox: {
    padding: "10px 14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "8px",
    marginBottom: "14px",
    fontSize: "0.9rem",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    marginTop: "8px",
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default NgoBankDetails; 
