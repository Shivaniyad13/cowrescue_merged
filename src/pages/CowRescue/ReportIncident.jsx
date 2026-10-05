import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./ReportIncident.module.css";
import { reportCow } from "../../services/api";

const ANIMAL_CONDITIONS = [
  "Injured",
  "Accident",
  "Sick",
  "Weak/Malnourished",
  "Abandoned",
  "Trapped",
  "Other",
];

const ReportIncident = () => {
  const [formData, setFormData] = useState({
    reporter_name: "",
    reporter_phone: "",
    reporter_email: "",
    description: "",
    animal_condition: ANIMAL_CONDITIONS[0],
    address: "",
    latitude: "28.6139",
    longitude: "77.2090",
    state: "",
    district: "",
    city: "",
    pincode: "",
  });

  const [incidentPhoto, setIncidentPhoto] = useState(null);
  const [incidentVideo, setIncidentVideo] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successData, setSuccessData] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false);
  const [mediaType, setMediaType] = useState("image");

  const fieldRefs = {
    reporter_name: useRef(null),
    reporter_phone: useRef(null),
    reporter_email: useRef(null),
    description: useRef(null),
    address: useRef(null),
  };

  // ==================== VALIDATION ====================
  const isValidName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return false;
    return /^[a-zA-Z\s]+$/.test(trimmed);
  };

  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};

    if (!formData.reporter_name.trim()) {
      errors.reporter_name = "Name is required.";
    } else if (formData.reporter_name.trim().length < 2) {
      errors.reporter_name = "Name must be at least 2 characters.";
    } else if (!isValidName(formData.reporter_name)) {
      errors.reporter_name = "Name can only contain letters and spaces.";
    }

    if (!formData.reporter_phone.trim()) {
      errors.reporter_phone = "Mobile number is required.";
    } else if (!isValidPhone(formData.reporter_phone)) {
      errors.reporter_phone = "Enter a valid 10-digit Indian mobile (starts with 6-9).";
    }

    if (!formData.reporter_email.trim()) {
      errors.reporter_email = "Email address is required.";
    } else if (!isValidEmail(formData.reporter_email)) {
      errors.reporter_email = "Enter a valid email (e.g. name@example.com).";
    }

    if (!formData.description.trim()) {
      errors.description = "Please describe the situation.";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    if (!formData.address.trim()) {
      errors.address = "Please enter the location / area.";
    }

    return errors;
  };

  // ==================== HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

    if (name === "reporter_phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== CURRENT LOCATION ====================
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
            address: addr.road || addr.suburb || addr.neighbourhood || addr.village || prev.address,
            city: addr.city || addr.town || addr.village || addr.county || "",
            district: addr.state_district || addr.county || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
          }));

          setLocationFetched(true);

          setFieldErrors((prev) => {
            const next = { ...prev };
            delete next.address;
            return next;
          });
        } catch (err) {
          console.warn("Reverse geocode failed:", err.message);
          setFormData((prev) => ({
            ...prev,
            latitude: String(latitude),
            longitude: String(longitude),
          }));
          setLocationFetched(true);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        setErrorMsg("Could not fetch your location. Please enable location permission in browser.");
        console.warn(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==================== FILE HANDLERS ====================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Only JPG, PNG, WEBP images supported.");
      return;
    }

    setErrorMsg("");
    setIncidentPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Video size exceeds 10MB.");
      return;
    }
    setIncidentVideo(file);
  };

  const handleRemovePhoto = () => {
    setIncidentPhoto(null);
    setPhotoPreview(null);
  };

  const handleRemoveVideo = () => {
    setIncidentVideo(null);
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      const firstErrorKey = Object.keys(errors)[0];
      const errorCount = Object.keys(errors).length;
      setErrorMsg(
        errorCount === 1
          ? `⚠️ ${errors[firstErrorKey]}`
          : `⚠️ Please fix ${errorCount} errors below.`
      );

      const ref = fieldRefs[firstErrorKey];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("reporter_name", formData.reporter_name.trim());
      payload.append("reporter_phone", formData.reporter_phone);
      payload.append("reporter_email", formData.reporter_email.trim());
      payload.append("description", formData.description.trim());
      payload.append("animal_type", "Cow");
      payload.append("animal_condition", formData.animal_condition);
      payload.append("severity", "MEDIUM");
      payload.append("address", formData.address.trim());
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append("state", formData.state.trim());
      payload.append("district", formData.district.trim());
      payload.append("city", formData.city.trim());
      payload.append("pincode", formData.pincode.trim());

      if (incidentPhoto) payload.append("incidentPhoto", incidentPhoto);
      if (incidentVideo) payload.append("incidentVideo", incidentVideo);

      const res = await reportCow(payload);
      setSuccessData(res.data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit rescue report.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (name) =>
    fieldErrors[name] ? styles.inputError : "";

  // ==================== SUCCESS SCREEN ====================
  if (successData) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successBadge}>✅ Report Submitted Successfully</div>
          <h2>Thank You for Reporting!</h2>
          <p className={styles.successSub}>
            NGOs and Government helpline have been notified.
          </p>

          <div className={styles.ticketDetails}>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Case ID:</span>
              <span className={styles.ticketValue}>{successData.case_id}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Status:</span>
              <span className={styles.statusBadge}>{successData.status}</span>
            </div>
            <div className={styles.ticketItem}>
              <span className={styles.ticketLabel}>Submitted At:</span>
              <span>{new Date(successData.created_at).toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className={styles.successActions}>
            <Link to={`/cow-rescue/track?case=${successData.case_id}`} className={styles.btnPrimary}>
              🔍 Track Status
            </Link>
            <Link to="/cow-rescue" className={styles.btnSecondary}>
              ← Back to Cow Rescue Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Link to="/cow-rescue" className={styles.backLink}>
          ← Back to Portal
        </Link>
        <h1>🚨 Report an Injured Cow</h1>
        <p>
          Fill this form to report an injured, sick, or trapped cow. Your location helps
          rescue teams find the animal quickly.
        </p>
      </div>

      {errorMsg && (
        <div
          className={styles.errorAlert}
          style={{
            position: "sticky",
            top: "80px",
            zIndex: 100,
            boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
        {/* ═══ SECTION 1: Reporter Info ═══ */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>👤</span> Your Details
          </h3>
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_name">Your Name *</label>
              <input
                ref={fieldRefs.reporter_name}
                type="text"
                id="reporter_name"
                name="reporter_name"
                placeholder="Enter your name"
                value={formData.reporter_name}
                onChange={handleChange}
                className={fieldClass("reporter_name")}
                required
              />
              {fieldErrors.reporter_name && (
                <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_name}</p>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="reporter_phone">Mobile Number *</label>
              <input
                ref={fieldRefs.reporter_phone}
                type="tel"
                id="reporter_phone"
                name="reporter_phone"
                placeholder="10-digit mobile number"
                value={formData.reporter_phone}
                onChange={handleChange}
                className={fieldClass("reporter_phone")}
                inputMode="numeric"
                maxLength={10}
                required
              />
              {fieldErrors.reporter_phone && (
                <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_phone}</p>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reporter_email">Email Address *</label>
            <input
              ref={fieldRefs.reporter_email}
              type="email"
              id="reporter_email"
              name="reporter_email"
              placeholder="your.email@example.com"
              value={formData.reporter_email}
              onChange={handleChange}
              className={fieldClass("reporter_email")}
              required
            />
            {fieldErrors.reporter_email && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.reporter_email}</p>
            )}
          </div>
        </div>

        {/* ═══ SECTION 2: Cow Condition ═══ */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>🐄</span> Cow's Condition
          </h3>
          <div className={styles.fieldGroup}>
            <label htmlFor="animal_condition">What is the cow's condition? *</label>
            <select
              id="animal_condition"
              name="animal_condition"
              value={formData.animal_condition}
              onChange={handleChange}
              required
            >
              {ANIMAL_CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Describe the situation *</label>
            <textarea
              ref={fieldRefs.description}
              id="description"
              name="description"
              rows="4"
              placeholder="Describe what happened, visible injuries, and urgent needs..."
              value={formData.description}
              onChange={handleChange}
              className={fieldClass("description")}
              required
            ></textarea>
            {fieldErrors.description && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.description}</p>
            )}
          </div>
        </div>

        {/* ═══ SECTION 3: Location ═══ */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📍</span> Incident Location
          </h3>

          {/* Step 1: Address field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="address">
              Please provide exact address / area / landmark *
            </label>
            <input
              ref={fieldRefs.address}
              type="text"
              id="address"
              name="address"
              placeholder="e.g. Near Temple, Main Road, Sector 62"
              value={formData.address}
              onChange={handleChange}
              className={fieldClass("address")}
              required
            />
            {fieldErrors.address && (
              <p className={styles.fieldErrorMsg}>⚠️ {fieldErrors.address}</p>
            )}
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "6px" }}>
              💡 Include nearby landmark for faster rescue
            </p>
          </div>

          {/* OR Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "16px 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
            <span style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }}></div>
          </div>

          {/* Step 2: Use My Current Location button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "12px",
              background: locating
                ? "#94a3b8"
                : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: locating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
          >
            {locating
              ? "📡 Fetching your location..."
              : locationFetched
              ? "✅ Location Fetched — Click to Refresh"
              : "📡 Use My Current Location"}
          </button>

          {/* Location Fetched Confirmation */}
          {locationFetched && (formData.city || formData.state) && (
            <div
              style={{
                padding: "12px 16px",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "10px",
                fontSize: "0.88rem",
                color: "#166534",
              }}
            >
              ✅ Location detected:{" "}
              <strong>
                {[formData.city, formData.district, formData.state, formData.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </strong>
            </div>
          )}
        </div>

        {/* ═══ SECTION 4: Media ═══ */}
               {/* ═══ SECTION 4: Media ═══ */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <span>📎</span> Upload Evidence (Optional)
          </h3>

          {/* Media Type Dropdown */}
          <div className={styles.fieldGroup}>
            <label htmlFor="mediaType">Select media type</label>
            <select
              id="mediaType"
              value={mediaType}
              onChange={(e) => {
                setMediaType(e.target.value);
                // Reset existing media if type changes
                setIncidentPhoto(null);
                setPhotoPreview(null);
                setIncidentVideo(null);
                setErrorMsg("");
              }}
            >
              <option value="image">📷 Image</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>

          {/* File Upload based on dropdown */}
          {mediaType === "image" && (
            <>
              {!photoPreview ? (
                <div className={styles.fileDropArea}>
                  <input
                    type="file"
                    id="incidentPhoto"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className={styles.fileInputHidden}
                  />
                  <label htmlFor="incidentPhoto" className={styles.fileDropLabel}>
                    <span className={styles.uploadIcon}>📷</span>
                    <span>Click to Select Image</span>
                    <small style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "4px" }}>
                      JPG, PNG, WEBP • Max 5MB
                    </small>
                  </label>
                </div>
              ) : (
                <div className={styles.photoPreviewWrapper}>
                  <img src={photoPreview} alt="Preview" className={styles.previewImg} />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className={styles.btnRemovePhoto}
                  >
                    ✕ Remove Image
                  </button>
                </div>
              )}
            </>
          )}

          {mediaType === "video" && (
            <>
              {!incidentVideo ? (
                <div className={styles.fileDropArea}>
                  <input
                    type="file"
                    id="incidentVideo"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleVideoChange}
                    className={styles.fileInputHidden}
                  />
                  <label htmlFor="incidentVideo" className={styles.fileDropLabel}>
                    <span className={styles.uploadIcon}>🎥</span>
                    <span>Click to Select Video</span>
                    <small style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "4px" }}>
                      MP4, MOV, WEBM • Max 10MB
                    </small>
                  </label>
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: "1.5rem" }}>🎥</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#166534", marginBottom: "2px" }}>
                        Video selected
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {incidentVideo.name}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    style={{
                      padding: "6px 14px",
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className={styles.btnSubmit}>
          {isSubmitting ? "Submitting Emergency Report..." : "🚨 Submit Rescue Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;