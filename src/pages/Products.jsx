import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import {
  getPublicPanchgavyaSellers,
  submitPanchgavyaSeller,
} from "../services/api";

const CATEGORIES = [
  "Cow Ghee",
  "Panchgavya",
  "Organic Manure",
  "Cow Dung Dhoop",
  "Cow Dung Diyas",
  "Personal Care",
  "Other",
];

const EMPTY_FORM = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  websiteUrl: "",
  shortDescription: "",
  category: "",
  registrationNumber: "",
  address: "",
};

export default function Products() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logo, setLogo] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicPanchgavyaSellers()
      .then((result) => setSellers(result.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!logo || !certificate) {
      setError("Logo and registration certificate are required.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("logo", logo);
      formData.append("registrationCertificate", certificate);
      const result = await submitPanchgavyaSeller(formData);
      setMessage(result.message || "Submitted successfully.");
      setForm(EMPTY_FORM);
      setLogo(null);
      setCertificate(null);
    } catch (requestError) {
      setError(requestError.message || "Could not submit seller details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.productsPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <span className={styles.heroBadge}>VERIFIED PANCHGAVYA MARKETPLACE</span>
          <h1 className={styles.heroTitle}>Discover <span>Authentic Cow-Based Products</span></h1>
          <p className={styles.heroSubtitle}>
            Find verified sellers of Panchgavya and cow-based products. Submission details are reviewed by the admin before publication.
          </p>
          <button type="button" className={styles.readMoreBtn} onClick={() => setFormOpen(true)}>
            Submit your seller website
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.subHeadingTag}>Verified sellers</span>
            <h2 className={styles.sectionTitle}>Panchgavya Product Websites</h2>
            <p className={styles.sectionDesc}>Only submissions verified by the admin appear here with their logo and official website.</p>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", marginTop: "30px" }}>Loading verified sellers...</p>
          ) : error ? (
            <p style={{ textAlign: "center", marginTop: "30px", color: "#b91c1c" }}>{error}</p>
          ) : sellers.length === 0 ? (
            <div className={styles.infoBox} style={{ marginTop: "36px", textAlign: "center" }}>
              <h2>No verified sellers yet</h2>
              <p>Approved Panchgavya sellers will appear here after admin verification.</p>
            </div>
          ) : (
            <div className={styles.productGrid} style={{ marginTop: "36px" }}>
              {sellers.map((seller) => (
                <article key={seller.id} className={styles.productCard}>
                  <div className={styles.productImageWrapper} style={{ height: "180px", display: "grid", placeItems: "center", background: "#eef4ea" }}>
                    {seller.logo_url ? (
                      <img src={seller.logo_url} alt={`${seller.business_name} logo`} className={styles.productImage} style={{ objectFit: "contain", padding: "24px" }} />
                    ) : (
                      <strong style={{ fontSize: "2.2rem", color: "#2d5a27" }}>{seller.business_name?.slice(0, 1)}</strong>
                    )}
                    <span className={styles.categoryBadge}>{seller.category}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.productName}>{seller.business_name}</h3>
                    <p className={styles.productDesc}>{seller.short_description}</p>
                    {seller.registration_number && (
                      <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: "0.82rem" }}>
                        Registration: {seller.registration_number}
                      </p>
                    )}
                    <a className={styles.readMoreBtn} href={seller.website_url} target="_blank" rel="noopener noreferrer">
                      Visit seller website →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {formOpen && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setFormOpen(false)}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="seller-form-title">
            <h2 id="seller-form-title" style={{ marginTop: 0, color: "#21471c" }}>Register a Panchgavya Product Seller</h2>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              Submit the basic business and website details. Your listing will appear publicly only after admin verification.
            </p>
            {message && <div style={{ padding: "12px", background: "#dcfce7", color: "#166534", borderRadius: "8px" }}>{message}</div>}
            {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px" }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginTop: "18px" }}>
              <input name="businessName" value={form.businessName} onChange={handleChange} required placeholder="Business / Seller Name *" />
              <input name="ownerName" value={form.ownerName} onChange={handleChange} required placeholder="Owner / Contact Person *" />
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Official Email *" />
              <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone / WhatsApp *" />
              <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} required placeholder="Website (example.com) *" />
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select product category *</option>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="Registration / GST / License Number" />
              <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} required rows="4" placeholder="Short description of the website and products sold *" />
              <textarea name="address" value={form.address} onChange={handleChange} rows="2" placeholder="Business address" />
              <label>Business logo *<input type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setLogo(event.target.files?.[0] || null)} /></label>
              <label>Registration certificate *<input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required onChange={(event) => setCertificate(event.target.files?.[0] || null)} /></label>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setFormOpen(false)}>Cancel</button>
                <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit for verification"}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
